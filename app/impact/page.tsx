import { SectionHeader } from "@/components/ui/SectionHeader";
import { ImpactMetricCard } from "@/components/cards/ImpactMetricCard";
import { impactMetrics, sectorImpact } from "@/data/impact";

const esgPillars = [
  {
    title: "Environmental",
    body: "Waste diverted, emissions avoided, renewable energy adoption and circular sourcing practices reported by entrepreneurs.",
    items: ["84 t waste diverted", "612 t CO₂ avoided", "9 verified circular practices"],
  },
  {
    title: "Social",
    body: "Women supported, jobs created, fair-trade and community impact across the BHAF entrepreneur network.",
    items: ["1,782 women supported", "140 jobs created", "11 countries reached"],
  },
  {
    title: "Governance",
    body: "Verified ownership, transparent reporting and ethical operating practices documented through MarketBridge.",
    items: ["165 verified profiles", "317 certifications issued", "24 audited funding deals"],
  },
];

export default function ImpactPage() {
  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Impact & ESG"
            title="Donor-grade impact reporting, built from live entrepreneur activity."
            description="MarketBridge aggregates entrepreneur ESG self-reporting into a transparent, verifiable view of the BHAF network's outcomes."
          />
        </div>
      </section>

      <section className="bg-cream-50 py-16">
        <div className="container-edge">
          <div className="grid gap-5 md:grid-cols-3">
            {impactMetrics.map((m, idx) => (
              <ImpactMetricCard key={m.id} metric={m} emphasis={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-edge">
          <SectionHeader
            eyebrow="ESG framework"
            title="Three pillars. One reporting standard."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {esgPillars.map((p) => (
              <div key={p.title} className="card flex h-full flex-col p-7">
                <p className="eyebrow">{p.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{p.body}</p>
                <ul className="mt-5 space-y-2 border-t border-cream-200 pt-4">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-forest-900">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-20">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Sector breakdown"
            title="Impact across BHAF's five strategic sectors."
          />
          <div className="card mt-10 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-200 bg-cream-100/60 text-[11px] uppercase tracking-wide text-charcoal-500">
                  <th className="px-6 py-4 font-semibold">Sector</th>
                  <th className="px-6 py-4 font-semibold">Entrepreneurs</th>
                  <th className="px-6 py-4 font-semibold">Women supported</th>
                  <th className="px-6 py-4 font-semibold">Funding mobilised</th>
                </tr>
              </thead>
              <tbody>
                {sectorImpact.map((row) => (
                  <tr key={row.sector} className="border-b border-cream-100 last:border-0">
                    <td className="px-6 py-4 font-medium text-forest-900">{row.sector}</td>
                    <td className="px-6 py-4 text-charcoal-600">{row.entrepreneurs}</td>
                    <td className="px-6 py-4 text-charcoal-600">{row.womenSupported}</td>
                    <td className="px-6 py-4 text-charcoal-600">{row.fundingMobilised}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
