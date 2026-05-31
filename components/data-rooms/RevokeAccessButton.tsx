"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { revokeDataRoomAccess } from "@/app/actions/dataRooms";

export function RevokeAccessButton({ dataRoomId, userId }: { dataRoomId: string; userId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          await revokeDataRoomAccess({ dataRoomId, userId });
          router.refresh();
        })
      }
      className="rounded-md border border-red-200 px-3 py-1.5 text-[11px] font-medium text-red-700 hover:border-red-400 disabled:opacity-60"
    >
      {pending ? "…" : "Revoke"}
    </button>
  );
}
