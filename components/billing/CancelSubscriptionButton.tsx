"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelMySubscription } from "@/app/actions/billing";

export function CancelSubscriptionButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-400"
      >
        Cancel
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-charcoal-500">Cancel at period end?</span>
      <button
        onClick={() => setConfirming(false)}
        className="rounded-md border border-cream-300 px-2.5 py-1 text-[11px] text-charcoal-600 hover:border-forest-700"
      >
        Keep
      </button>
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            await cancelMySubscription(subscriptionId);
            setConfirming(false);
            router.refresh();
          })
        }
        className="rounded-md bg-red-700 px-2.5 py-1 text-[11px] font-medium text-cream-50 hover:bg-red-800 disabled:opacity-60"
      >
        {pending ? "Cancelling…" : "Confirm"}
      </button>
    </div>
  );
}
