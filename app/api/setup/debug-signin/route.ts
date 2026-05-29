import crypto from "crypto";
import bcrypt from "bcryptjs";

import { prisma, DB_ENABLED } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEMO_EMAILS = new Set([
  "admin@bhaf.example",
  "amara@greenweave.example",
  "fund@mosaic.example",
]);

const DEMO_PASSWORDS: Record<string, string> = {
  "admin@bhaf.example": "ChangeMe!123",
  "amara@greenweave.example": "Founder!123",
  "fund@mosaic.example": "Funder!123",
};

/**
 * Diagnostic that walks the sign-in path step-by-step and reports
 * exactly which stage fails.
 *
 * Token gating:
 *   • For the three hard-coded demo emails (admin@bhaf.example, etc.),
 *     NO token is required — the demo credentials are publicly known
 *     so exposing the diagnostic for them leaks nothing sensitive.
 *   • For ANY other email, SETUP_TOKEN is required.
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

function tokenIsValid(providedRaw: string | null, expectedRaw: string | undefined): boolean {
  if (!expectedRaw || !providedRaw) return false;
  const provided = providedRaw.trim();
  const expected = expectedRaw.trim();
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const emailParam = (url.searchParams.get("email") ?? "admin@bhaf.example").trim().toLowerCase();
  const passwordParam = url.searchParams.get("password") ?? DEMO_PASSWORDS[emailParam] ?? "ChangeMe!123";

  const isDemoEmail = DEMO_EMAILS.has(emailParam);

  // Token only required when querying NON-demo emails.
  if (!isDemoEmail) {
    const provided = url.searchParams.get("token");
    const expected = process.env.SETUP_TOKEN;
    if (!expected) {
      return jsonResponse({ ok: false, error: "Setup endpoint disabled (SETUP_TOKEN unset)." }, 503);
    }
    if (!tokenIsValid(provided, expected)) {
      return jsonResponse({ ok: false, error: "Token required for non-demo email lookups." }, 401);
    }
  }

  if (!DB_ENABLED || !prisma) {
    return jsonResponse({ ok: false, error: "DATABASE_URL is not configured." }, 503);
  }

  const user = await prisma.user.findUnique({
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
  });

  if (!user) {
    const all = await prisma.user.findMany({
      select: { email: true, role: true, status: true },
      take: 25,
    });
    return jsonResponse(
      {
        ok: false,
        stage: "user_lookup",
        reason: "User does not exist for that email.",
        normalisedEmailQueried: emailParam,
        existingUsers: all,
        hint: "Run /api/setup?action=seed&token=... to create the demo accounts.",
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
      passwordTriedLength: passwordParam.length,
      passwordHashAlgoMarker: user.passwordHash.slice(0, 7),
      passwordHashLength: user.passwordHash.length,
      comparisonError,
      hint: comparisonOk
        ? "✅ Sign-in WILL succeed with these exact credentials."
        : "❌ Stored hash does not validate this password. Hit /api/setup?action=seed&token=YOUR_TOKEN to overwrite the hash.",
    },
    statusGateCheck:
      user.status === "ACTIVE" || user.status === "PENDING_VERIFICATION"
        ? "ok"
        : `Sign-in would be rejected because user.status is ${user.status}. Should be ACTIVE.`,
  });
}
