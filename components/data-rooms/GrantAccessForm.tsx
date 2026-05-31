"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { grantDataRoomAccess } from "@/app/actions/dataRooms";

export function GrantAccessForm({ dataRoomId }: { dataRoomId: string }) {
  const router = useRouter();
  const [recipientEmail, setRecipient] = useState("");
  const [level, setLevel] = useState<"VIEW" | "DOWNLOAD" | "EDIT">("VIEW");
  const [days, setDays] = useState<string>("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await grantDataRoomAccess({
      dataRoomId,
      recipientEmail,
      level,
      expiresInDays: days ? Number(days) : undefined,
    });
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      setRecipient("");
      setDays("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="block md:col-span-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Recipient email</span>
          <input type="email" required value={recipientEmail} onChange={(e) => setRecipient(e.target.value)} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value as typeof level)} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none">
            <option value="VIEW">View</option>
            <option value="DOWNLOAD">Download</option>
            <option value="EDIT">Edit</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Expires after (days, blank = no expiry)</span>
        <input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>

      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800" : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"}>{status.message}</p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary !py-2 !px-3 text-xs disabled:opacity-60">
        {submitting ? "Granting…" : "Grant access"}
      </button>
    </form>
  );
}
