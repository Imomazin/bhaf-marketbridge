"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deactivateUser, reactivateUser } from "@/app/actions/userManagement";

export function UserStatusActions({ userId, status }: { userId: string; status: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onToggle() {
    setSubmitting(true);
    setError(null);
    const res = status === "SUSPENDED" ? await reactivateUser(userId) : await deactivateUser(userId);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
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
        {submitting ? "Working…" : status === "SUSPENDED" ? "Reactivate" : "Deactivate"}
      </button>
      {error && <p className="mt-1 text-[11px] text-red-700">{error}</p>}
    </div>
  );
}
