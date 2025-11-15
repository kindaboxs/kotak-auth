import type { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";

import { hashPassword, verifyPassword } from "@/lib/argon2";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export const authConfig = {
  appName: "kotak-auth",
  advanced: {
    database: {
      generateId: false,
    },
  },
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    password: {
      hash: (password) => hashPassword(password),
      verify: (data) => verifyPassword(data.password, data.hash),
    },
  },
  plugins: [username(), nextCookies()],
  secret: env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 3,
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
} satisfies BetterAuthOptions;
