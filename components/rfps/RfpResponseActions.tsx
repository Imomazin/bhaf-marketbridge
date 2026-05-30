"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { decideRfpResponse } from "@/app/actions/rfps";

export function RfpResponseActions({ responseId, currentStatus }: { responseId: string; currentStatus: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function decide(decision: "SHORTLISTED" | "REJECTED" | "AWARDED") {
    start(async () => {
      await decideRfpResponse(responseId, decision);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => decide("SHORTLISTED")} disabled={pending} className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-forest-900 hover:bg-gold-300 disabled:opacity-60">
        Shortlist
      </button>
      <button onClick={() => decide("AWARDED")} disabled={pending} className="rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60">
        Award
      </button>
      <button onClick={() => decide("REJECTED")} disabled={pending || currentStatus === "REJECTED"} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-400 disabled:opacity-60">
        Reject
      </button>
    </div>
  );
}
