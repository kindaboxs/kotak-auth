/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";

import { hashPassword, verifyPassword } from "@/lib/argon2";
import { ac, roles } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { UserRole } from "@/lib/generated/prisma/enums";
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
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const adminEmails = env.ADMIN_EMAILS.includes(user.email);

          if (adminEmails) {
            return {
              data: {
                ...user,
                role: UserRole.ADMIN,
              },
            };
          }

          return {
            data: user,
          };
        },
      },
    },
  },
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
        if (!ctx.body.email || typeof ctx.body.email !== "string") {
          throw new APIError("BAD_REQUEST", {
            code: "BAD_REQUEST",
            message: "Email is required and must be a string.",
          });
        }

        if (!ctx.body.name || typeof ctx.body.name !== "string") {
          throw new APIError("BAD_REQUEST", {
            code: "BAD_REQUEST",
            message: "Name is required and must be a string.",
          });
        }

        const email = String(ctx.body.email);
        const emailParts = email.split("@");

        if (emailParts.length !== 2 || !emailParts[1]) {
          throw new APIError("BAD_REQUEST", {
            code: "BAD_REQUEST",
            message: "Invalid email format. Please use a valid email.",
          });
        }

        const domain = emailParts[1].toLowerCase();
        const validDomain = getValidEmailDomains();

        if (
          !validDomain.map((domain) => domain.toLowerCase()).includes(domain)
        ) {
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
  plugins: [
    username(),
    nextCookies(),
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles: roles,
    }),
  ],
  secret: env.BETTER_AUTH_SECRET,
  socialProviders: {
    github: {
      enabled: true,
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 3,
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
        defaultValue: "USER",
      },
    },
  },
} satisfies BetterAuthOptions;
