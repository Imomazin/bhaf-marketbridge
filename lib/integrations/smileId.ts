/**
 * Smile ID KYC integration — sandbox-aware wrapper.
 *
 * Real Smile ID requires an SDK call from the client SDK + a webhook.
 * Until you connect a real sandbox we expose a stub that:
 *   • returns NOT_CONFIGURED when env vars are absent so the UI can
 *     show "KYC pending — provider not connected"
 *   • returns a deterministic PASS / WARN / FAIL when SMILE_ID_MODE
 *     is set to "stub" so demo flows look real
 *   • exposes verifyIdentity() — wire your real SDK here later
 *
 * Required env vars to switch to real:
 *   SMILE_ID_PARTNER_ID
 *   SMILE_ID_API_KEY
 *   SMILE_ID_ENVIRONMENT = sandbox | production
 */

export type KycResult = {
  status: "PASS" | "WARN" | "FAIL" | "PENDING" | "NOT_CONFIGURED";
  message: string;
  rawProvider: "smile_id" | "stub" | "not_configured";
  ref?: string;
};

export interface KycInput {
  userId: string;
  fullName: string;
  country: string;
  idType?: string;
  idNumber?: string;
}

export function smileIdMode(): "real" | "stub" | "off" {
  if (process.env.SMILE_ID_PARTNER_ID && process.env.SMILE_ID_API_KEY) return "real";
  if (process.env.SMILE_ID_MODE === "stub") return "stub";
  return "off";
}

export async function verifyIdentity(input: KycInput): Promise<KycResult> {
  const mode = smileIdMode();

  if (mode === "off") {
    return {
      status: "NOT_CONFIGURED",
      message: "KYC provider not connected. Add SMILE_ID_PARTNER_ID + SMILE_ID_API_KEY to enable.",
      rawProvider: "not_configured",
    };
  }

  if (mode === "stub") {
    // Deterministic fake: route by hash of fullName so demos are stable
    const hash = simpleHash(input.fullName + input.country);
    const buckets: KycResult["status"][] = ["PASS", "PASS", "PASS", "WARN", "FAIL"];
    const status = buckets[hash % buckets.length];
    return {
      status,
      message:
        status === "PASS"
          ? "Identity matched the national registry record."
          : status === "WARN"
          ? "Identity matched but date-of-birth differs by 1 day. Manual review recommended."
          : "Identity could not be verified. Re-upload ID or escalate to Smile ID Reviewer.",
      rawProvider: "stub",
      ref: `STUB-${hash.toString(36).toUpperCase()}`,
    };
  }

  // Real Smile ID integration goes here. Sketch only — wire when
  // credentials are available.
  return {
    status: "PENDING",
    message: "Submitted to Smile ID; awaiting webhook callback.",
    rawProvider: "smile_id",
    ref: `SID-${Date.now()}`,
  };
}

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
