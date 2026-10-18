import NextAuth, { CredentialsSignin, type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { sendEmail } from "@/lib/email";

import { authConfig } from "@/auth.config";
import { prisma, DB_ENABLED } from "@/lib/db";
import { validateDemoCredentials } from "@/lib/demoAccounts";
import { getDemoRegisteredUsersFromCookieHeader } from "@/lib/demoRegistrations";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ENTREPRENEUR" | "FUNDER" | "CORPORATE" | "ADMIN" | "AUDITOR";
      status?: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" | "DELETED";
    } & DefaultSession["user"];
  }
  interface User {
    role?: "ENTREPRENEUR" | "FUNDER" | "CORPORATE" | "ADMIN" | "AUDITOR";
    status?: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" | "DELETED";
  }
}

export class AccountDeactivatedError extends CredentialsSignin {
  code = "account_deactivated";
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Email & password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(creds, request) {
      const parsed = credentialsSchema.safeParse(creds);
      if (!parsed.success) return null;
      const email = parsed.data.email.trim().toLowerCase();
      if (!DB_ENABLED) {
        const demo = validateDemoCredentials(email, parsed.data.password);
        if (demo) {
          return {
            id: demo.id,
            email: demo.email,
            name: demo.name,
            role: demo.role,
            status: "ACTIVE",
          };
        }

        const cookieHeader = request.headers?.get("cookie") ?? null;
        const registered = getDemoRegisteredUsersFromCookieHeader(cookieHeader).find(
          (user) => user.email === email,
        );
        if (!registered) return null;

        const ok = await bcrypt.compare(parsed.data.password, registered.passwordHash);
        if (!ok) return null;

        return {
          id: registered.id,
          email: registered.email,
          name: registered.name,
          role: registered.role,
          status: "ACTIVE",
        };
      }
      if (!prisma) return null;
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user || !user.passwordHash) return null;
      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) return null;
      if (user.status === "SUSPENDED") throw new AccountDeactivatedError();
      if (user.status !== "ACTIVE" && user.status !== "PENDING_VERIFICATION") return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        role: user.role,
        status: user.status,
      };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

// Add a custom Email provider that hooks into our unified email sender
providers.push({
  id: "email",
  type: "email",
  name: "Email",
  server: "", // Not used because we override sendVerificationRequest
  from: process.env.EMAIL_FROM ?? "BHAF MarketBridge <noreply@bhaf.example>",
  maxAge: 24 * 60 * 60,
  options: {},
  sendVerificationRequest: async ({ identifier: to, url }: { identifier: string; url: string }) => {
    await sendEmail({
      to,
      subject: "Sign in to BHAF MarketBridge",
      body: `Use this link to sign in to your MarketBridge account:\n\n${url}\n\nThis link will expire in 24 hours.`,
      ctaLabel: "Sign in to MarketBridge",
      ctaUrl: url,
    });
  },
} as any);

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  adapter: DB_ENABLED && prisma ? PrismaAdapter(prisma) : undefined,
  providers,
});
