import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Edge middleware — must NOT import Prisma, bcrypt, crypto, Resend, or
 * anything from `@/auth` (full config). The `auth.config.ts` file is
 * deliberately lean so this stays Edge-compatible.
 */
export default auth((req) => {
  const res = NextResponse.next();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  res.headers.set("X-DNS-Prefetch-Control", "on");
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  const url = req.nextUrl;
  const isProtected =
    url.pathname.startsWith("/portal/entrepreneur") ||
    url.pathname.startsWith("/portal/funder") ||
    url.pathname.startsWith("/portal/corporate") ||
    url.pathname.startsWith("/admin");

  if (isProtected && !req.auth) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("next", url.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return res;
});

export const config = {
  // Skip Next internals, static assets, and ALL API routes (server actions
  // and Auth.js handlers don't need middleware to redirect them).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|media/|api/).*)"],
};
