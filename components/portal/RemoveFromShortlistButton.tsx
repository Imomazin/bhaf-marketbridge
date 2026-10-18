"use client";

import { useState } from "react";
import { removeEntrepreneurFromShortlist } from "@/app/actions/funder";

export function RemoveFromShortlistButton({
  entrepreneurId,
  entrepreneurName,
  shortlistName,
}: {
  entrepreneurId: string;
  entrepreneurName: string;
  shortlistName: string;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="ml-auto rounded p-1 text-charcoal-400 hover:bg-cream-100 hover:text-red-600"
        title="Remove from shortlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-serif text-forest-900">
              Remove from shortlist?
            </h3>
            <p className="mt-2 text-sm text-charcoal-600">
              Are you sure you want to remove <strong>{entrepreneurName}</strong> from your <strong>{shortlistName}</strong>?
            </p>
            <form action={removeEntrepreneurFromShortlist} className="mt-6 flex justify-end gap-3">
              <input type="hidden" name="entrepreneurId" value={entrepreneurId} />
              <input type="hidden" name="shortlistName" value={shortlistName} />
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-charcoal-600 hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Remove
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
