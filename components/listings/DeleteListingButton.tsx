"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteListing } from "@/app/actions/listings";

export function DeleteListingButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (!confirm("Are you sure you want to delete this listing?")) return;
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
      className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
