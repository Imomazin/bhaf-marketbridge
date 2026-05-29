import crypto from "crypto";
import bcrypt from "bcryptjs";

import { prisma, DB_ENABLED } from "@/lib/db";
import { seedDemoAccounts } from "@/lib/seed";
import { INIT_SQL } from "@/lib/initSql";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-shot, token-protected setup endpoint.
 *
 * Use it to push the Prisma schema to your production database and seed
 * the demo accounts without ever leaving the browser. After verifying
 * the accounts work, REMOVE the SETUP_TOKEN env var on Vercel and
 * redeploy — that disables this endpoint permanently.
 *
 * Actions (via ?action=):
 *   status  — public; reports whether SETUP_TOKEN is configured.
 *   push    — token-gated; runs the initial schema migration.
 *   seed    — token-gated; idempotently creates demo accounts.
 *   verify  — token-gated; reports user counts by role.
 *
 * The token MUST be provided via ?token= AND match SETUP_TOKEN exactly.
 * Comparisons use timing-safe equality.
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
  const action = (url.searchParams.get("action") ?? "status").toLowerCase();
  const provided = url.searchParams.get("token");
  const expected = process.env.SETUP_TOKEN;

  if (action === "status") {
    return jsonResponse({
      ok: true,
      setup_token_configured: Boolean(expected),
      database_url_configured: DB_ENABLED,
      hint: expected
        ? "Setup endpoint armed. Use ?action=push, ?action=seed, or ?action=verify with your token."
        : "SETUP_TOKEN is not set. Add it on Vercel and redeploy to arm this endpoint.",
    });
  }

  if (!expected) {
    return jsonResponse({ ok: false, error: "Setup endpoint is disabled (SETUP_TOKEN unset)." }, 503);
  }

  if (!tokenIsValid(provided, expected)) {
    return jsonResponse({ ok: false, error: "Invalid or missing token." }, 401);
  }

  if (!DB_ENABLED || !prisma) {
    return jsonResponse({ ok: false, error: "DATABASE_URL is not configured on this deployment." }, 503);
  }

  try {
    if (action === "push") {
      const statements = splitSqlStatements(INIT_SQL);

      const applied: string[] = [];
      const skipped: { stmt: string; reason: string }[] = [];

      for (const stmt of statements) {
        try {
          await prisma.$executeRawUnsafe(stmt);
          applied.push(firstLine(stmt));
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          // Postgres "already exists" errors are expected on re-run — treat as idempotent.
          if (msg.includes("already exists") || msg.includes("duplicate") || msg.includes("42P07") || msg.includes("42710")) {
            skipped.push({ stmt: firstLine(stmt), reason: "already exists" });
          } else {
            return jsonResponse(
              {
                ok: false,
                error: "Schema push failed.",
                failedStatement: firstLine(stmt),
                detail: msg,
                applied,
                skipped,
              },
              500,
            );
          }
        }
      }

      return jsonResponse({
        ok: true,
        action: "push",
        message: `Schema applied. ${applied.length} statements run, ${skipped.length} skipped (already existed).`,
        applied: applied.length,
        skipped: skipped.length,
      });
    }

    if (action === "seed") {
      const result = await seedDemoAccounts(prisma);
      return jsonResponse({
        ok: true,
        action: "seed",
        message: "Demo accounts seeded (idempotently).",
        accounts: [
          { email: "admin@bhaf.example", password: result.passwords.admin, role: "ADMIN" },
          { email: "amara@greenweave.example", password: result.passwords.entrepreneur, role: "ENTREPRENEUR" },
          { email: "fund@mosaic.example", password: result.passwords.funder, role: "FUNDER" },
        ],
        next: "Sign in with any of these accounts at /auth/sign-in, then rotate the passwords immediately.",
      });
    }

    if (action === "rotate") {
      // Rotate demo passwords to operator-supplied values.
      // Usage: ?action=rotate&token=...&admin=NEWPWD&entrepreneur=NEWPWD&funder=NEWPWD
      // Any of admin/entrepreneur/funder may be omitted to skip that role.
      const targets: Array<{ key: string; email: string; newPwd: string | null }> = [
        { key: "admin", email: "admin@bhaf.example", newPwd: url.searchParams.get("admin") },
        { key: "entrepreneur", email: "amara@greenweave.example", newPwd: url.searchParams.get("entrepreneur") },
        { key: "funder", email: "fund@mosaic.example", newPwd: url.searchParams.get("funder") },
      ];
      const requested = targets.filter((t) => t.newPwd !== null);
      if (requested.length === 0) {
        return jsonResponse(
          {
            ok: false,
            error:
              "No passwords supplied. Pass at least one of: admin, entrepreneur, funder. Example: ?action=rotate&token=...&admin=MyNewPwd123!",
          },
          400,
        );
      }
      // Light validation: 10 chars minimum, contains a digit
      for (const t of requested) {
        if (!t.newPwd || t.newPwd.length < 10 || !/[0-9]/.test(t.newPwd)) {
          return jsonResponse(
            {
              ok: false,
              error: `Password for "${t.key}" must be at least 10 characters and contain a digit.`,
            },
            400,
          );
        }
      }
      const results: Array<{ email: string; rotated: boolean; reason?: string }> = [];
      for (const t of requested) {
        const existing = await prisma.user.findUnique({ where: { email: t.email } });
        if (!existing) {
          results.push({ email: t.email, rotated: false, reason: "user not found — run seed first" });
          continue;
        }
        const hash = await bcrypt.hash(t.newPwd!, 12);
        await prisma.user.update({
          where: { email: t.email },
          data: { passwordHash: hash, status: "ACTIVE" },
        });
        results.push({ email: t.email, rotated: true });
      }
      return jsonResponse({
        ok: true,
        action: "rotate",
        message:
          "Passwords rotated. You can now sign in with the new values. Delete SETUP_TOKEN on Vercel and redeploy to disarm this endpoint.",
        results,
      });
    }

    if (action === "verify") {
      const [admins, entrepreneurs, funders, corporates, auditors, total] = await Promise.all([
        prisma.user.count({ where: { role: "ADMIN" } }),
        prisma.user.count({ where: { role: "ENTREPRENEUR" } }),
        prisma.user.count({ where: { role: "FUNDER" } }),
        prisma.user.count({ where: { role: "CORPORATE" } }),
        prisma.user.count({ where: { role: "AUDITOR" } }),
        prisma.user.count(),
      ]);
      const seededAccounts = await prisma.user.findMany({
        where: {
          email: {
            in: [
              "admin@bhaf.example",
              "amara@greenweave.example",
              "fund@mosaic.example",
            ],
          },
        },
        select: { email: true, role: true, status: true, createdAt: true },
      });
      return jsonResponse({
        ok: true,
        action: "verify",
        totals: { total, admins, entrepreneurs, funders, corporates, auditors },
        seeded: seededAccounts,
        hint:
          seededAccounts.length === 3
            ? "All three demo accounts exist. Sign in at /auth/sign-in. After confirming, remove SETUP_TOKEN on Vercel and redeploy."
            : "Some demo accounts are missing — run ?action=seed.",
      });
    }

    return jsonResponse(
      { ok: false, error: `Unknown action: ${action}. Use status | push | seed | rotate | verify.` },
      400,
    );
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return jsonResponse({ ok: false, error: "Setup failed.", detail }, 500);
  }
}

function splitSqlStatements(sql: string): string[] {
  // Strip line comments and empty lines, then split on semicolon at the end
  // of a line. This is intentionally simple — the Prisma-generated SQL is
  // straightforward DDL with no procedural blocks.
  const stripped = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  return stripped
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => (s.endsWith(";") ? s : s + ";"));
}

function firstLine(stmt: string): string {
  return stmt.split("\n")[0].slice(0, 120);
}
