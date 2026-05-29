import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_PASSWORDS: Record<string, string> = {
  "admin@bhaf.example": "ChangeMe!123",
  "amara@greenweave.example": "Founder!123",
  "fund@mosaic.example": "Funder!123",
};

/**
 * Bulletproof diagnostic — catches every conceivable error and reports
 * it as JSON so we can see what's failing instead of an HTTP 500.
 */

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

async function safeCall<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; label: string; error: string }> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    return {
      ok: false,
      label,
      error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    };
  }
}

function extractHost(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const emailParam = (url.searchParams.get("email") ?? "admin@bhaf.example").trim().toLowerCase();
  const passwordParam = url.searchParams.get("password") ?? DEMO_PASSWORDS[emailParam] ?? "ChangeMe!123";

  const envSummary = {
    NODE_ENV: process.env.NODE_ENV,
    has_DATABASE_URL: Boolean(process.env.DATABASE_URL),
    DATABASE_URL_prefix: process.env.DATABASE_URL?.slice(0, 14) ?? null,
    DATABASE_URL_host_hint: extractHost(process.env.DATABASE_URL ?? ""),
    has_AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    has_SETUP_TOKEN: Boolean(process.env.SETUP_TOKEN),
    SETUP_TOKEN_length: process.env.SETUP_TOKEN?.length ?? 0,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? "unknown",
    region: process.env.VERCEL_REGION ?? "unknown",
  };

  // Step 1: import DB module so we catch import-time errors
  const dbModule = await safeCall("import @/lib/db", async () => await import("@/lib/db"));
  if (!dbModule.ok) {
    return jsonResponse({ ok: false, env: envSummary, failed_at: dbModule.label, error: dbModule.error });
  }
  const { prisma, DB_ENABLED } = dbModule.data;
  if (!DB_ENABLED || !prisma) {
    return jsonResponse({
      ok: false,
      env: envSummary,
      failed_at: "DB_ENABLED check",
      error: "DATABASE_URL is unset or matches the placeholder string.",
    });
  }

  // Step 2: raw connection check
  const conn = await safeCall(
    "prisma.$queryRaw SELECT 1",
    async () => await prisma.$queryRaw`SELECT 1 as ok`,
  );
  if (!conn.ok) {
    return jsonResponse({
      ok: false,
      env: envSummary,
      failed_at: conn.label,
      error: conn.error,
      hint:
        "Database is unreachable. If using Neon, switch DATABASE_URL to the POOLED connection string (hostname contains '-pooler'). Standard Neon endpoints exhaust connections under serverless load.",
    });
  }

  // Step 3: count users
  const countResult = await safeCall("prisma.user.count", async () => await prisma.user.count());
  if (!countResult.ok) {
    return jsonResponse({
      ok: false,
      env: envSummary,
      failed_at: countResult.label,
      error: countResult.error,
      hint:
        "Database is reachable but the User table doesn't exist. Run /api/setup?action=push&token=... first.",
    });
  }

  // Step 4: look up the user
  const userResult = await safeCall(
    "prisma.user.findUnique",
    async () =>
      await prisma.user.findUnique({
        where: { email: emailParam },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          passwordHash: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
  );
  if (!userResult.ok) {
    return jsonResponse({
      ok: false,
      env: envSummary,
      failed_at: userResult.label,
      error: userResult.error,
      totalUsersInDb: countResult.data,
    });
  }
  const user = userResult.data;

  if (!user) {
    const allResult = await safeCall("prisma.user.findMany (list)", async () =>
      await prisma.user.findMany({
        select: { email: true, role: true, status: true },
        take: 25,
      }),
    );
    return jsonResponse({
      ok: false,
      env: envSummary,
      stage: "user_lookup",
      reason: "User does not exist for that email.",
      normalisedEmailQueried: emailParam,
      totalUsersInDb: countResult.data,
      existingUsers: allResult.ok ? allResult.data : `error: ${allResult.error}`,
      hint: "Run /api/setup?action=seed&token=... to create demo accounts.",
    });
  }

  if (!user.passwordHash) {
    return jsonResponse({
      ok: false,
      env: envSummary,
      stage: "password_hash_missing",
      reason: "User exists but has no passwordHash.",
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
      hint: "Re-run /api/setup?action=seed&token=... to set the hash.",
    });
  }

  // Step 5: bcrypt compare
  const compareResult = await safeCall("bcrypt.compare", async () =>
    await bcrypt.compare(passwordParam, user.passwordHash!),
  );
  if (!compareResult.ok) {
    return jsonResponse({
      ok: false,
      env: envSummary,
      stage: "bcrypt_error",
      error: compareResult.error,
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
      passwordHashPrefix: user.passwordHash.slice(0, 7),
      passwordHashLength: user.passwordHash.length,
    });
  }

  return jsonResponse({
    ok: compareResult.data,
    env: envSummary,
    stage: compareResult.data ? "match" : "password_mismatch",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    diagnostics: {
      totalUsersInDb: countResult.data,
      passwordTriedLength: passwordParam.length,
      passwordHashAlgoMarker: user.passwordHash.slice(0, 7),
      passwordHashLength: user.passwordHash.length,
      hint: compareResult.data
        ? "Sign-in WILL succeed with these exact credentials."
        : "Stored hash does not validate this password. Hit /api/setup?action=seed&token=... to overwrite.",
    },
    statusGateCheck:
      user.status === "ACTIVE" || user.status === "PENDING_VERIFICATION"
        ? "ok"
        : `Sign-in would be rejected — user.status is ${user.status}, should be ACTIVE.`,
  });
}
