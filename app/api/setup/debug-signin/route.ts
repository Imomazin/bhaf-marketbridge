import crypto from "crypto";
import bcrypt from "bcryptjs";

import { prisma, DB_ENABLED } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Token-gated diagnostic that checks whether a given email + password
 * combination is acceptable, and explains exactly which step fails.
 * Use this when sign-in mysteriously rejects credentials that should
 * work — the response tells you whether the user exists, whether the
 * password matches the stored hash, and what the user's status is.
 *
 * Disarm by removing SETUP_TOKEN from Vercel.
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

function tokenIsValid(provided: string | null, expected: string | undefined): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const provided = url.searchParams.get("token");
  const expected = process.env.SETUP_TOKEN;

  if (!expected) {
    return jsonResponse(
      { ok: false, error: "Setup endpoint is disabled (SETUP_TOKEN unset)." },
      503,
    );
  }
  if (!tokenIsValid(provided, expected)) {
    return jsonResponse({ ok: false, error: "Invalid or missing token." }, 401);
  }
  if (!DB_ENABLED || !prisma) {
    return jsonResponse({ ok: false, error: "DATABASE_URL is not configured." }, 503);
  }

  const emailParam = url.searchParams.get("email") ?? "admin@bhaf.example";
  const passwordParam = url.searchParams.get("password") ?? "ChangeMe!123";

  const normalisedEmail = emailParam.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalisedEmail },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    // Suggest similar matches in case of typo
    const all = await prisma.user.findMany({
      select: { email: true, role: true, status: true },
      take: 25,
    });
    return jsonResponse(
      {
        ok: false,
        stage: "user_lookup",
        reason: "User does not exist for that email.",
        normalisedEmailQueried: normalisedEmail,
        existingUsers: all,
      },
      404,
    );
  }

  if (!user.passwordHash) {
    return jsonResponse({
      ok: false,
      stage: "password_hash_missing",
      reason: "User exists but has no passwordHash. Re-run /api/setup?action=seed.",
      user: { id: user.id, email: user.email, role: user.role, status: user.status },
    });
  }

  // Compare with the bcryptjs version used at runtime
  let comparisonOk = false;
  let comparisonError: string | null = null;
  try {
    comparisonOk = await bcrypt.compare(passwordParam, user.passwordHash);
  } catch (err) {
    comparisonError = err instanceof Error ? err.message : String(err);
  }

  return jsonResponse({
    ok: comparisonOk,
    stage: comparisonOk ? "match" : "password_mismatch",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    diagnostics: {
      emailMatchedLowercased: true,
      passwordProvidedLength: passwordParam.length,
      passwordHashAlgoMarker: user.passwordHash.slice(0, 7), // e.g. "$2a$12$"
      passwordHashLength: user.passwordHash.length,
      comparisonError,
      hint: comparisonOk
        ? "Sign-in should succeed with these exact credentials."
        : "Either the password isn't what you think it is, or the stored hash was generated with a different secret. Re-running /api/setup?action=seed will overwrite it with bcrypt(ChangeMe!123).",
    },
    statusGateCheck:
      user.status === "ACTIVE" || user.status === "PENDING_VERIFICATION"
        ? "ok"
        : `Sign-in would be rejected because user.status is ${user.status}. Should be ACTIVE.`,
  });
}
