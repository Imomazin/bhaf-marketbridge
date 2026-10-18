"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveProfile, rejectProfile } from "@/app/actions/profileReview";
import type { ProfileRole } from "@/lib/queries/profileReview";

export function ProfileReviewActions({ role, profileId }: { role: ProfileRole; profileId: string }) {
  const router = useRouter();
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onApprove() {
    setSubmitting(true);
    const res = await approveProfile(role, profileId);
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      setApproveOpen(false);
      router.refresh();
    }
  }

  async function onReject(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) {
      setReasonError("A reason is required.");
      return;
    }
    setSubmitting(true);
    const res = await rejectProfile(role, profileId, reason);
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      setRejectOpen(false);
      setReason("");
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setStatus(null);
            setRejectOpen(true);
          }}
          disabled={submitting}
          className="rounded-md border border-red-200 px-4 py-2 text-xs font-medium text-red-700 hover:border-red-400 disabled:opacity-60"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => {
            setStatus(null);
            setApproveOpen(true);
          }}
          disabled={submitting}
          className="rounded-md bg-forest-800 px-4 py-2 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60"
        >
          Approve
        </button>
      </div>

      {status && !status.ok && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{status.message}</p>
      )}

      {approveOpen && (
        <div role="dialog" aria-modal="true" aria-label="Approve profile confirmation" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close approve confirmation"
            onClick={() => !submitting && setApproveOpen(false)}
            className="absolute inset-0 bg-charcoal-900/45"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-cream-200 bg-white p-6 shadow-soft">
            <h3 className="font-serif text-xl text-forest-900">Approve this profile?</h3>
            <p className="mt-2 text-sm text-charcoal-600">
              This publishes the profile and notifies the user it's been approved.
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setApproveOpen(false)}
                disabled={submitting}
                className="rounded-md border border-cream-300 px-3 py-2 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900 disabled:opacity-60"
              >
                No
              </button>
              <button
                type="button"
                onClick={onApprove}
                disabled={submitting}
                className="rounded-md bg-forest-800 px-3 py-2 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60"
              >
                {submitting ? "Approving…" : "Yes, approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectOpen && (
        <div role="dialog" aria-modal="true" aria-label="Reject profile" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close reject dialog"
            onClick={() => !submitting && setRejectOpen(false)}
            className="absolute inset-0 bg-charcoal-900/45"
          />
          <form onSubmit={onReject} className="relative z-10 w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-soft">
            <h3 className="font-serif text-xl text-forest-900">Reject this profile</h3>
            <p className="mt-2 text-sm text-charcoal-600">
              Give a reason — it's shown to the user so they can fix and resubmit.
            </p>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setReasonError(null);
              }}
              rows={4}
              placeholder="e.g. Business registration document is missing / description is too short…"
              className="mt-4 block w-full rounded-md border border-red-200 bg-red-50/30 px-3 py-2 text-sm text-charcoal-900 focus:border-red-500 focus:outline-none"
            />
            {reasonError && <p className="mt-1 text-xs text-red-700">{reasonError}</p>}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectOpen(false)}
                disabled={submitting}
                className="rounded-md border border-cream-300 px-3 py-2 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-md border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {submitting ? "Rejecting…" : "Confirm reject"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
