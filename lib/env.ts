import { z } from "zod";

/**
 * Centralised environment-variable contract. Keeps server-side env access
 * type-safe and fails fast on misconfiguration in production. In dev we log
 * but allow missing keys so contributors can boot without every integration.
 */
const ServerEnv = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  MAILTRAP_API_TOKEN: z.string().optional(),
  MAILTRAP_FROM_EMAIL: z.string().email().optional(),
  MAILTRAP_FROM_NAME: z.string().optional(),
  EMAIL_PROVIDER: z.enum(["auto", "resend", "mailtrap"]).optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  VIRUSTOTAL_API_KEY: z.string().optional(),
  SMILEID_API_KEY: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  SETUP_TOKEN: z.string().optional(),
});

const PublicEnv = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof ServerEnv>;
export type PublicEnv = z.infer<typeof PublicEnv>;

function parseOrWarn<T extends z.ZodTypeAny>(schema: T, raw: unknown, label: string): z.infer<T> {
  const result = schema.safeParse(raw);
  if (result.success) return result.data;
  const issues = result.error.issues.map((i) => `${i.path.join(".") || "?"}: ${i.message}`).join("; ");
  if (process.env.NODE_ENV === "production") {
    throw new Error(`[env] Invalid ${label} environment: ${issues}`);
  }
  console.warn(`[env] ${label} validation issues (dev): ${issues}`);
  // Strip the invalid keys and re-parse with defaults.
  const cleaned: Record<string, unknown> = { ...(raw as Record<string, unknown>) };
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string") delete cleaned[key];
  }
  return schema.parse(cleaned);
}

export const env: ServerEnv =
  typeof process !== "undefined"
    ? parseOrWarn(ServerEnv, process.env, "server")
    : ({} as ServerEnv);

export const publicEnv: PublicEnv = parseOrWarn(
  PublicEnv,
  {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
  "public",
);

/** Truthy if all required integration keys for `feature` are present. */
export function hasIntegration(feature: "ai" | "email" | "payments" | "kyc" | "av" | "storage" | "captcha"): boolean {
  switch (feature) {
    case "ai":
      return !!env.ANTHROPIC_API_KEY;
    case "email":
      return !!env.RESEND_API_KEY || !!env.MAILTRAP_API_TOKEN;
    case "payments":
      return !!env.PAYSTACK_SECRET_KEY;
    case "kyc":
      return !!env.SMILEID_API_KEY;
    case "av":
      return !!env.VIRUSTOTAL_API_KEY;
    case "storage":
      return !!env.BLOB_READ_WRITE_TOKEN;
    case "captcha":
      return !!env.TURNSTILE_SECRET_KEY;
  }
}
