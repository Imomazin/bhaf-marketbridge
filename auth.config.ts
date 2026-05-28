import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config.
 *
 * Importing the full `auth.ts` into middleware pulls in Prisma + bcrypt +
 * crypto + Resend which the Edge runtime can't bundle. This file holds
 * only the pieces middleware actually needs (callbacks + pages), and the
 * full `auth.ts` extends it with the providers and adapter.
 */
export const authConfig: NextAuthConfig = {
  // Providers are added in auth.ts; middleware doesn't need them.
  providers: [],
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? "dev-only-fallback-secret-rotate-me",
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "ENTREPRENEUR";
        token.id = (user as { id?: string }).id ?? token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
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

      if (path.startsWith("/admin"))
        return auth.user.role === "ADMIN" || auth.user.role === "AUDITOR";
      if (path.startsWith("/portal/funder"))
        return auth.user.role === "FUNDER" || auth.user.role === "ADMIN";
      if (path.startsWith("/portal/corporate"))
        return auth.user.role === "CORPORATE" || auth.user.role === "ADMIN";
      if (path.startsWith("/portal/entrepreneur"))
        return auth.user.role === "ENTREPRENEUR" || auth.user.role === "ADMIN";
      return true;
    },
  },
};
