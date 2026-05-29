"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCohort } from "@/app/actions/cohorts";

export function NewCohortForm() {
  const router = useRouter();
  const [v, setV] = useState({
    name: "",
    programme: "",
    region: "",
    description: "",
    startDate: "",
    endDate: "",
    capacity: "" as string | "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await createCohort({
      name: v.name,
      programme: v.programme || undefined,
      region: v.region || undefined,
      description: v.description || undefined,
      startDate: v.startDate || undefined,
      endDate: v.endDate || undefined,
      capacity: v.capacity === "" ? undefined : Number(v.capacity),
    });
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      setV({ name: "", programme: "", region: "", description: "", startDate: "", endDate: "", capacity: "" });
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <T label="Cohort name" value={v.name} onChange={(x) => setV({ ...v, name: x })} placeholder="Abuja Accelerator Cohort 2" />
        <T label="Programme" value={v.programme} onChange={(x) => setV({ ...v, programme: x })} placeholder="Abuja Accelerator" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <T label="Region" value={v.region} onChange={(x) => setV({ ...v, region: x })} placeholder="Nigeria" />
        <T label="Start date" type="date" value={v.startDate} onChange={(x) => setV({ ...v, startDate: x })} />
        <T label="End date" type="date" value={v.endDate} onChange={(x) => setV({ ...v, endDate: x })} />
      </div>
      <T label="Capacity" type="number" value={v.capacity} onChange={(x) => setV({ ...v, capacity: x })} />
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Description</span>
        <textarea value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} rows={3} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>

      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800" : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"}>{status.message}</p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary !py-2 !px-3 text-xs disabled:opacity-60">
        {submitting ? "Creating…" : "Create cohort"}
      </button>
    </form>
  );
}

function T({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
    </label>
  );
}
