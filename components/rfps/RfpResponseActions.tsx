"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { decideRfpResponse } from "@/app/actions/rfps";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useState } from "react";

export function RfpResponseActions({ responseId, currentStatus }: { responseId: string; currentStatus: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // modal state
  const [action, setAction] = useState<"SHORTLISTED" | "AWARDED" | "REJECTED" | null>(null);
  const isOpen = Boolean(action);

  function openModal(decision: typeof action) {
    setAction(decision);
  }

  async function confirmDecision() {
    if (!action) return;
    startTransition(async () => {
      await decideRfpResponse(responseId, action);
      router.refresh();
    });
    setAction(null);
  }

  return (
    <>
      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => openModal("SHORTLISTED")}
          disabled={pending}
          className="rounded-md bg-gold-400 px-3 py-1.5 text-xs font-medium text-forest-900 hover:bg-gold-300 disabled:opacity-60"
        >
          Shortlist
        </button>

        <button
          onClick={() => openModal("AWARDED")}
          disabled={pending}
          className="rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60"
        >
          Award
        </button>

        <button
          onClick={() => openModal("REJECTED")}
          disabled={pending || currentStatus === "REJECTED"}
          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-400 disabled:opacity-60"
        >
          Reject
        </button>
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmDialog
        open={isOpen}
        onClose={() => setAction(null)}
        onConfirm={confirmDecision}
        title={action ? `Confirm ${action.toLowerCase()}` : "Confirm action"}
        description={action ? `Are you sure you want to ${action.toLowerCase()} this response?` : undefined}
        confirmLabel={action ?? "Confirm"}
        variant={action === "REJECTED" ? "gold" : "forest"}
      />
    </>
  );
}
