/**
 * Cloudflare Turnstile — bot protection for forms.
 *
 * Required env vars:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY  — rendered on the client widget
 *   TURNSTILE_SECRET_KEY            — used server-side to verify tokens
 *
 * When the secret isn't configured, verifyToken returns { ok: true }
 * so we don't lock anyone out by accident.
 */
export interface TurnstileResult {
  ok: boolean;
  reason?: string;
}

export async function verifyTurnstile(token: string | null | undefined, remoteIp?: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, reason: "turnstile_not_configured" };
  if (!token) return { ok: false, reason: "missing_token" };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (json.success) return { ok: true };
    return { ok: false, reason: json["error-codes"]?.join(",") ?? "verification_failed" };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "network_error" };
  }
}
