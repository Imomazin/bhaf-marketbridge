"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { respondToRfp } from "@/app/actions/rfps";

export function RfpResponseForm({ rfpId }: { rfpId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pricingNote, setPricingNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await respondToRfp({ rfpId, body, pricingNote: pricingNote || undefined });
    setSubmitting(false);
    setStatus(res);
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-5">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Your response</span>
        <textarea required value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Pricing note (optional)</span>
        <input value={pricingNote} onChange={(e) => setPricingNote(e.target.value)} placeholder="$X per unit at MOQ Y, lead time Z" className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800" : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"}>{status.message}</p>
      )}
      <button type="submit" disabled={submitting} className="btn-primary !py-2 !px-3 text-xs disabled:opacity-60">
        {submitting ? "Sending…" : "Submit response"}
      </button>
    </form>
  );
}
