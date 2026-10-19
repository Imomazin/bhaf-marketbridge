"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewListing } from "@/app/actions/listings";

export function ApproveListingButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          const res = await reviewListing(id, "APPROVE");
          if (res.ok) {
            router.refresh();
          } else {
            alert(res.message);
          }
        });
      }}
      disabled={isPending}
      className="rounded-md border border-forest-300 bg-forest-50 px-3 py-1.5 text-xs font-medium text-forest-800 hover:bg-forest-100 disabled:opacity-50"
    >
      {isPending ? "Approving..." : "Approve & Publish"}
    </button>
  );
}
