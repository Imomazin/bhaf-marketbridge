"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOpportunity } from "@/app/actions/opportunities";

const TYPES: { value: "GRANT" | "INVESTMENT" | "PROCUREMENT" | "PROGRAMME" | "CERTIFICATION"; label: string }[] = [
  { value: "GRANT", label: "Grant" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "PROCUREMENT", label: "Procurement" },
  { value: "PROGRAMME", label: "Programme" },
  { value: "CERTIFICATION", label: "Certification" },
];

export function NewOpportunityForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [type, setType] = useState<typeof TYPES[number]["value"]>("GRANT");
  const [region, setRegion] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const res = await createOpportunity({
      title,
      organisation,
      type,
      region: region || undefined,
      amount: amount || undefined,
      deadline: deadline || undefined,
      description,
      eligibility: eligibility || undefined,
    });
    setSubmitting(false);
    setStatus(res);
    if (res.ok) {
      router.push("/opportunities");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Title" value={title} onChange={setTitle} placeholder="Green Trade Accelerator Grant 2026" />
      <Field label="Organisation" value={organisation} onChange={setOrganisation} placeholder="BHAF & Pan-African Trade Foundation" />

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof TYPES[number]["value"])}
            className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <Field label="Region" value={region} onChange={setRegion} placeholder="Pan-African" />
        <Field label="Amount" value={amount} onChange={setAmount} placeholder="$25,000 – $75,000" />
      </div>

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Deadline (optional)</span>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the opportunity and its mission alignment."
          className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">Eligibility (one per line)</span>
        <textarea
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          rows={4}
          placeholder={"Women-owned or women-led business\nOperating in an African market\nDemonstrable ESG practice"}
          className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
        />
      </label>

      {status && (
        <p
          className={
            status.ok
              ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800"
              : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
          }
        >
          {status.message}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
        {submitting ? "Publishing…" : "Publish opportunity"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
      />
    </label>
  );
}
