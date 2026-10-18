"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteOpportunity } from "@/app/actions/opportunities";

export function OpportunityDeleteButton({ id, title, applicantCount }: { id: string; title: string; applicantCount: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    setSubmitting(true);
    setError(null);
    const res = await deleteOpportunity(id);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.push("/admin/opportunities");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-red-200 px-4 py-2 text-xs font-medium text-red-700 hover:border-red-400"
      >
        Delete
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Delete opportunity confirmation" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={() => !submitting && setOpen(false)}
            className="absolute inset-0 bg-charcoal-900/45"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-soft">
            <h3 className="font-serif text-xl text-forest-900">Delete "{title}"?</h3>
            <p className="mt-2 text-sm text-charcoal-600">
              This permanently removes the opportunity{" "}
              {applicantCount > 0 ? (
                <>
                  and its <strong>{applicantCount}</strong> application{applicantCount === 1 ? "" : "s"}
                </>
              ) : (
                "from the board"
              )}
              . This can't be undone.
            </p>
            {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="rounded-md border border-cream-300 px-3 py-2 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-md border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {submitting ? "Deleting…" : "Confirm delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
