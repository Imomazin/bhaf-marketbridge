import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { canAccessRouteForRole, getRoleHome, isRoleScopedRoute, type AppRole } from "@/lib/routeAccess";

const { auth } = NextAuth(authConfig);

/**
 * Edge proxy — must NOT import Prisma, bcrypt, crypto, Resend, or
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

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(process.env.NODE_ENV === "production" ? [] : ["'unsafe-eval'"]),
    "https://challenges.cloudflare.com",
    "https://*.sentry.io",
  ].join(" ");
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.google.com",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSrc}`,
    "font-src 'self' data:",
    "connect-src 'self' https://*.sentry.io https://api.anthropic.com https://www.virustotal.com https://api.paystack.co https://api.smileidentity.com https://*.upstash.io",
    "frame-src 'self' https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  res.headers.set("Content-Security-Policy", csp);

  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  const url = req.nextUrl;
  const role = (req.auth?.user?.role as AppRole | undefined) ?? null;
  if (url.pathname === "/portal" && role) {
    return NextResponse.redirect(new URL(getRoleHome(role), req.url));
  }

  if (isRoleScopedRoute(url.pathname) && !req.auth) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("next", url.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isRoleScopedRoute(url.pathname) && req.auth && !canAccessRouteForRole(url.pathname, role)) {
    return NextResponse.redirect(new URL(getRoleHome(role), req.url));
  }

  return res;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|media/|api/).*)"],
};
