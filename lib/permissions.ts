import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

//user roles
export const userRoles = ac.newRole({
  user: [],
});

//Admin roles
export const adminRole = ac.newRole({
  user: ["list", "set-password", "update"],
});

//super admin roles
export const superadminRole = ac.newRole({
  ...adminAc.statements,
});

//roles
export const roles = {
  user: userRoles,
  admin: adminRole,
  superadmin: superadminRole,
} as const;

export type RoleName = keyof typeof roles;
