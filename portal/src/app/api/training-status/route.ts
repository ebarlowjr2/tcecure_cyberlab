import { NextResponse } from "next/server";

/**
 * Public API endpoint for training status data.
 * No authentication required — lab completion data is not sensitive.
 * Used by the standalone training status pages and Guacamole banner links.
 */
export async function GET() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=30",
  };

  try {
    const mcpUrl = process.env.MCP_URL || "http://localhost:8000";
    const portalSecret = process.env.PORTAL_SECRET;
    if (!portalSecret) {
      return NextResponse.json(
        { error: "PORTAL_SECRET not configured" },
        { status: 500, headers }
      );
    }

    const mcpRes = await fetch(`${mcpUrl}/lab-status`, {
      headers: {
        Authorization: `Bearer ${portalSecret}`,
      },
    });

    const data = await mcpRes.json();

    if (!mcpRes.ok) {
      return NextResponse.json(
        { error: data?.detail || "MCP error", detail: data },
        { status: mcpRes.status, headers }
      );
    }

    return NextResponse.json(data, { headers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch lab status", detail: message },
      { status: 502, headers }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
