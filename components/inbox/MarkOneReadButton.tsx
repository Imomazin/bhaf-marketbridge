"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markNotificationRead } from "@/app/actions/notifications";

export function MarkOneReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() =>
        start(async () => {
          await markNotificationRead(id);
          router.refresh();
        })
      }
      disabled={pending}
      className="text-[11px] font-medium text-charcoal-500 hover:text-forest-900 disabled:opacity-60"
    >
      Mark read
    </button>
  );
}
