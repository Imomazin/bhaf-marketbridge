"use client";

import { useState } from "react";
import { runKycCheck } from "@/app/actions/kyc";
import { cn } from "@/lib/utils";

const COUNTRIES = ["Nigeria", "Kenya", "Ghana", "South Africa", "Senegal", "DRC", "Other"];
const ID_TYPES = ["National ID", "Passport", "Driver's licence", "Voter card"];

export function KycSection({ initialFullName }: { initialFullName: string }) {
  const [fullName, setFullName] = useState(initialFullName);
  const [country, setCountry] = useState("Nigeria");
  const [idType, setIdType] = useState("National ID");
  const [idNumber, setIdNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; status?: string; ref?: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await runKycCheck({ fullName, country, idType, idNumber });
    setSubmitting(false);
    setResult(res);
  }

  const statusStyle =
    result?.status === "PASS"
      ? "border-forest-200 bg-forest-50 text-forest-800"
      : result?.status === "WARN"
      ? "border-gold-200 bg-gold-50 text-gold-800"
      : result?.status === "FAIL"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-cream-200 bg-cream-100 text-charcoal-600";

  return (
    <section className="card p-6">
      <h2 className="font-serif text-lg text-forest-900">Identity verification (KYC)</h2>
      <p className="mt-1 text-xs text-charcoal-500">
        We use Smile ID for African KYC checks. If no provider key is configured this runs in
        deterministic stub mode so you can see the workflow.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        <T label="Full legal name" value={fullName} onChange={setFullName} />
        <div className="grid gap-3 md:grid-cols-3">
          <S label="Country" value={country} options={COUNTRIES} onChange={setCountry} />
          <S label="ID type" value={idType} options={ID_TYPES} onChange={setIdType} />
          <T label="ID number" value={idNumber} onChange={setIdNumber} />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary !py-2 !px-3 text-xs disabled:opacity-60">
          {submitting ? "Verifying…" : "Run KYC check"}
        </button>

        {result && (
          <div className={cn("rounded-md border px-3 py-2 text-xs", statusStyle)}>
            <p className="font-semibold">
              {result.status ?? (result.ok ? "OK" : "ERROR")}
              {result.ref && <span className="ml-2 font-mono text-[10px] opacity-75">{result.ref}</span>}
            </p>
            <p className="mt-1">{result.message}</p>
          </div>
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
