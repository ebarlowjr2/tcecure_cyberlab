import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessTool, PERMISSIONS, hasPermission } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

const TOOL_PATTERNS: Record<string, RegExp> = {
  reset_pod: /reset\s+pod\s*(\w+)/i,
  reseed_lab: /reseed\s+pod\s*(\w+)\s+(?:with\s+)?(\w+)/i,
};

function parseIntent(message: string): { action: string; payload: Record<string, string> } | null {
  for (const [action, pattern] of Object.entries(TOOL_PATTERNS)) {
    const match = message.match(pattern);
    if (match) {
      if (action === "reset_pod") return { action, payload: { pod_id: match[1] } };
      if (action === "reseed_lab") return { action, payload: { pod_id: match[1], lab: match[2] } };
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  const userPerms = (session.user as any).permissions || [];
  const userRole = (session.user as any).role || "unknown";
  const userId = (session.user as any).userId;

  if (!hasPermission(userPerms, PERMISSIONS.AI_CHAT)) {
    return NextResponse.json({ error: "You do not have AI chat access" }, { status: 403 });
  }

  await logAudit({
    userId,
    roleName: userRole,
    actionType: "ai_prompt",
    promptText: message,
    resultStatus: "received",
  });

  const intent = parseIntent(message);

  if (intent) {
    if (!canAccessTool(userPerms, intent.action)) {
      await logAudit({
        userId,
        roleName: userRole,
        actionType: "tool_denied",
        promptText: message,
        toolName: intent.action,
        toolPayload: JSON.stringify(intent.payload),
        resultStatus: "denied",
        resultSummary: "Role " + userRole + " cannot use " + intent.action,
      });
      return NextResponse.json({
        response: "You don't have permission to use the " + intent.action + " tool. Contact your administrator.",
      });
    }

    try {
      const mcpUrl = process.env.MCP_URL || "http://localhost:8000";
      const mcpPayload = {
        user: { id: userId, email: session.user.email, role: userRole },
        action: intent.action,
        payload: intent.payload,
      };

      const mcpRes = await fetch(mcpUrl + "/tools/" + intent.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mcpPayload),
      });

      const result = await mcpRes.json();

      await logAudit({
        userId,
        roleName: userRole,
        actionType: "tool_call",
        promptText: message,
        toolName: intent.action,
        toolPayload: JSON.stringify(intent.payload),
        resultStatus: mcpRes.ok ? "success" : "error",
        resultSummary: JSON.stringify(result).slice(0, 500),
        awxJobId: result?.job || result?.id ? String(result.job || result.id) : undefined,
      });

      if (mcpRes.ok) {
        return NextResponse.json({
          response: "Executed " + intent.action + " for " + intent.payload.pod_id + (intent.payload.lab ? " with lab " + intent.payload.lab : "") + ".\n\nAWX Response:\n" + JSON.stringify(result, null, 2),
        });
      } else {
        return NextResponse.json({
          response: "Failed to execute " + intent.action + ": " + (result.detail || JSON.stringify(result)),
        });
      }
    } catch (err: any) {
      await logAudit({
        userId,
        roleName: userRole,
        actionType: "tool_error",
        promptText: message,
        toolName: intent.action,
        resultStatus: "error",
        resultSummary: err.message,
      });
      return NextResponse.json({
        response: "Error connecting to MCP server: " + err.message,
      });
    }
  }

  const availableTools = [];
  if (canAccessTool(userPerms, "reset_pod")) availableTools.push("reset_pod");
  if (canAccessTool(userPerms, "reseed_lab")) availableTools.push("reseed_lab");

  return NextResponse.json({
    response: 'I understand your request: "' + message + '"\n\nI can help you with the following lab operations:\n' + availableTools.map((t) => "- " + t).join("\n") + '\n\nExamples:\n- "reset pod03"\n- "reseed pod04 with IA"\n\nPlease phrase your request using one of these patterns.',
  });
}
