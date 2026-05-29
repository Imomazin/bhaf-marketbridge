"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inviteToCohort } from "@/app/actions/cohorts";

export function InviteForm({ cohortId }: { cohortId: string }) {
  const router = useRouter();
  const [emails, setEmails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await inviteToCohort(cohortId, emails);
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      setEmails("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        rows={3}
        placeholder="amara@greenweave.example, …"
        className="block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-xs focus:border-forest-700 focus:outline-none"
      />
      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-1.5 text-[11px] text-forest-800" : "rounded-md bg-red-50 px-3 py-1.5 text-[11px] text-red-700"}>{status.message}</p>
      )}
      <button type="submit" disabled={submitting || !emails.trim()} className="btn-primary !py-1.5 !px-3 text-[11px] disabled:opacity-60">
        {submitting ? "Inviting…" : "Send invitations"}
      </button>
    </form>
  );
}
