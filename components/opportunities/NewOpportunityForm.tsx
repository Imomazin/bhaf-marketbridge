"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOpportunity, updateOpportunity } from "@/app/actions/opportunities";
import type { OpportunityInput } from "@/lib/schemas/opportunity";

const TYPES: { value: "GRANT" | "INVESTMENT" | "PROCUREMENT" | "PROGRAMME" | "CERTIFICATION" | "GOVERNMENT"; label: string }[] = [
  { value: "GRANT", label: "Grant" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "PROCUREMENT", label: "Procurement" },
  { value: "PROGRAMME", label: "Programme" },
  { value: "CERTIFICATION", label: "Certification" },
  { value: "GOVERNMENT", label: "Government & multilateral" },
];

interface NewOpportunityFormProps {
  opportunityId?: string;
  initial?: OpportunityInput;
}

export function NewOpportunityForm({ opportunityId, initial }: NewOpportunityFormProps) {
  const router = useRouter();
  const isEdit = Boolean(opportunityId);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [organisation, setOrganisation] = useState(initial?.organisation ?? "");
  const [type, setType] = useState<typeof TYPES[number]["value"]>(initial?.type ?? "GRANT");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [eligibility, setEligibility] = useState(initial?.eligibility ?? "");
  const [submitting, setSubmitting] = useState<"draft" | "publish" | "save" | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(mode: "draft" | "publish" | "save") {
    setSubmitting(mode);
    setStatus(null);
    const payload: OpportunityInput = {
      title,
      organisation,
      type,
      region: region || undefined,
      amount: amount || undefined,
      deadline: deadline || undefined,
      description,
      eligibility: eligibility || undefined,
    };
    const res = isEdit && opportunityId
      ? await updateOpportunity(opportunityId, payload)
      : await createOpportunity(payload, mode === "publish");
    setSubmitting(null);
    setStatus(res);
    if (res.ok) {
      router.push(isEdit ? `/admin/opportunities/${opportunityId}` : `/admin/opportunities/${res.id}`);
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(isEdit ? "save" : "publish");
      }}
      className="space-y-4"
    >
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

      <div className="flex flex-wrap gap-3">
        {isEdit ? (
          <button type="submit" disabled={submitting !== null} className="btn-primary disabled:opacity-60">
            {submitting === "save" ? "Saving…" : "Save changes"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onSubmit("draft")}
              disabled={submitting !== null}
              className="rounded-md border border-cream-300 px-4 py-2 text-sm font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900 disabled:opacity-60"
            >
              {submitting === "draft" ? "Saving…" : "Save as draft"}
            </button>
            <button type="submit" disabled={submitting !== null} className="btn-primary disabled:opacity-60">
              {submitting === "publish" ? "Publishing…" : "Publish now"}
            </button>
          </>
        )}
      </div>
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
