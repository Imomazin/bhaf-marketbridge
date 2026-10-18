"use client";

import { useState } from "react";
import { addEntrepreneurToShortlist } from "@/app/actions/funder";

export function ShortlistButton({
  entrepreneurId,
  returnTo,
}: {
  entrepreneurId: string;
  returnTo: string;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-primary !px-4 !py-2 text-xs"
      >
        Add to shortlist
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-serif text-forest-900">
              Shortlist this entrepreneur?
            </h3>
            <p className="mt-2 text-sm text-charcoal-600">
              Shortlisting saves this entrepreneur to your private vault. This allows you to easily find their profile later for diligence, review, or potential funding.
            </p>
            <form action={addEntrepreneurToShortlist} className="mt-6 flex justify-end gap-3">
              <input type="hidden" name="entrepreneurId" value={entrepreneurId} />
              <input type="hidden" name="shortlistName" value="My shortlist" />
              <input type="hidden" name="returnTo" value={returnTo} />
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-charcoal-600 hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary !px-4 !py-2 text-sm"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
