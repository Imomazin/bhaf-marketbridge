"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { unarchiveListing } from "@/app/actions/listings";

export function UnarchiveListingButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (!confirm(`Are you sure you want to unarchive ${title}? It will go back onto the marketplace.`)) return;
        startTransition(async () => {
          const res = await unarchiveListing(id);
          if (res.ok) {
            router.refresh();
          } else {
            alert(res.message);
          }
        });
      }}
      disabled={isPending}
      className="rounded-md border border-forest-200 bg-forest-50 px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-forest-100 disabled:opacity-50"
    >
      {isPending ? "Unarchiving..." : "Unarchive"}
    </button>
  );
}
