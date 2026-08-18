import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  isValidPodId,
  normalizePodProgress,
  unavailableProgress,
  type LabStatusData,
} from "@/lib/pod-progress";

/**
 * Read-only pod training progress for the DigitalRCC portal.
 * Bearer token auth, scoped to the single pod in the URL. Returns lab
 * completion only — never credentials, student identity, or other pods.
 */

export const dynamic = "force-dynamic";

function tokenMatches(presented: string, expected: string): boolean {
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function authorized(req: NextRequest): boolean {
  const expected = process.env.POD_PROGRESS_API_TOKEN;
  if (!expected) return false;

  const header = req.headers.get("authorization") ?? "";
  const [scheme, value] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !value) return false;

  return tokenMatches(value, expected);
}

export async function GET(req: NextRequest, { params }: { params: { pod: string } }) {
  if (!process.env.POD_PROGRESS_API_TOKEN) {
    return NextResponse.json({ error: "POD_PROGRESS_API_TOKEN not configured" }, { status: 503 });
  }

  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pod = params.pod;
  if (!isValidPodId(pod)) {
    return NextResponse.json({ error: "Unknown pod" }, { status: 404 });
  }

  const mcpUrl = process.env.MCP_URL || "http://localhost:8000";
  const portalSecret = process.env.PORTAL_SECRET;
  if (!portalSecret) {
    return NextResponse.json({ error: "PORTAL_SECRET not configured" }, { status: 503 });
  }

  try {
    const mcpRes = await fetch(`${mcpUrl}/lab-status`, {
      headers: { Authorization: `Bearer ${portalSecret}` },
      cache: "no-store",
    });

    if (!mcpRes.ok) {
      return NextResponse.json(unavailableProgress(pod), { status: 200 });
    }

    const data = (await mcpRes.json()) as LabStatusData;
    if (!data?.pods?.[`pod${pod}`]) {
      return NextResponse.json(unavailableProgress(pod), { status: 200 });
    }

    return NextResponse.json(normalizePodProgress(pod, data), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(unavailableProgress(pod), { status: 200 });
  }
}
