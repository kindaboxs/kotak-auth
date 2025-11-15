/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";

import { hashPassword, verifyPassword } from "@/lib/argon2";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { getNormalizedName, getValidEmailDomains } from "@/utils";

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
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];
        const validDomain = getValidEmailDomains();

        if (!validDomain.includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            code: "BAD_REQUEST",
            message: "Invalid email domain. Please use a valid email.",
          });
        }

        const name = getNormalizedName(ctx.body.name);

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },
  plugins: [username(), nextCookies()],
  secret: env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 3,
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
} satisfies BetterAuthOptions;
