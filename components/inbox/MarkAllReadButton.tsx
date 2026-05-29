"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markAllRead } from "@/app/actions/notifications";

export function MarkAllReadButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() =>
        start(async () => {
          await markAllRead();
          router.refresh();
        })
      }
      disabled={pending}
      className="btn-secondary !py-2 !px-3 text-xs disabled:opacity-60"
    >
      {pending ? "Marking…" : "Mark all as read"}
    </button>
  );
}
