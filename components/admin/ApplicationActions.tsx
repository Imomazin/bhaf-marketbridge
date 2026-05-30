"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { decideApplication } from "@/app/actions/opportunities";

export function ApplicationActions({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  function decide(decision: "SHORTLISTED" | "REJECTED" | "AWARDED" | "UNDER_REVIEW") {
    start(async () => {
      const res = await decideApplication(applicationId, decision, note || undefined);
      setStatus(res);
      if (res.ok) {
        setNote("");
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
        <button onClick={() => decide("UNDER_REVIEW")} disabled={pending || currentStatus === "UNDER_REVIEW"} className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 disabled:opacity-60">
          Under review
        </button>
        <button onClick={() => decide("SHORTLISTED")} disabled={pending} className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-forest-900 hover:bg-gold-300 disabled:opacity-60">
          Shortlist
        </button>
        <button onClick={() => decide("AWARDED")} disabled={pending} className="rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60">
          Award
        </button>
        <button onClick={() => decide("REJECTED")} disabled={pending} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-400 disabled:opacity-60">
          Reject
        </button>
      </div>
      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-1.5 text-[11px] text-forest-800" : "rounded-md bg-red-50 px-3 py-1.5 text-[11px] text-red-700"}>
          {status.message}
        </p>
      )}
    </div>
  );
}
