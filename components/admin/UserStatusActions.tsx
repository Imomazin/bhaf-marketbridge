"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deactivateUser, reactivateUser } from "@/app/actions/userManagement";

export function UserStatusActions({ userId, status }: { userId: string; status: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  async function onToggle() {
    if (status !== "SUSPENDED" && status !== "DELETED") {
      setShowModal(true);
      return;
    }
    // For reactivation
    setSubmitting(true);
    setError(null);
    const res = await reactivateUser(userId);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.refresh();
  }

  async function handleConfirmDeactivate() {
    if (!reason.trim()) {
      setError("Please provide a reason.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await deactivateUser(userId, reason.trim());
    setSubmitting(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setShowModal(false);
    router.refresh();
  }

  if (status === "DELETED") {
    return <span className="text-[11px] text-charcoal-400">—</span>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        disabled={submitting}
        className={
          status === "SUSPENDED"
            ? "rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60"
            : "rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-400 disabled:opacity-60"
        }
      >
        {submitting && status === "SUSPENDED" ? "Working…" : status === "SUSPENDED" ? "Reactivate" : "Deactivate"}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="font-serif text-xl text-forest-900">Deactivate User</h3>
            <p className="mt-2 text-sm text-charcoal-500">
              Please provide a reason for deactivating this account. The user will receive an email with this reason.
            </p>
            <div className="mt-4">
              <label htmlFor="reason" className="sr-only">Reason</label>
              <textarea
                id="reason"
                className="w-full rounded-md border border-cream-300 p-2 text-sm focus:border-forest-700 focus:outline-none"
                rows={3}
                placeholder="Violation of terms..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-cream-300 px-4 py-2 text-sm font-medium text-charcoal-600 hover:bg-cream-50"
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                  setReason("");
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                onClick={handleConfirmDeactivate}
                disabled={submitting}
              >
                {submitting ? "Deactivating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {error && !showModal && <p className="mt-1 text-[11px] text-red-700">{error}</p>}
    </div>
  );
}
