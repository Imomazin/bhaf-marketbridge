"use client";

import { useState } from "react";
import Link from "next/link";
import { createCorporateByAdmin, type ProvisioningResult } from "@/app/actions/adminProvisioning";
import { generateSecurePassword } from "@/lib/schemas/adminProvisioning";

export function AdminCorporateCreationForm() {
  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    email: "",
    industry: "FMCG",
    procurementGeo: "Nigeria, Kenya, Ghana",
    esgFramework: "Supplier Diversity & Circular Sourcing Programme",
    password: "",
    sendWelcomeEmail: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ProvisioningResult | null>(null);
  const [copied, setCopied] = useState(false);

  function handleAutoGeneratePassword() {
    const pwd = generateSecurePassword();
    setForm((prev) => ({ ...prev, password: pwd }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const res = await createCorporateByAdmin({
      orgName: form.orgName,
      contactName: form.contactName,
      email: form.email,
      industry: form.industry,
      procurementGeo: form.procurementGeo,
      esgFramework: form.esgFramework || undefined,
      password: form.password || undefined,
      sendWelcomeEmail: form.sendWelcomeEmail,
    });

    setSubmitting(false);
    setResult(res);
  }

  function copyCredentials() {
    if (!result?.credentials) return;
    const text = `BHAF MarketBridge Corporate Partner Account
Organization: ${result.credentials.orgName}
Email: ${result.credentials.email}
Temporary Password: ${result.credentials.temporaryPassword}
Login URL: ${result.credentials.loginUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card p-6 md:p-8">
      {result?.ok && result.credentials ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-forest-200 bg-forest-50 p-6 text-forest-900">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-800 text-cream-50 text-sm font-bold">
                ✓
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-forest-900">
                  Corporate Partner Provisioned & Approved
                </h3>
                <p className="text-xs text-forest-700">
                  {result.message}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 rounded-lg border border-forest-200 bg-white p-4 font-mono text-xs">
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-charcoal-400">Company:</span>
                <span className="font-semibold text-charcoal-800">{result.credentials.orgName}</span>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-charcoal-400">Sign-in Email:</span>
                <span className="font-semibold text-charcoal-800">{result.credentials.email}</span>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-charcoal-400">Temporary Password:</span>
                <span className="font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                  {result.credentials.temporaryPassword}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-charcoal-400">Status:</span>
                <span className="font-semibold text-forest-700">ACTIVE · APPROVED</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={copyCredentials}
                className="rounded-md bg-forest-800 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700 transition"
              >
                {copied ? "Copied to Clipboard!" : "Copy Credentials"}
              </button>
              <Link
                href="/admin/profiles"
                className="rounded-md border border-cream-300 bg-white px-4 py-2 text-xs font-medium text-charcoal-700 hover:border-forest-700 hover:text-forest-900 transition"
              >
                View in Profiles
              </Link>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setForm({
                    orgName: "",
                    contactName: "",
                    email: "",
                    industry: "FMCG",
                    procurementGeo: "Nigeria, Kenya, Ghana",
                    esgFramework: "Supplier Diversity & Circular Sourcing Programme",
                    password: "",
                    sendWelcomeEmail: true,
                  });
                }}
                className="text-xs text-forest-700 hover:underline ml-auto"
              >
                + Onboard Another Corporate Partner
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-cream-200 pb-4">
            <h3 className="font-serif text-lg text-forest-900">Company & Contact Details</h3>
            <p className="mt-1 text-xs text-charcoal-500">
              Corporate entity details and procurement desk contact person.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Company / Organization Name *
              </label>
              <input
                type="text"
                required
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                placeholder="e.g. Allied Consumer Goods"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Contact Person / Title *
              </label>
              <input
                type="text"
                required
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                placeholder="e.g. Adebola Coker (Head of Procurement)"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
              Contact Email Address *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. procurement@allied.example"
              className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>

          <div className="border-b border-cream-200 pt-2 pb-4">
            <h3 className="font-serif text-lg text-forest-900">Procurement & Sourcing Framework</h3>
            <p className="mt-1 text-xs text-charcoal-500">
              Define the corporate industry, target procurement geography, and ESG framework.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Industry / Sector *
              </label>
              <input
                type="text"
                required
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder="e.g. FMCG / Retail / Telecommunications / Banking"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Procurement Geographies *
              </label>
              <input
                type="text"
                required
                value={form.procurementGeo}
                onChange={(e) => setForm({ ...form, procurementGeo: e.target.value })}
                placeholder="e.g. Nigeria, Kenya, Ghana, West Africa"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
              ESG & Supplier Diversity Framework
            </label>
            <input
              type="text"
              value={form.esgFramework}
              onChange={(e) => setForm({ ...form, esgFramework: e.target.value })}
              placeholder="e.g. Women-Owned Supplier Diversity Program, GRI Standards, EcoVadis"
              className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>

          <div className="border-b border-cream-200 pt-2 pb-4">
            <h3 className="font-serif text-lg text-forest-900">Access Credentials</h3>
            <p className="mt-1 text-xs text-charcoal-500">
              Provide a custom password or leave blank to auto-generate a secure temporary password.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Temporary Password (Optional)
              </label>
              <button
                type="button"
                onClick={handleAutoGeneratePassword}
                className="text-xs font-semibold text-gold-700 hover:text-gold-800"
              >
                Auto-generate secure key
              </button>
            </div>
            <input
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Auto-generated if left blank"
              className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm font-mono focus:border-forest-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sendWelcomeEmail"
              checked={form.sendWelcomeEmail}
              onChange={(e) => setForm({ ...form, sendWelcomeEmail: e.target.checked })}
              className="h-4 w-4 rounded border-cream-300 text-forest-800 focus:ring-forest-700"
            />
            <label htmlFor="sendWelcomeEmail" className="text-xs text-charcoal-600 cursor-pointer">
              Automatically send welcome invitation email with login credentials
            </label>
          </div>

          {result && !result.ok && (
            <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              {result.message}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/profiles"
              className="rounded-md border border-cream-300 bg-white px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-cream-100 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-forest-800 px-5 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700 transition disabled:opacity-60"
            >
              {submitting ? "Provisioning Corporate…" : "Create & Approve Corporate Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
