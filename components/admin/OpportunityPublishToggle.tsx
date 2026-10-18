"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { publishOpportunity, unpublishOpportunity } from "@/app/actions/opportunities";

export function OpportunityPublishToggle({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onToggle() {
    setSubmitting(true);
    setError(null);
    const res = published ? await unpublishOpportunity(id) : await publishOpportunity(id);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        disabled={submitting}
        className={
          published
            ? "rounded-md border border-cream-300 px-4 py-2 text-xs font-medium text-charcoal-600 hover:border-forest-700 disabled:opacity-60"
            : "rounded-md bg-forest-800 px-4 py-2 text-xs font-medium text-cream-50 hover:bg-forest-700 disabled:opacity-60"
        }
      >
        {submitting ? "Working…" : published ? "Unpublish" : "Publish"}
      </button>
      {error && <p className="mt-1 text-[11px] text-red-700">{error}</p>}
    </div>
  );
}
