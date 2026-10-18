"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  SERVICE_TRACKS,
  ENGAGEMENT_TYPES,
  ORG_STAGES,
  DELIVERABLE_ADDONS,
  calculateConsultingEstimate,
  type ConsultingPricingInput,
} from "@/lib/consultingPricing";
import { submitConsultingRequest, type ConsultingSubmissionResult } from "@/app/actions/consulting";
import { cn } from "@/lib/utils";

export function BespokeConsultingForm({
  initialUser,
}: {
  initialUser?: { name?: string | null; email?: string | null } | null;
}) {
  const [config, setConfig] = useState<ConsultingPricingInput>({
    serviceTrackId: "ESG_SUSTAINABILITY",
    engagementTypeId: "PROJECT_SPRINT",
    orgStageId: "GROWTH_STAGE",
    selectedAddonIds: ["DATA_ROOM_AUDIT"],
    urgency: "STANDARD",
  });

  const [contact, setContact] = useState({
    name: initialUser?.name ?? "",
    email: initialUser?.email ?? "",
    orgName: "",
    phone: "",
    country: "Nigeria",
    clientBudget: "$5,000 - $15,000",
    targetStartDate: "Within 3-4 weeks",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ConsultingSubmissionResult | null>(null);

  // Live calculated estimate
  const estimate = useMemo(() => {
    return calculateConsultingEstimate(config);
  }, [config]);

  function toggleAddon(addonId: string) {
    setConfig((prev) => {
      const exists = prev.selectedAddonIds.includes(addonId);
      return {
        ...prev,
        selectedAddonIds: exists
          ? prev.selectedAddonIds.filter((id) => id !== addonId)
          : [...prev.selectedAddonIds, addonId],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const res = await submitConsultingRequest({
      name: contact.name,
      email: contact.email,
      orgName: contact.orgName,
      phone: contact.phone,
      country: contact.country,
      serviceTrackId: config.serviceTrackId,
      orgStageId: config.orgStageId,
      engagementTypeId: config.engagementTypeId,
      selectedAddonIds: config.selectedAddonIds,
      urgency: config.urgency,
      clientBudget: contact.clientBudget,
      targetStartDate: contact.targetStartDate,
      description: contact.description,
    });

    setSubmitting(false);
    setResult(res);
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-12">
      {/* Main Request Form */}
      <div className="lg:col-span-7 xl:col-span-8">
        {result?.ok ? (
          <div className="card border-forest-200 bg-forest-50/70 p-8 text-forest-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 text-cream-50 font-bold text-xl">
              ✓
            </div>
            <h3 className="mt-4 font-serif text-2xl text-forest-900">
              Consulting Request Submitted!
            </h3>
            <p className="mt-2 text-sm text-forest-800">
              Thank you for reaching out to BHAF Circular Academy & Consulting Firm. Your request has been queued with our senior advisory team.
            </p>

            <div className="mt-6 rounded-xl border border-forest-200 bg-white p-5 font-mono text-xs text-charcoal-700 space-y-2">
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-charcoal-400">Reference ID:</span>
                <span className="font-semibold text-forest-800">{result.referenceId}</span>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-charcoal-400">Track:</span>
                <span className="font-semibold">{result.estimate?.track.title}</span>
              </div>
              <div className="flex justify-between border-b border-cream-200 pb-2">
                <span className="text-charcoal-400">Engagement Scope:</span>
                <span className="font-semibold">{result.estimate?.engagement.name}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-charcoal-400">Estimated Variable Range:</span>
                <span className="font-bold text-forest-900">
                  ${result.estimate?.totalMinUsd.toLocaleString()} – ${result.estimate?.totalMaxUsd.toLocaleString()} USD
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-cream-100/70 p-4 text-xs text-charcoal-600">
              <p className="font-semibold text-forest-900">What happens next?</p>
              <ul className="mt-2 list-disc pl-4 space-y-1">
                <li>We have sent a confirmation email to <strong>{contact.email}</strong>.</li>
                <li>A BHAF Lead Partner will review your objectives and draft a tailored Terms of Reference (ToR).</li>
                <li>You will receive a formal proposal and schedule an introductory alignment call within 1-2 business days.</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/billing"
                className="rounded-md bg-forest-800 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-forest-700 transition"
              >
                Return to Pricing
              </Link>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setContact({
                    name: initialUser?.name ?? "",
                    email: initialUser?.email ?? "",
                    orgName: "",
                    phone: "",
                    country: "Nigeria",
                    clientBudget: "$5,000 - $15,000",
                    targetStartDate: "Within 3-4 weeks",
                    description: "",
                  });
                }}
                className="text-xs text-forest-700 hover:underline"
              >
                Submit another request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Service Track */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-3 border-b border-cream-200 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-700 text-cream-50 text-xs font-bold">
                  1
                </span>
                <div>
                  <h2 className="font-serif text-lg text-forest-900">Select Advisory Service Track</h2>
                  <p className="text-xs text-charcoal-500">
                    Choose the core focus area for your consulting engagement.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SERVICE_TRACKS.map((track) => {
                  const isSelected = config.serviceTrackId === track.id;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setConfig({ ...config, serviceTrackId: track.id })}
                      className={cn(
                        "flex flex-col text-left rounded-xl border p-4 transition",
                        isSelected
                          ? "border-forest-800 bg-forest-50/60 shadow-sm ring-1 ring-forest-800"
                          : "border-cream-300 bg-white hover:border-forest-700 hover:bg-cream-50/50",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{track.icon}</span>
                        {isSelected && (
                          <span className="rounded-full bg-forest-800 px-2 py-0.5 text-[10px] font-semibold text-cream-50">
                            Selected
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 font-serif text-sm font-semibold text-forest-900">
                        {track.title}
                      </h4>
                      <p className="mt-1 text-xs text-charcoal-600 line-clamp-2">
                        {track.shortDesc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Engagement Scope & Duration */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-3 border-b border-cream-200 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-700 text-cream-50 text-xs font-bold">
                  2
                </span>
                <div>
                  <h2 className="font-serif text-lg text-forest-900">Engagement Scope & Duration</h2>
                  <p className="text-xs text-charcoal-500">
                    Select the depth of collaboration required.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {ENGAGEMENT_TYPES.map((type) => {
                  const isSelected = config.engagementTypeId === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setConfig({ ...config, engagementTypeId: type.id })}
                      className={cn(
                        "flex flex-col text-left rounded-xl border p-4 transition",
                        isSelected
                          ? "border-forest-800 bg-forest-50/60 shadow-sm ring-1 ring-forest-800"
                          : "border-cream-300 bg-white hover:border-forest-700 hover:bg-cream-50/50",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-900">
                          {type.duration}
                        </span>
                        {isSelected && <span className="text-forest-800 text-xs font-bold">●</span>}
                      </div>
                      <h4 className="mt-2 font-serif text-sm font-semibold text-forest-900">
                        {type.name}
                      </h4>
                      <p className="mt-1 text-[11px] text-charcoal-500">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Organization Stage & Multiplier */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-3 border-b border-cream-200 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-700 text-cream-50 text-xs font-bold">
                  3
                </span>
                <div>
                  <h2 className="font-serif text-lg text-forest-900">Organization Stage & Concessionary Tier</h2>
                  <p className="text-xs text-charcoal-500">
                    Variable pricing adapts dynamically to your organization’s turnover and operating scale.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {ORG_STAGES.map((stage) => {
                  const isSelected = config.orgStageId === stage.id;
                  return (
                    <label
                      key={stage.id}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-3.5 transition cursor-pointer",
                        isSelected
                          ? "border-forest-800 bg-forest-50/60 shadow-sm"
                          : "border-cream-300 bg-white hover:bg-cream-50/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="orgStage"
                        checked={isSelected}
                        onChange={() => setConfig({ ...config, orgStageId: stage.id })}
                        className="mt-1 h-4 w-4 text-forest-800 focus:ring-forest-700 border-cream-300"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-forest-900">{stage.label}</span>
                          {stage.discountBadge && (
                            <span className="rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-bold text-forest-800">
                              {stage.discountBadge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-charcoal-500">{stage.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Deliverable Add-ons & Urgency */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-3 border-b border-cream-200 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-700 text-cream-50 text-xs font-bold">
                  4
                </span>
                <div>
                  <h2 className="font-serif text-lg text-forest-900">Optional Deliverable Add-ons</h2>
                  <p className="text-xs text-charcoal-500">
                    Attach specialized technical deliverables to your engagement scope.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {DELIVERABLE_ADDONS.map((addon) => {
                  const isSelected = config.selectedAddonIds.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={cn(
                        "flex items-start justify-between rounded-xl border p-3.5 text-left transition",
                        isSelected
                          ? "border-forest-800 bg-forest-50/60 ring-1 ring-forest-800"
                          : "border-cream-300 bg-white hover:border-forest-700 hover:bg-cream-50/40",
                      )}
                    >
                      <div>
                        <span className="rounded bg-cream-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-charcoal-700">
                          {addon.category}
                        </span>
                        <h4 className="mt-1 text-xs font-semibold text-forest-900">
                          {addon.name}
                        </h4>
                        <p className="mt-0.5 text-[11px] text-charcoal-500">
                          {addon.description}
                        </p>
                      </div>
                      <div className="ml-3 text-right">
                        <span className="font-mono text-xs font-bold text-forest-800">
                          +${addon.priceUsd.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-charcoal-400">
                          {isSelected ? "✓ Added" : "+ Add"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Timeline Urgency */}
              <div className="mt-6 border-t border-cream-200 pt-4">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                  Timeline Urgency
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, urgency: "STANDARD" })}
                    className={cn(
                      "rounded-lg border p-3 text-left transition",
                      config.urgency === "STANDARD"
                        ? "border-forest-800 bg-forest-50/60 ring-1 ring-forest-800"
                        : "border-cream-300 bg-white hover:bg-cream-50",
                    )}
                  >
                    <span className="text-xs font-semibold text-forest-900">Standard Delivery</span>
                    <span className="block text-[11px] text-charcoal-500">Standard schedule (3-6 weeks)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, urgency: "EXPEDITED" })}
                    className={cn(
                      "rounded-lg border p-3 text-left transition",
                      config.urgency === "EXPEDITED"
                        ? "border-gold-600 bg-gold-50 ring-1 ring-gold-600"
                        : "border-cream-300 bg-white hover:bg-cream-50",
                    )}
                  >
                    <span className="text-xs font-semibold text-gold-900">Expedited Priority (+25%)</span>
                    <span className="block text-[11px] text-charcoal-500">Accelerated rush (&lt;2 weeks)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5: Contact & Objectives */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-3 border-b border-cream-200 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-700 text-cream-50 text-xs font-bold">
                  5
                </span>
                <div>
                  <h2 className="font-serif text-lg text-forest-900">Contact & Project Objectives</h2>
                  <p className="text-xs text-charcoal-500">
                    Tell us about your organization and specific goals so we can customize the proposal.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="e.g. Amina Bello"
                    className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                    Business / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact.orgName}
                    onChange={(e) => setContact({ ...contact, orgName: e.target.value })}
                    placeholder="e.g. EcoFab Africa Ltd."
                    className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="e.g. amina@ecofab.example"
                    className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+234 801 234 5678"
                    className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact.country}
                    onChange={(e) => setContact({ ...contact, country: e.target.value })}
                    placeholder="Nigeria"
                    className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                    Target Budget Range (USD)
                  </label>
                  <select
                    value={contact.clientBudget}
                    onChange={(e) => setContact({ ...contact, clientBudget: e.target.value })}
                    className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
                  >
                    <option value="Under $2,500">Under $2,500</option>
                    <option value="$2,500 - $5,000">$2,500 – $5,000</option>
                    <option value="$5,000 - $15,000">$5,000 – $15,000</option>
                    <option value="$15,000 - $30,000">$15,000 – $30,000</option>
                    <option value="$30,000+">$30,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                    Target Kickoff Date
                  </label>
                  <select
                    value={contact.targetStartDate}
                    onChange={(e) => setContact({ ...contact, targetStartDate: e.target.value })}
                    className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
                  >
                    <option value="Immediately (Next 7 days)">Immediately (Next 7 days)</option>
                    <option value="Within 2-4 weeks">Within 2–4 weeks</option>
                    <option value="Next Quarter">Next Quarter</option>
                    <option value="Flexible / Exploring">Flexible / Exploring</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-charcoal-600">
                  Project Description & Key Challenges *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contact.description}
                  onChange={(e) => setContact({ ...contact, description: e.target.value })}
                  placeholder="Describe your current bottlenecks, target deliverables, specific donor/investor requirements, or any questions for our advisory team..."
                  className="mt-1.5 block w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm focus:border-forest-700 focus:outline-none"
                />
              </div>

              {result && !result.ok && (
                <div className="mt-4 rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  {result.message}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-forest-800 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-forest-700 transition shadow-sm disabled:opacity-60"
                >
                  {submitting ? "Submitting Request…" : "Submit Bespoke Consulting Request"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Sticky Dynamic Variable Pricing Summary Sidebar */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="sticky top-24 rounded-2xl border border-cream-300 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              Live Price Estimator
            </span>
            <span className="rounded-full bg-forest-50 border border-forest-200 px-2 py-0.5 text-[10px] font-bold text-forest-800">
              Variable Pricing
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs text-charcoal-500">Estimated Engagement Range</span>
            <div className="mt-1 font-serif text-3xl font-bold text-forest-900">
              ${estimate.totalMinUsd.toLocaleString()} – ${estimate.totalMaxUsd.toLocaleString()}
              <span className="text-xs font-normal text-charcoal-500"> USD</span>
            </div>
            <p className="mt-1 text-[11px] text-charcoal-500">
              Includes baseline scope, stage multiplier, and {config.selectedAddonIds.length} add-on{config.selectedAddonIds.length === 1 ? "" : "s"}.
            </p>
          </div>

          {estimate.discountAmount > 0 && (
            <div className="mt-3 rounded-lg bg-forest-50 p-2.5 text-xs text-forest-900 border border-forest-200">
              <span className="font-semibold">Grassroots Concession:</span> Saved ~${estimate.discountAmount.toLocaleString()} USD ({estimate.stage.label}).
            </div>
          )}

          {/* Itemized Cost Breakdown */}
          <div className="mt-5 border-t border-cream-200 pt-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-600">
              Itemized Cost Breakdown
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {estimate.breakdown.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 border-b border-cream-100 pb-1.5">
                  <div>
                    <span className="font-medium text-forest-900">{item.label}</span>
                    {item.detail && (
                      <span className="block text-[10px] text-charcoal-400">{item.detail}</span>
                    )}
                  </div>
                  <span className="font-mono font-semibold text-charcoal-700">
                    ${item.amountUsd.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Deliverables in Selected Track */}
          <div className="mt-5 border-t border-cream-200 pt-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-600">
              Core Deliverables ({estimate.track.title})
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs text-charcoal-600">
              {estimate.track.keyDeliverables.map((del, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-600" />
                  {del}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl bg-cream-100 p-3.5 text-xs text-charcoal-600">
            <p className="font-semibold text-forest-900">Fixed-Price Guarantee</p>
            <p className="mt-1 text-[11px]">
              Final binding quote will never exceed this estimated range without an explicitly agreed scope modification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
