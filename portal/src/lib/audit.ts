import prisma from "./prisma";

interface AuditEntry {
  userId?: string;
  roleName?: string;
  actionType: string;
  promptText?: string;
  toolName?: string;
  toolPayload?: string;
  resultStatus?: string;
  resultSummary?: string;
  awxJobId?: string;
}

export async function logAudit(entry: AuditEntry) {
  try {
    await prisma.auditLog.create({ data: entry });
  } catch (err) {
    console.error("Audit log error:", err);
  }
}
