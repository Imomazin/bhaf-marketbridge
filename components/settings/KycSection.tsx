"use client";

import { useState } from "react";
import { saveKycDetails } from "@/app/actions/kyc";
import { SearchableCountryField } from "@/components/settings/SearchableCountryField";

const ID_TYPES = ["National ID", "Passport", "Driver's licence", "Voter card"];

export function KycSection({
  initialFullName,
  initialCountry,
  initialIdType,
  initialIdNumber,
}: {
  initialFullName: string;
  initialCountry?: string;
  initialIdType?: string;
  initialIdNumber?: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [country, setCountry] = useState(initialCountry || "Nigeria");
  const [idType, setIdType] = useState(initialIdType || "National ID");
  const [idNumber, setIdNumber] = useState(initialIdNumber || "");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await saveKycDetails({ fullName, country, idType, idNumber });
    setSubmitting(false);
    setResult(res);
  }

  return (
    <section className="card p-6">
      <h2 className="font-serif text-lg text-forest-900">Identity verification (KYC)</h2>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <T label="Full legal name" value={fullName} onChange={setFullName} />
        <div className="grid gap-3 md:grid-cols-3">
          <SearchableCountryField label="Country" value={country} onChange={setCountry} required />
          <S label="ID type" value={idType} options={ID_TYPES} onChange={setIdType} />
          <T label="ID number" value={idNumber} onChange={setIdNumber} />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary !py-2 !px-3 text-xs disabled:opacity-60">
          {submitting ? "Saving…" : "Save KYC"}
        </button>

        {result && (
          <p
            className={
              result.ok
                ? "rounded-md bg-forest-50 px-3 py-2 text-xs text-forest-800"
                : "rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
            }
          >
            {result.message}
          </p>
        )}
      </form>
    </section>
  );
}

function T({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none" />
    </label>
  );
}
function S({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-500">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
