import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma, DB_ENABLED } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ENTREPRENEUR" | "FUNDER" | "CORPORATE" | "ADMIN" | "AUDITOR";
    } & DefaultSession["user"];
  }
  interface User {
    role?: "ENTREPRENEUR" | "FUNDER" | "CORPORATE" | "ADMIN" | "AUDITOR";
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Providers are conditionally enabled based on env vars so a fresh
// install never crashes — operators add credentials as they're ready.
const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Email & password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(creds) {
      if (!prisma) return null;
      const parsed = credentialsSchema.safeParse(creds);
      if (!parsed.success) return null;
      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });
      if (!user || !user.passwordHash) return null;
      if (user.status !== "ACTIVE" && user.status !== "PENDING_VERIFICATION") return null;
      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        role: user.role,
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

if (process.env.AUTH_RESEND_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL_FROM ?? "BHAF MarketBridge <noreply@bhaf.example>",
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DB_ENABLED && prisma ? PrismaAdapter(prisma) : undefined,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? "dev-only-fallback-secret-rotate-me",
  providers,
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "ENTREPRENEUR";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        const role = token.role as
          | "ENTREPRENEUR"
          | "FUNDER"
          | "CORPORATE"
          | "ADMIN"
          | "AUDITOR"
          | undefined;
        session.user.role = role ?? "ENTREPRENEUR";
      }
      return session;
    },
    async authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isProtected =
        path.startsWith("/portal/entrepreneur") ||
        path.startsWith("/portal/funder") ||
        path.startsWith("/portal/corporate") ||
        path.startsWith("/admin");
      if (!isProtected) return true;
      if (!auth?.user) return false;

      // Role gating
      if (path.startsWith("/admin")) return auth.user.role === "ADMIN" || auth.user.role === "AUDITOR";
      if (path.startsWith("/portal/funder")) return auth.user.role === "FUNDER" || auth.user.role === "ADMIN";
      if (path.startsWith("/portal/corporate")) return auth.user.role === "CORPORATE" || auth.user.role === "ADMIN";
      if (path.startsWith("/portal/entrepreneur"))
        return auth.user.role === "ENTREPRENEUR" || auth.user.role === "ADMIN";
      return true;
    },
  },
});

