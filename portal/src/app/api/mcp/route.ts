import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessTool } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, payload } = await req.json();
  const userPerms = (session.user as any).permissions || [];
  const userRole = (session.user as any).role || "unknown";
  const userId = (session.user as any).userId;

  if (!canAccessTool(userPerms, action)) {
    await logAudit({
      userId,
      roleName: userRole,
      actionType: "tool_denied",
      toolName: action,
      toolPayload: JSON.stringify(payload),
      resultStatus: "denied",
      resultSummary: `Unauthorized tool access attempt: ${action}`,
    });
    return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
  }

  try {
    const mcpUrl = process.env.MCP_URL || "http://localhost:8000";
    const mcpPayload = {
      user: {
        id: userId,
        email: session.user.email,
        role: userRole,
      },
      action,
      payload,
    };

    const portalSecret = process.env.PORTAL_SECRET || process.env.NEXTAUTH_SECRET || "";
    const mcpRes = await fetch(`${mcpUrl}/tools/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${portalSecret}`,
      },
      body: JSON.stringify(mcpPayload),
    });

    const result = await mcpRes.json();

    await logAudit({
      userId,
      roleName: userRole,
      actionType: "tool_call",
      toolName: action,
      toolPayload: JSON.stringify(payload),
      resultStatus: mcpRes.ok ? "success" : "error",
      resultSummary: JSON.stringify(result).slice(0, 500),
      awxJobId: result?.job || result?.id ? String(result.job || result.id) : undefined,
    });

    return NextResponse.json(result, { status: mcpRes.status });
  } catch (err: any) {
    await logAudit({
      userId,
      roleName: userRole,
      actionType: "tool_error",
      toolName: action,
      toolPayload: JSON.stringify(payload),
      resultStatus: "error",
      resultSummary: err.message,
    });
    return NextResponse.json({ error: "MCP request failed" }, { status: 502 });
  }
}
