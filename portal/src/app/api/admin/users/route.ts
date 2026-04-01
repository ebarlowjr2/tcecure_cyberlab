import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const perms = (session.user as any).permissions || [];
  if (!hasPermission(perms, PERMISSIONS.MANAGE_USERS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: { userRoles: { include: { role: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      isActive: u.isActive,
      role: u.userRoles[0]?.role?.name || "none",
      createdAt: u.createdAt,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const perms = (session.user as any).permissions || [];
  if (!hasPermission(perms, PERMISSIONS.MANAGE_USERS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, fullName, password, roleName } = await req.json();
  if (!email || !fullName || !password || !roleName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const role = await prisma.role.findUnique({ where: { name: roleName } });
  if (!role) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
      userRoles: { create: { roleId: role.id } },
    },
  });

  await logAudit({
    userId: (session.user as any).userId,
    roleName: (session.user as any).role,
    actionType: "user_created",
    resultStatus: "success",
    resultSummary: `Created user ${email} with role ${roleName}`,
  });

  return NextResponse.json({ id: user.id, email: user.email, fullName: user.fullName });
}
