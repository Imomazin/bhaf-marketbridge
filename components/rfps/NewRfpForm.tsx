"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRfp } from "@/app/actions/rfps";

const CATEGORIES = [
  "Fashion & Textiles",
  "Agri-Processing",
  "Clean Energy",
  "Beauty & Wellness",
  "Technology Services",
  "Training",
  "Crafts & Lifestyle",
  "Other",
];

export function NewRfpForm() {
  const router = useRouter();
  const [v, setV] = useState({
    title: "",
    category: "Fashion & Textiles",
    region: "",
    budgetUsd: "",
    deadline: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await createRfp({
      title: v.title,
      category: v.category,
      region: v.region || undefined,
      budgetUsd: v.budgetUsd || undefined,
      deadline: v.deadline || undefined,
      description: v.description,
    });
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      router.push("/marketplace/rfps");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <T label="Title" value={v.title} onChange={(x) => setV({ ...v, title: x })} placeholder="Q3 reusable cotton tote bag supply" />
      <div className="grid gap-4 md:grid-cols-3">
        <S label="Category" value={v.category} options={CATEGORIES} onChange={(x) => setV({ ...v, category: x })} />
        <T label="Region" value={v.region} onChange={(x) => setV({ ...v, region: x })} placeholder="West Africa" />
        <T label="Budget" value={v.budgetUsd} onChange={(x) => setV({ ...v, budgetUsd: x })} placeholder="$25k – $75k" />
      </div>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Deadline (optional)</span>
        <input type="date" value={v.deadline} onChange={(e) => setV({ ...v, deadline: e.target.value })} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>
      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Description</span>
        <textarea required value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} rows={6} placeholder="Specify volumes, quality, certifications, lead time, payment terms…" className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
      </label>

      {status && (
        <p className={status.ok ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800" : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"}>{status.message}</p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? "Publishing…" : "Publish RFP"}
      </button>
    </form>
  );
}

function T({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
    </label>
  );
}
function S({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
