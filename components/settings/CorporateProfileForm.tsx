"use client";

import { useState } from "react";
import { saveCorporateProfile } from "@/app/actions/profile";

interface Initial {
  orgName: string;
  industry: string;
  procurementGeo: string;
  esgFramework: string;
}

export function CorporateProfileForm({ initial }: { initial: Initial }) {
  const [v, setV] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await saveCorporateProfile({
      orgName: v.orgName,
      industry: v.industry,
      procurementGeo: v.procurementGeo || undefined,
      esgFramework: v.esgFramework || undefined,
    });
    setSubmitting(false);
    setStatus(res);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Company name</span>
        <input value={v.orgName} onChange={(e) => setV({ ...v, orgName: e.target.value })} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Industry</span>
        <input value={v.industry} onChange={(e) => setV({ ...v, industry: e.target.value })} placeholder="FMCG / Banking / Energy / …" className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Procurement geographies (comma separated)</span>
        <input value={v.procurementGeo} onChange={(e) => setV({ ...v, procurementGeo: e.target.value })} placeholder="West Africa, East Africa, EU" className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">ESG framework</span>
        <input value={v.esgFramework} onChange={(e) => setV({ ...v, esgFramework: e.target.value })} placeholder="GRI / ISSB / SASB / B-Corp" className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>

      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800" : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"}>{status.message}</p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
