import crypto from "crypto";

/**
 * Paystack — real API integration.
 *
 * Reference: https://paystack.com/docs/api/
 *
 * USD prices in our pricing matrix are converted to the merchant's
 * settlement currency (defaulting to NGN). For other African currencies
 * the merchant configures the right currency on their Paystack account.
 *
 * Required env vars:
 *   PAYSTACK_SECRET_KEY   sk_test_… or sk_live_…
 *   PAYSTACK_WEBHOOK_SECRET  same as PAYSTACK_SECRET_KEY by default
 *   PAYSTACK_DEFAULT_CURRENCY  defaults to NGN
 *
 * For USD→NGN conversion at checkout time we use a STATIC fallback rate
 * unless OPENEXCHANGERATES_KEY is set later. In production you'd want a
 * live FX feed (this is a deliberate seam to swap in later).
 */

const API_BASE = "https://api.paystack.co";

export interface PaystackInitInput {
  email: string;
  amountUsdCents: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  currency?: string;
}

export interface PaystackInitResult {
  ok: boolean;
  authorizationUrl?: string;
  reference?: string;
  accessCode?: string;
  message: string;
  rawStatus?: number;
}

const STATIC_USD_TO = {
  NGN: 1600,
  GHS: 14,
  KES: 130,
  ZAR: 18,
  USD: 1,
} as const;
type SupportedCurrency = keyof typeof STATIC_USD_TO;

function convert(amountUsdCents: number, currency: SupportedCurrency): number {
  const rate = STATIC_USD_TO[currency] ?? 1;
  // Paystack expects amounts in the smallest unit (kobo / pesewa / cents)
  return Math.round((amountUsdCents / 100) * rate * 100);
}

export async function initializeTransaction(input: PaystackInitInput): Promise<PaystackInitResult> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return { ok: false, message: "Paystack not configured." };

  const currency = (input.currency ?? process.env.PAYSTACK_DEFAULT_CURRENCY ?? "NGN").toUpperCase() as SupportedCurrency;
  const amountSmallest = convert(input.amountUsdCents, currency);

  try {
    const res = await fetch(`${API_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: amountSmallest,
        currency,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
    });
    const data = (await res.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; access_code?: string; reference?: string };
    };
    if (!res.ok || !data.status || !data.data?.authorization_url) {
      return { ok: false, message: data.message ?? `Paystack returned ${res.status}`, rawStatus: res.status };
    }
    return {
      ok: true,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
      message: "OK",
    };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Network error" };
  }
}

export interface VerifyResult {
  ok: boolean;
  status?: "success" | "failed" | "abandoned" | "pending";
  amountSmallest?: number;
  currency?: string;
  reference?: string;
  customerEmail?: string;
  paidAt?: Date;
  raw?: unknown;
  message: string;
}

export async function verifyTransaction(reference: string): Promise<VerifyResult> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return { ok: false, message: "Paystack not configured." };

  try {
    const res = await fetch(`${API_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    const data = (await res.json()) as {
      status?: boolean;
      message?: string;
      data?: {
        status?: VerifyResult["status"];
        amount?: number;
        currency?: string;
        reference?: string;
        paid_at?: string;
        customer?: { email?: string };
      };
    };
    if (!res.ok || !data.status || !data.data) {
      return { ok: false, message: data.message ?? `Paystack returned ${res.status}` };
    }
    return {
      ok: true,
      status: data.data.status,
      amountSmallest: data.data.amount,
      currency: data.data.currency,
      reference: data.data.reference,
      customerEmail: data.data.customer?.email,
      paidAt: data.data.paid_at ? new Date(data.data.paid_at) : undefined,
      raw: data,
      message: "OK",
    };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Network error" };
  }
}

/**
 * Verify a Paystack webhook delivery using HMAC SHA-512 against your
 * secret key. Paystack signs the raw request body and puts the signature
 * in the x-paystack-signature header.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const key = process.env.PAYSTACK_WEBHOOK_SECRET ?? process.env.PAYSTACK_SECRET_KEY;
  if (!key || !signature) return false;
  const expected = crypto.createHmac("sha512", key).update(rawBody).digest("hex");
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
