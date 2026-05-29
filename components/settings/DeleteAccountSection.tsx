"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestAccountDeletion, exportMyData } from "@/app/actions/account";

export function DeleteAccountSection() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onExport() {
    setSubmitting(true);
    const res = await exportMyData();
    setSubmitting(false);
    if (res.ok && res.data) {
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bhaf-marketbridge-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      setStatus({ ok: res.ok, message: res.message });
    }
  }

  async function onDelete(e: React.FormEvent) {
    e.preventDefault();
    if (confirmText !== "DELETE") {
      setStatus({ ok: false, message: "Type DELETE to confirm." });
      return;
    }
    setSubmitting(true);
    const res = await requestAccountDeletion();
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      setTimeout(() => router.push("/"), 1500);
    }
  }

  return (
    <section className="card border-red-200 p-6">
      <h2 className="font-serif text-lg text-forest-900">Danger zone</h2>
      <p className="mt-1 text-xs text-charcoal-500">
        GDPR rights: export your data anytime, or delete your account permanently.
      </p>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-forest-900">Export my data</h3>
          <p className="mt-1 text-xs text-charcoal-500">Download a JSON file of everything we store about you.</p>
          <button
            type="button"
            onClick={onExport}
            disabled={submitting}
            className="btn-secondary mt-3 !py-2 !px-3 text-xs disabled:opacity-60"
          >
            {submitting ? "Preparing…" : "Download export"}
          </button>
        </div>

        <form onSubmit={onDelete}>
          <h3 className="text-sm font-semibold text-red-700">Delete my account</h3>
          <p className="mt-1 text-xs text-charcoal-500">
            Type <code className="rounded bg-cream-100 px-1">DELETE</code> to confirm. Irreversible.
          </p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="mt-2 block w-full rounded-md border border-red-200 bg-red-50/40 px-3 py-2 text-sm text-red-900 focus:border-red-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={submitting || confirmText !== "DELETE"}
            className="mt-3 inline-flex items-center justify-center rounded-md border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {submitting ? "Deleting…" : "Delete account"}
          </button>
        </form>
      </div>

      {status && (
        <p
          className={
            status.ok
              ? "mt-4 rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800"
              : "mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
          }
        >
          {status.message}
        </p>
      )}
    </section>
  );
}
