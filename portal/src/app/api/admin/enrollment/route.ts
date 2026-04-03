import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: List all students with their pod assignments
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const perms = (session.user as any).permissions || [];
  if (!hasPermission(perms, PERMISSIONS.MANAGE_USERS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const students = await prisma.user.findMany({
    where: {
      userRoles: { some: { role: { name: "student" } } },
    },
    include: {
      userRoles: { include: { role: true } },
      podScopes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    students.map((s) => ({
      id: s.id,
      email: s.email,
      fullName: s.fullName,
      isActive: s.isActive,
      pods: s.podScopes.map((ps) => ps.podId),
      createdAt: s.createdAt,
    }))
  );
}

// POST: Enroll a new student
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const perms = (session.user as any).permissions || [];
  if (!hasPermission(perms, PERMISSIONS.MANAGE_USERS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, fullName, password, podId } = await req.json();
  if (!email || !fullName || !password) {
    return NextResponse.json({ error: "email, fullName, and password are required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  const studentRole = await prisma.role.findUnique({ where: { name: "student" } });
  if (!studentRole) {
    return NextResponse.json({ error: "Student role not found in database" }, { status: 500 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
      userRoles: { create: { roleId: studentRole.id } },
      ...(podId
        ? { podScopes: { create: { podId } } }
        : {}),
    },
    include: { podScopes: true },
  });

  await logAudit({
    userId: (session.user as any).userId,
    roleName: (session.user as any).role,
    actionType: "student_enrolled",
    resultStatus: "success",
    resultSummary: `Enrolled student ${email}${podId ? ` → ${podId}` : ""}`,
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    pods: user.podScopes.map((ps) => ps.podId),
  });
}

// PATCH: Update pod assignment for a student
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const perms = (session.user as any).permissions || [];
  if (!hasPermission(perms, PERMISSIONS.MANAGE_USERS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, podId, action } = await req.json();
  if (!userId || !podId) {
    return NextResponse.json({ error: "userId and podId are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (action === "remove") {
    await prisma.podScope.deleteMany({
      where: { userId, podId },
    });
    await logAudit({
      userId: (session.user as any).userId,
      roleName: (session.user as any).role,
      actionType: "pod_unassigned",
      resultStatus: "success",
      resultSummary: `Removed ${user.email} from ${podId}`,
    });
  } else {
    // Check if already assigned
    const existing = await prisma.podScope.findFirst({
      where: { userId, podId },
    });
    if (!existing) {
      await prisma.podScope.create({
        data: { userId, podId },
      });
      await logAudit({
        userId: (session.user as any).userId,
        roleName: (session.user as any).role,
        actionType: "pod_assigned",
        resultStatus: "success",
        resultSummary: `Assigned ${user.email} to ${podId}`,
      });
    }
  }

  const updated = await prisma.user.findUnique({
    where: { id: userId },
    include: { podScopes: true },
  });

  return NextResponse.json({
    id: updated!.id,
    email: updated!.email,
    fullName: updated!.fullName,
    pods: updated!.podScopes.map((ps) => ps.podId),
  });
}
