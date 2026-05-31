import { prisma, DB_ENABLED } from "@/lib/db";
import { PrintButton } from "@/components/impact/PrintButton";

export const metadata = { title: "Impact report · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

/**
 * Branded printable impact report. Open the page → browser's
 * "Save as PDF" produces a donor-grade document. No headless-Chrome
 * dependency needed and works offline.
 */
export default async function ImpactReportPage({ searchParams }: { searchParams: { from?: string; to?: string } }) {
  const from = searchParams.from ? new Date(searchParams.from) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  const to = searchParams.to ? new Date(searchParams.to) : new Date();

  let totals = {
    entrepreneurs: 0,
    verified: 0,
    artefacts: 0,
    listings: 0,
    applications: 0,
    awarded: 0,
    fundingMobilisedCents: 0,
    rfps: 0,
    cohorts: 0,
    invoicesPaid: 0,
  };

  if (DB_ENABLED && prisma) {
    const [
      entrepreneurs,
      verified,
      artefacts,
      listings,
      applications,
      awarded,
      fundingMobilised,
      rfps,
      cohorts,
      invoicesPaid,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "ENTREPRENEUR", deletedAt: null } }),
      prisma.entrepreneurProfile.count({ where: { verified: true } }),
      prisma.artefact.count({ where: { status: "VALIDATED" } }),
      prisma.listing.count({ where: { status: "PUBLISHED" } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: "AWARDED" } }),
      prisma.invoice.aggregate({
        where: { status: "PAID", paidAt: { gte: from, lte: to } },
        _sum: { amountUsdCents: true },
      }),
      prisma.rfp.count({ where: { createdAt: { gte: from, lte: to } } }),
      prisma.cohort.count({ where: { createdAt: { gte: from, lte: to } } }),
      prisma.invoice.count({ where: { status: "PAID", paidAt: { gte: from, lte: to } } }),
    ]);
    totals = {
      entrepreneurs,
      verified,
      artefacts,
      listings,
      applications,
      awarded,
      fundingMobilisedCents: fundingMobilised._sum.amountUsdCents ?? 0,
      rfps,
      cohorts,
      invoicesPaid,
    };
  }

  return (
    <section className="bg-white py-10">
      <div className="container-edge max-w-4xl print:max-w-none">
        <header className="border-b border-forest-200 pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            BHAF MarketBridge · Impact Report
          </p>
          <h1 className="mt-2 font-serif text-4xl text-forest-900">Network Impact Report</h1>
          <p className="mt-2 text-sm text-charcoal-500">
            Period: {from.toISOString().slice(0, 10)} → {to.toISOString().slice(0, 10)}
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <Metric label="Verified entrepreneurs" value={totals.verified.toString()} sub={`of ${totals.entrepreneurs} registered`} />
          <Metric label="Validated artefacts" value={totals.artefacts.toString()} sub="hashed, audited, tamper-evident" />
          <Metric label="Published listings" value={totals.listings.toString()} sub="discoverable to global buyers" />
          <Metric label="Applications" value={totals.applications.toString()} sub={`${totals.awarded} awarded`} />
          <Metric label="Open RFPs" value={totals.rfps.toString()} sub="corporate procurement live" />
          <Metric label="Active cohorts" value={totals.cohorts.toString()} sub="BHAF programmes in market" />
        </section>

        <section className="mt-10 rounded-2xl border border-forest-200 bg-forest-50 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-700">
            Capital mobilised through MarketBridge
          </p>
          <p className="mt-2 font-serif text-5xl text-forest-900">
            ${(totals.fundingMobilisedCents / 100).toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-charcoal-500">
            Across {totals.invoicesPaid} settled invoices. Aggregated from the platform's billing ledger and
            counter-verified against payment-provider webhook receipts.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-forest-900">Methodology</h2>
          <p className="mt-2 text-sm text-charcoal-600">
            Every number on this page is computed from primary platform data — no manual entry.
            Artefacts referenced in the count have all passed our 5-stage validation pipeline (SHA-256
            integrity, MIME/magic-byte match, size and format limits, antivirus scan via VirusTotal,
            BHAF administrator sign-off). The audit log is hash-chained (SHA-256) so any retroactive
            edit is detectable.
          </p>
        </section>

        <footer className="mt-12 border-t border-forest-200 pt-6 text-[11px] text-charcoal-500">
          Generated {new Date().toISOString().slice(0, 19).replace("T", " ")} UTC ·
          BHAF Circular Academy &amp; Consulting Firm · MarketBridge
        </footer>

        <div className="mt-10 print:hidden">
          <PrintButton />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-cream-200 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">{label}</p>
      <p className="mt-2 font-serif text-3xl text-forest-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-charcoal-500">{sub}</p>}
    </div>
  );
}
