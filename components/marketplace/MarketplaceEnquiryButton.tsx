"use client";

import { useState } from "react";
import { requestMarketplaceEnquiry } from "@/app/actions/marketplace";

export function MarketplaceEnquiryButton({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [sent, setSent] = useState(false);

  async function submit() {
    setSubmitting(true);
    const result = await requestMarketplaceEnquiry(listingId, note || undefined);
    setSubmitting(false);
    setStatus(result);
    if (result.ok || result.message.toLowerCase().includes("already")) {
      setSent(true);
      setNote("");
      setOpen(false);
    }
  }

  return (
    <div className="flex-1">
      <button
        type="button"
        onClick={() => {
          if (!sent) setOpen((value) => !value);
        }}
        disabled={sent}
        className="btn-primary w-full !px-4 !py-2 text-xs disabled:bg-forest-600"
      >
        {sent ? "Sent" : "Request enquiry"}
      </button>

      {open && (
        <div className="mt-3 rounded-lg border border-cream-200 bg-cream-50 p-3">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
              Enquiry note (optional)
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder={`What would you like to ask about "${listingTitle}"?`}
              className="mt-1 block w-full rounded-md border border-cream-300 bg-white px-2 py-1.5 text-xs text-forest-900 focus:border-forest-700 focus:outline-none"
            />
          </label>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="flex-1 rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send enquiry"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status && (
        <p
          className={
            status.ok
              ? "mt-2 rounded-md bg-forest-50 px-2 py-1.5 text-[11px] text-forest-800"
              : "mt-2 rounded-md bg-red-50 px-2 py-1.5 text-[11px] text-red-700"
          }
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
