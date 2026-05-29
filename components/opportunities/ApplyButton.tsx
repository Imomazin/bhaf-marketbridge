"use client";

import { useState } from "react";
import { applyToOpportunity } from "@/app/actions/opportunities";

export function ApplyButton({ opportunityId, title }: { opportunityId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit() {
    setSubmitting(true);
    const res = await applyToOpportunity(opportunityId, note || undefined);
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      setNote("");
      setOpen(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-6 w-full rounded-md bg-forest-800 px-4 py-2.5 text-xs font-medium text-cream-50 transition hover:bg-forest-700"
      >
        Apply through MarketBridge
      </button>

      {open && (
        <div className="mt-3 rounded-lg border border-cream-200 bg-cream-50 p-3">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
              Cover note (optional)
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={`Why "${title}" fits your business…`}
              className="mt-1 block w-full rounded-md border border-cream-300 bg-white px-2 py-1.5 text-xs text-forest-900 focus:border-forest-700 focus:outline-none"
            />
          </label>
          <div className="mt-2 flex gap-2">
            <button
              onClick={submit}
              disabled={submitting}
              className="flex-1 rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
            <button
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
