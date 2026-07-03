import Link from "next/link";
import { prisma, DB_ENABLED } from "@/lib/db";

interface Metric {
  label: string;
  value: number | string;
  hint: string;
}

/**
 * Live aggregation strip pulled from the DB — proves the platform is
 * real and stops the Use Cases page from feeling like a static brochure.
 * Falls back to a "starter" view when the DB is empty.
 */
export async function LiveMetricRibbon() {
  const metrics: Metric[] = [];

  if (DB_ENABLED && prisma) {
    try {
      const [verified, artefacts, listings, rfps, cohorts] = await Promise.all([
        prisma.entrepreneurProfile.count({ where: { verified: true } }),
        prisma.artefact.count({ where: { status: "VALIDATED" } }),
        prisma.listing.count({ where: { status: "PUBLISHED" } }),
        prisma.rfp.count({ where: { status: "OPEN" } }),
        prisma.cohort.count(),
      ]);
      metrics.push(
        { label: "Verified entrepreneurs", value: verified, hint: "Live count" },
        { label: "Validated artefacts", value: artefacts, hint: "Tamper-evident" },
        { label: "Published listings", value: listings, hint: "Marketplace" },
        { label: "Open RFPs", value: rfps, hint: "Procurement" },
        { label: "Cohorts", value: cohorts, hint: "Programmes" },
      );
    } catch {
      // swallow — fall through to placeholder
    }
  }

  if (metrics.length === 0) {
    metrics.push(
      { label: "Verified entrepreneurs", value: "0", hint: "Pre-launch" },
      { label: "Validated artefacts", value: "0", hint: "Pre-launch" },
      { label: "Published listings", value: "0", hint: "Pre-launch" },
      { label: "Open RFPs", value: "0", hint: "Pre-launch" },
      { label: "Cohorts", value: "0", hint: "Pre-launch" },
    );
  }

  return (
    <section
      aria-label="Live MarketBridge metrics"
      className="border-y border-cream-200 bg-white"
    >
      <div className="container-edge max-w-6xl py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-700">
            Live from MarketBridge
            <span className="ml-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-forest-600 align-middle" />
          </p>
          <Link
            href="/impact/report"
            className="text-[11px] font-medium text-forest-800 hover:text-gold-700"
          >
            Open the full impact report →
          </Link>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
          {metrics.map((m) => (
            <li
              key={m.label}
              className="rounded-xl border border-cream-200 bg-cream-50/60 p-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-500">
                {m.label}
              </p>
              <p className="mt-1 font-serif text-2xl text-forest-900">{m.value}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-gold-700">{m.hint}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
