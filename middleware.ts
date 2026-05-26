import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Apply security headers to every response and let Auth.js gate
// protected portal routes via the `authorized` callback.
export default auth((req) => {
  const res = NextResponse.next();

  // Strict security headers — production-grade defaults.
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

  // Redirect unauthenticated users hitting a protected route to sign-in.
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
  matcher: [
    // Skip Next internals and static files, hit everything else.
    "/((?!_next/static|_next/image|favicon.ico|media/|api/auth).*)",
  ],
};
