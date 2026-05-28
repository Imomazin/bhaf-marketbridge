import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

const redis = hasUpstash ? Redis.fromEnv() : null;

function build(rate: number, window: `${number} s` | `${number} m` | `${number} h`) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(rate, window),
    analytics: true,
  });
}

const limiters = {
  api: build(60, "1 m"),
  auth: build(10, "1 m"),
  chat: build(30, "1 m"),
  upload: build(20, "1 m"),
};

// In-memory fallback for environments without Upstash. Not suitable for
// production at scale but prevents accidental run-away calls locally.
const memCounts = new Map<string, { count: number; resetAt: number }>();
function memCheck(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = memCounts.get(key);
  if (!entry || entry.resetAt < now) {
    memCounts.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { success: false, remaining: 0, reset: entry.resetAt };
  }
  return { success: true, remaining: limit - entry.count, reset: entry.resetAt };
}

const memWindows: Record<keyof typeof limiters, { limit: number; ms: number }> = {
  api: { limit: 60, ms: 60_000 },
  auth: { limit: 10, ms: 60_000 },
  chat: { limit: 30, ms: 60_000 },
  upload: { limit: 20, ms: 60_000 },
};

export async function rateLimit(bucket: keyof typeof limiters, key: string) {
  const limiter = limiters[bucket];
  if (limiter) {
    const res = await limiter.limit(key);
    return { success: res.success, remaining: res.remaining, reset: res.reset };
  }
  const cfg = memWindows[bucket];
  return memCheck(`${bucket}:${key}`, cfg.limit, cfg.ms);
}

export function rateLimitKeyFrom(req: Request, suffix?: string) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  return suffix ? `${ip}:${suffix}` : ip;
}
