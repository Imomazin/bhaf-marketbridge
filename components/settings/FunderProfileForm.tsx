"use client";

import { useState } from "react";
import { saveFunderProfile } from "@/app/actions/profile";

interface Initial {
  orgName: string;
  mandate: string;
  geoFocus: string;
  sectorFocus: string;
  ticketMin: number | null;
  ticketMax: number | null;
}

export function FunderProfileForm({ initial }: { initial: Initial }) {
  const [v, setV] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await saveFunderProfile({
      orgName: v.orgName,
      mandate: v.mandate || undefined,
      geoFocus: v.geoFocus || undefined,
      sectorFocus: v.sectorFocus || undefined,
      ticketMin: v.ticketMin ?? undefined,
      ticketMax: v.ticketMax ?? undefined,
    });
    setSubmitting(false);
    setStatus(res);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Fund / organisation name</span>
        <input value={v.orgName} onChange={(e) => setV({ ...v, orgName: e.target.value })} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Investment mandate</span>
        <textarea value={v.mandate} onChange={(e) => setV({ ...v, mandate: e.target.value })} rows={3} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Geographic focus (comma separated)</span>
          <input value={v.geoFocus} onChange={(e) => setV({ ...v, geoFocus: e.target.value })} placeholder="Nigeria, Kenya, South Africa" className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Sector focus (comma separated)</span>
          <input value={v.sectorFocus} onChange={(e) => setV({ ...v, sectorFocus: e.target.value })} placeholder="Clean Energy, Agri-Processing" className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Ticket size — min (USD)</span>
          <input type="number" value={v.ticketMin ?? ""} onChange={(e) => setV({ ...v, ticketMin: e.target.value === "" ? null : Number(e.target.value) })} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Ticket size — max (USD)</span>
          <input type="number" value={v.ticketMax ?? ""} onChange={(e) => setV({ ...v, ticketMax: e.target.value === "" ? null : Number(e.target.value) })} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
        </label>
      </div>

      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800" : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"}>{status.message}</p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
