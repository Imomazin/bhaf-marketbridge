"use client";

import { useState } from "react";
import { saveEntrepreneurProfile } from "@/app/actions/profile";
import { SearchableCountryField } from "@/components/settings/SearchableCountryField";
import { YEAR_OPTIONS } from "@/lib/countries";

const SECTORS = [
  "Circular Economy",
  "Clean Energy",
  "Agri-Processing",
  "Health & Beauty",
  "Technology",
  "Education",
  "Fashion & Textiles",
  "Other",
];

interface Initial {
  businessName: string;
  country: string;
  sector: string;
  description: string;
  fundingNeed: string;
  esgActivity: string;
  yearFounded: number | null;
  womenSupported: number;
  jobsCreated: number;
}

function parseFundingNeed(raw: string) {
  const normalized = raw.trim();
  if (!normalized) return { currency: "USD", amount: "" };

  const digits = normalized.replace(/\D/g, "");
  if (
    normalized.startsWith("NGN") ||
    normalized.startsWith("₦") ||
    normalized.toLowerCase().includes("naira")
  ) {
    return { currency: "NGN", amount: digits };
  }

  return { currency: "USD", amount: digits };
}

export function EntrepreneurProfileForm({ initial }: { initial: Initial }) {
  const initialFunding = parseFundingNeed(initial.fundingNeed);
  const [v, setV] = useState({
    ...initial,
    fundingCurrency: initialFunding.currency,
    fundingAmount: initialFunding.amount,
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const fundingNeed =
      v.fundingAmount.trim().length > 0
        ? `${v.fundingCurrency} ${Number(v.fundingAmount).toLocaleString("en-US")}`
        : undefined;
    const res = await saveEntrepreneurProfile({
      businessName: v.businessName,
      country: v.country,
      sector: v.sector,
      description: v.description || undefined,
      fundingNeed,
      esgActivity: v.esgActivity || undefined,
      yearFounded: v.yearFounded ?? undefined,
      womenSupported: v.womenSupported ?? undefined,
      jobsCreated: v.jobsCreated ?? undefined,
    });
    setSubmitting(false);
    setStatus(res);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <T
        label="Business name"
        value={v.businessName}
        onChange={(x) => setV({ ...v, businessName: x })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <SearchableCountryField
          label="Country"
          value={v.country}
          required
          onChange={(x) => setV({ ...v, country: x })}
        />
        <S
          label="Sector"
          value={v.sector}
          options={SECTORS}
          onChange={(x) => setV({ ...v, sector: x })}
        />
      </div>
      <TA
        label="Business description"
        value={v.description}
        onChange={(x) => setV({ ...v, description: x })}
      />
      <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
        <S
          label="Funding currency"
          value={v.fundingCurrency}
          options={["NGN", "USD"]}
          onChange={(x) => setV({ ...v, fundingCurrency: x })}
        />
        <T
          label="Funding amount"
          value={v.fundingAmount}
          inputMode="numeric"
          placeholder="120000"
          onChange={(x) => setV({ ...v, fundingAmount: x.replace(/\D/g, "") })}
        />
      </div>
      <TA
        label="ESG / impact activity"
        value={v.esgActivity}
        onChange={(x) => setV({ ...v, esgActivity: x })}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <YearSelect
          label="Year founded"
          value={v.yearFounded}
          onChange={(x) => setV({ ...v, yearFounded: x })}
        />
        <N
          label="Women supported"
          value={v.womenSupported}
          onChange={(x) => setV({ ...v, womenSupported: x ?? 0 })}
        />
        <N
          label="Jobs created"
          value={v.jobsCreated}
          onChange={(x) => setV({ ...v, jobsCreated: x ?? 0 })}
        />
      </div>

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

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function T({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">
        {label}
      </span>
      <input
        value={value}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-300 focus:border-forest-700 focus:outline-none"
      />
    </label>
  );
}

function TA({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
      />
    </label>
  );
}
function S({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function YearSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">
        {label}
      </span>
      <select
        value={value?.toString() ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
      >
        <option value="">Select…</option>
        {YEAR_OPTIONS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </label>
  );
}

function N({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">
        {label}
      </span>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
        className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-forest-900 focus:border-forest-700 focus:outline-none"
      />
    </label>
  );
}
