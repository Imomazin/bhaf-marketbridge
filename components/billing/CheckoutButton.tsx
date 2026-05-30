"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startCheckout } from "@/app/actions/billing";

export function CheckoutButton({ planId, planName, amountUsdCents }: { planId: string; planName: string; amountUsdCents: number }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setSubmitting(true);
    setError(null);
    const res = await startCheckout({ planId, planName, amountUsdCents });
    setSubmitting(false);
    if (res.ok && res.url) {
      if (res.url.startsWith("/")) router.push(res.url);
      else window.location.href = res.url;
    } else {
      setError(res.message);
    }
  }

  return (
    <>
      <button
        onClick={go}
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-60"
      >
        {submitting ? "Loading…" : `Subscribe to ${planName}`}
      </button>
      {error && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-[11px] text-red-700">{error}</p>
      )}
    </>
  );
}
