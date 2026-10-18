"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { decideApplication } from "@/app/actions/opportunities";

type Decision = "SHORTLISTED" | "REJECTED" | "AWARDED" | "UNDER_REVIEW";

const DECISION_LABELS: Record<Decision, string> = {
  UNDER_REVIEW: "review",
  SHORTLISTED: "shortlist",
  AWARDED: "award",
  REJECTED: "reject",
};

export function ApplicationActions({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirmDecision, setConfirmDecision] = useState<Decision | null>(null);

  if (currentStatus === "REJECTED" || currentStatus === "AWARDED") {
    return null;
  }

  function executeDecision() {
    if (!confirmDecision) return;
    start(async () => {
      const res = await decideApplication(applicationId, confirmDecision, note || undefined);
      setStatus(res);
      if (res.ok) {
        setNote("");
        setConfirmDecision(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Note (optional) — sent to the applicant"
        className="block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-xs focus:border-forest-700 focus:outline-none"
      />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setConfirmDecision("UNDER_REVIEW")} disabled={pending || currentStatus === "UNDER_REVIEW"} className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 disabled:opacity-60">
          Under review
        </button>
        <button onClick={() => setConfirmDecision("SHORTLISTED")} disabled={pending || currentStatus === "SHORTLISTED"} className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-forest-900 hover:bg-gold-300 disabled:opacity-60">
          Shortlist
        </button>
        <button onClick={() => setConfirmDecision("AWARDED")} disabled={pending} className="rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60">
          Award
        </button>
        <button onClick={() => setConfirmDecision("REJECTED")} disabled={pending} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-400 disabled:opacity-60">
          Reject
        </button>
      </div>

      {confirmDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="font-serif text-lg text-forest-900">Confirm decision</h3>
            <p className="mt-2 text-sm text-charcoal-500">
              Are you sure you want to {DECISION_LABELS[confirmDecision]} this participant?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDecision(null)}
                disabled={pending}
                className="rounded-md border border-cream-300 px-4 py-2 text-xs font-medium text-charcoal-600 hover:border-forest-700"
              >
                Cancel
              </button>
              <button
                onClick={executeDecision}
                disabled={pending}
                className="rounded-md bg-forest-800 px-4 py-2 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60"
              >
                {pending ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-1.5 text-[11px] text-forest-800" : "rounded-md bg-red-50 px-3 py-1.5 text-[11px] text-red-700"}>
          {status.message}
        </p>
      )}
    </div>
  );
}
