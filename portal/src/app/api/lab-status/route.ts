import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;
  const userPerms = (session.user as any).permissions || [];

  // Students can only see their own pod; admins see all
  const isAdmin = role === "global_admin" || role === "cyberlab_admin";
  const hasAccess = isAdmin || userPerms.includes("system.full_access");

  if (!hasAccess && role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const mcpUrl = process.env.MCP_URL || "http://localhost:8000";
    const portalSecret = process.env.PORTAL_SECRET;
    if (!portalSecret) {
      return NextResponse.json({ error: "PORTAL_SECRET not configured" }, { status: 500 });
    }

    const mcpRes = await fetch(`${mcpUrl}/lab-status`, {
      headers: {
        Authorization: `Bearer ${portalSecret}`,
      },
    });

    const data = await mcpRes.json();

    // If student, filter to only their assigned pod(s)
    // For now, students see all pods - pod scoping will be
    // enforced once enrollment assigns pod_id to students
    if (role === "student") {
      return NextResponse.json(data);
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Failed to fetch lab status", detail: message }, { status: 502 });
  }
}
