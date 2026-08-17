"use client";

import { useState } from "react";
import { respondToRfp } from "@/app/actions/rfps";

export function RfpApplyButton({ rfpId, title, hasApplied }: { rfpId: string; title: string; hasApplied?: boolean }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [sent, setSent] = useState(hasApplied || false);

  async function submit() {
    setSubmitting(true);
    const res = await respondToRfp({
      rfpId,
      body: note,
    });
    setSubmitting(false);
    setStatus(res);
    if (res.ok || res.message.toLowerCase().includes("already responded")) {
      setSent(true);
      setNote("");
      setOpen(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => {
          if (!sent) setOpen((o) => !o);
        }}
        disabled={sent}
        className="mt-6 w-full rounded-md bg-[#0d2840] px-4 py-2.5 text-xs font-medium text-cream-50 transition hover:bg-[#1a3a5a] disabled:cursor-default disabled:opacity-60"
      >
        {sent ? "Response Submitted" : "Submit Response"}
      </button>

      {open && (
        <div className="mt-3 rounded-lg border border-cream-200 bg-cream-50 p-3">
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-500">
              Response Note (Required)
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={`How you can fulfill "${title}"…`}
              className="mt-1 block w-full rounded-md border border-cream-300 bg-white px-2 py-1.5 text-xs text-forest-900 focus:border-[#0d2840] focus:outline-none"
            />
          </label>
          <div className="mt-3 flex gap-2">
            <button
              onClick={submit}
              disabled={submitting || !note.trim()}
              className="flex-1 rounded-md bg-[#0d2840] px-3 py-1.5 text-xs font-medium text-cream-50 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
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
              ? "mt-2 rounded-md bg-green-50 px-2 py-1.5 text-[11px] text-green-800"
              : "mt-2 rounded-md bg-red-50 px-2 py-1.5 text-[11px] text-red-700"
          }
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
