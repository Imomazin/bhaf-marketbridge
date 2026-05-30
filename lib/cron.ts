import crypto from "crypto";

/**
 * Vercel cron requests come from Vercel infrastructure with an
 * Authorization header containing CRON_SECRET. We also accept a
 * Bearer token in dev for manual triggering.
 *
 * Without CRON_SECRET set, cron endpoints refuse every request to
 * prevent open invocation.
 */
export function isAuthorizedCron(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : header;
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
