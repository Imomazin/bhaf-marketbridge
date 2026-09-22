"use client";

import { useState } from "react";
import Link from "next/link";
import { createFunderByAdmin, type ProvisioningResult } from "@/app/actions/adminProvisioning";
import { generateSecurePassword } from "@/lib/schemas/adminProvisioning";

export function AdminFunderCreationForm() {
  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    email: "",
    mandate: "",
    geoFocus: "Nigeria, Kenya, South Africa",
    sectorFocus: "Clean Energy, Circular Economy, Agri-Processing",
    ticketMin: "",
    ticketMax: "",
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

    const res = await createFunderByAdmin({
      orgName: form.orgName,
      contactName: form.contactName,
      email: form.email,
      mandate: form.mandate,
      geoFocus: form.geoFocus,
      sectorFocus: form.sectorFocus,
      ticketMin: form.ticketMin ? Number(form.ticketMin) : null,
      ticketMax: form.ticketMax ? Number(form.ticketMax) : null,
      password: form.password || undefined,
      sendWelcomeEmail: form.sendWelcomeEmail,
    });

    setSubmitting(false);
    setResult(res);
  }

  function copyCredentials() {
    if (!result?.credentials) return;
    const text = `BHAF MarketBridge Funder Account
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
                  Funder Profile Provisioned & Approved
                </h3>
                <p className="text-xs text-forest-700">
                  {result.message}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 rounded-lg border border-forest-200 bg-white p-4 font-mono text-xs">
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-charcoal-400">Organization:</span>
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
                    mandate: "",
                    geoFocus: "Nigeria, Kenya, South Africa",
                    sectorFocus: "Clean Energy, Circular Economy, Agri-Processing",
                    ticketMin: "",
                    ticketMax: "",
                    password: "",
                    sendWelcomeEmail: true,
                  });
                }}
                className="text-xs text-forest-700 hover:underline ml-auto"
              >
                + Onboard Another Funder
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-cream-200 pb-4">
            <h3 className="font-serif text-lg text-forest-900">Organization & Contact Details</h3>
            <p className="mt-1 text-xs text-charcoal-500">
              Basic entity information and the primary account contact for this funder.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Fund / Organization Name *
              </label>
              <input
                type="text"
                required
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                placeholder="e.g. Mosaic Impact Partners"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                placeholder="e.g. Sarah Jenkins (Managing Director)"
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
              placeholder="e.g. fund@mosaic.example"
              className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>

          <div className="border-b border-cream-200 pt-2 pb-4">
            <h3 className="font-serif text-lg text-forest-900">Investment Thesis & Criteria</h3>
            <p className="mt-1 text-xs text-charcoal-500">
              Define the mandate, focus sectors, target regions, and check sizes.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
              Investment Mandate & Focus *
            </label>
            <textarea
              required
              rows={3}
              value={form.mandate}
              onChange={(e) => setForm({ ...form, mandate: e.target.value })}
              placeholder="e.g. Early-stage and growth equity for high-impact African women-led ventures in clean energy and agriculture."
              className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Geographic Focus (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={form.geoFocus}
                onChange={(e) => setForm({ ...form, geoFocus: e.target.value })}
                placeholder="Nigeria, Kenya, Ghana, South Africa"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Sector Focus (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={form.sectorFocus}
                onChange={(e) => setForm({ ...form, sectorFocus: e.target.value })}
                placeholder="Clean Energy, Agri-Processing, Circular Economy"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Min Ticket Size (USD)
              </label>
              <input
                type="number"
                value={form.ticketMin}
                onChange={(e) => setForm({ ...form, ticketMin: e.target.value })}
                placeholder="25000"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                Max Ticket Size (USD)
              </label>
              <input
                type="number"
                value={form.ticketMax}
                onChange={(e) => setForm({ ...form, ticketMax: e.target.value })}
                placeholder="500000"
                className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
              />
            </div>
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
              {submitting ? "Provisioning Funder…" : "Create & Approve Funder Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
