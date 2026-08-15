"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteListing } from "@/app/actions/listings";

export function DeactivateListingButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (!confirm(`Are you sure you want to deactivate ${title}?`)) return;
        startTransition(async () => {
          const res = await deleteListing(id);
          if (res.ok) {
            router.refresh();
          } else {
            alert(res.message);
          }
        });
      }}
      disabled={isPending}
      className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      {isPending ? "Deactivating..." : "Deactivate"}
    </button>
  );
}
