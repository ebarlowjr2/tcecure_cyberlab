import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const globalAdmin = await prisma.role.upsert({
    where: { name: "global_admin" },
    update: {},
    create: { name: "global_admin" },
  });
  const cyberlabAdmin = await prisma.role.upsert({
    where: { name: "cyberlab_admin" },
    update: {},
    create: { name: "cyberlab_admin" },
  });
  const student = await prisma.role.upsert({
    where: { name: "student" },
    update: {},
    create: { name: "student" },
  });

  // Create permissions
  const permDefs = [
    { permissionKey: "ai.chat.access", description: "Access to AI chat interface" },
    { permissionKey: "tools.reseed_lab", description: "Trigger lab reseed operations" },
    { permissionKey: "tools.reset_pod", description: "Trigger pod reset operations" },
    { permissionKey: "tools.view_logs", description: "View audit logs" },
    { permissionKey: "users.manage", description: "Manage portal users" },
    { permissionKey: "roles.manage", description: "Manage roles and permissions" },
    { permissionKey: "system.full_access", description: "Full system access" },
  ];

  const perms: Record<string, any> = {};
  for (const p of permDefs) {
    perms[p.permissionKey] = await prisma.permission.upsert({
      where: { permissionKey: p.permissionKey },
      update: {},
      create: p,
    });
  }

  // Map permissions to roles
  const globalAdminPerms = [
    "ai.chat.access", "tools.reseed_lab", "tools.reset_pod",
    "tools.view_logs", "users.manage", "roles.manage", "system.full_access",
  ];
  const cyberlabAdminPerms = ["ai.chat.access", "tools.reseed_lab", "tools.reset_pod"];

  for (const pk of globalAdminPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: globalAdmin.id, permissionId: perms[pk].id } },
      update: {},
      create: { roleId: globalAdmin.id, permissionId: perms[pk].id },
    });
  }

  for (const pk of cyberlabAdminPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: cyberlabAdmin.id, permissionId: perms[pk].id } },
      update: {},
      create: { roleId: cyberlabAdmin.id, permissionId: perms[pk].id },
    });
  }

  // Create seed users
  const adminHash = await bcrypt.hash("CyberAdmin2026!", 12);
  const labAdminHash = await bcrypt.hash("LabAdmin2026!", 12);
  const studentHash = await bcrypt.hash("Student2026!", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@tcecure.com" },
    update: {},
    create: {
      email: "admin@tcecure.com",
      fullName: "Eddie Barlow",
      passwordHash: adminHash,
      userRoles: { create: { roleId: globalAdmin.id } },
    },
  });

  const labUser = await prisma.user.upsert({
    where: { email: "labadmin@tcecure.com" },
    update: {},
    create: {
      email: "labadmin@tcecure.com",
      fullName: "Lab Administrator",
      passwordHash: labAdminHash,
      userRoles: { create: { roleId: cyberlabAdmin.id } },
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@tcecure.com" },
    update: {},
    create: {
      email: "student@tcecure.com",
      fullName: "Test Student",
      passwordHash: studentHash,
      userRoles: { create: { roleId: student.id } },
    },
  });

  console.log("Seed complete:");
  console.log("  Global Admin: admin@tcecure.com / CyberAdmin2026!");
  console.log("  CyberLab Admin: labadmin@tcecure.com / LabAdmin2026!");
  console.log("  Student: student@tcecure.com / Student2026!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
