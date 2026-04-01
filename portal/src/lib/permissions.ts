export const PERMISSIONS = {
  AI_CHAT: "ai.chat.access",
  RESEED_LAB: "tools.reseed_lab",
  RESET_POD: "tools.reset_pod",
  VIEW_LOGS: "tools.view_logs",
  MANAGE_USERS: "users.manage",
  MANAGE_ROLES: "roles.manage",
  FULL_ACCESS: "system.full_access",
} as const;

export const TOOL_PERMISSION_MAP: Record<string, string> = {
  reset_pod: PERMISSIONS.RESET_POD,
  reseed_lab: PERMISSIONS.RESEED_LAB,
};

export function hasPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes(PERMISSIONS.FULL_ACCESS) || userPermissions.includes(required);
}

export function canAccessTool(userPermissions: string[], toolName: string): boolean {
  const requiredPerm = TOOL_PERMISSION_MAP[toolName];
  if (!requiredPerm) return false;
  return hasPermission(userPermissions, requiredPerm);
}
