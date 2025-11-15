import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

import { UserRole } from "@/lib/generated/prisma/enums";

const statement = {
  ...defaultStatements,
  blogs: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  [UserRole.ADMIN]: ac.newRole({
    blogs: ["create", "read", "update", "delete", "update:own", "delete:own"],
    ...adminAc.statements,
  }),
  [UserRole.USER]: ac.newRole({
    blogs: ["create", "read", "update:own", "delete:own"],
  }),
};
