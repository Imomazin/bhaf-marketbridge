import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { impactMetrics, sectorImpact } from "@/data/impact";
import { FUNDER_REPORT_TEMPLATES, isSeededFunderAccount } from "@/lib/funderPortal";
import { getFunderNav } from "@/lib/portalNav";

export const metadata = { title: "Impact reports · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function FunderImpactPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in?next=/portal/funder/impact");

  const seeded = isSeededFunderAccount(session.user.id);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <PortalSidebar currentRole="funder" nav={getFunderNav("/portal/funder/impact")} />

      <section className="flex-1 bg-cream-50 py-12 md:py-16">
        <div className="container-edge lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Impact reporting</p>
              <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">Impact reports</h1>
              <p className="mt-2 max-w-2xl text-sm text-charcoal-500">
                This is where a funder turns platform activity into donor-facing, board-ready and partner-friendly
                reporting.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/impact" className="btn-secondary !px-3 !py-2 text-xs">
                Open public impact page
              </Link>
              <Link href="/directory" className="btn-primary !px-3 !py-2 text-xs">
                View live ventures
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Report status",
                value: seeded ? "Live" : "Template-ready",
                caption: seeded ? "Seeded demo account has example reporting data" : "Templates are ready once your pipeline matures",
              },
              {
                label: "Board packs",
                value: "3",
                caption: "Quarterly, donor and programme views",
              },
              {
                label: "Data source",
                value: "Live",
                caption: "Pulled from profiles, artefacts and impact activity",
              },
            ].map((item, index) => (
              <article
                key={item.label}
                className={
                  index === 0
                    ? "rounded-2xl border border-forest-200 bg-forest-50 p-5"
                    : "rounded-2xl border border-cream-200 bg-white p-5 shadow-card"
                }
              >
                <p className="text-[11px] uppercase tracking-wide text-charcoal-500">{item.label}</p>
                <p className="mt-3 font-serif text-3xl text-forest-900">{item.value}</p>
                <p className="mt-1 text-xs text-charcoal-500">{item.caption}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {FUNDER_REPORT_TEMPLATES.map((template) => (
              <article key={template.id} className="card p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">{template.audience}</p>
                <h2 className="mt-2 font-serif text-2xl text-forest-900">{template.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{template.summary}</p>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-2xl text-forest-900">Network metrics visible in reporting</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {impactMetrics.map((metric) => (
                <article key={metric.id} className="card p-5">
                  <p className="text-[11px] uppercase tracking-wide text-charcoal-400">{metric.label}</p>
                  <p className="mt-2 font-serif text-3xl text-forest-900">{metric.value}</p>
                  <p className="mt-2 text-sm text-charcoal-600">{metric.caption}</p>
                  <p className="mt-2 text-xs text-gold-800">{metric.trend}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="card mt-8 p-6">
            <h2 className="font-serif text-2xl text-forest-900">Sector breakdown</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200 text-left text-[11px] uppercase tracking-wide text-charcoal-400">
                    <th className="pb-3 pr-4 font-semibold">Sector</th>
                    <th className="pb-3 pr-4 font-semibold">Entrepreneurs</th>
                    <th className="pb-3 pr-4 font-semibold">Women supported</th>
                    <th className="pb-3 font-semibold">Funding mobilised</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorImpact.map((row) => (
                    <tr key={row.sector} className="border-b border-cream-100 text-charcoal-600">
                      <td className="py-3 pr-4 font-medium text-forest-900">{row.sector}</td>
                      <td className="py-3 pr-4">{row.entrepreneurs}</td>
                      <td className="py-3 pr-4">{row.womenSupported}</td>
                      <td className="py-3">{row.fundingMobilised}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
