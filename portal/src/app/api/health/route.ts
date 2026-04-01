import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const mcpUrl = process.env.MCP_URL || "http://localhost:8000";
  const openhandsUrl = process.env.OPENHANDS_URL || "http://localhost:3000";

  const results: Record<string, { status: string; detail?: string }> = {};

  // Check MCP server health
  try {
    const mcpRes = await fetch(`${mcpUrl}/health`, { signal: AbortSignal.timeout(5000) });
    if (mcpRes.ok) {
      const data = await mcpRes.json();
      results.mcp = { status: "connected", detail: `v${data.version || "unknown"}` };
    } else {
      results.mcp = { status: "error", detail: `HTTP ${mcpRes.status}` };
    }
  } catch {
    results.mcp = { status: "offline" };
  }

  // Check OpenHands health
  try {
    const ohRes = await fetch(`${openhandsUrl}/api/options/config`, { signal: AbortSignal.timeout(5000) });
    if (ohRes.ok) {
      results.openhands = { status: "connected" };
    } else {
      results.openhands = { status: "error", detail: `HTTP ${ohRes.status}` };
    }
  } catch {
    results.openhands = { status: "offline" };
  }

  return NextResponse.json(results);
}
