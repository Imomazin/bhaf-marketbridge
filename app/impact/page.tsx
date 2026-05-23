import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHero } from "@/components/ui/PageHero";
import { AnnotatedPhoto } from "@/components/ui/AnnotatedPhoto";
import { ImpactMetricCard } from "@/components/cards/ImpactMetricCard";
import { impactMetrics, sectorImpact } from "@/data/impact";
import { photos } from "@/data/photos";

const esgPillars = [
  {
    title: "Environmental",
    body: "Waste diverted, emissions avoided, renewable energy adoption and circular sourcing practices reported by entrepreneurs.",
    items: ["84 t waste diverted", "612 t CO₂ avoided", "9 verified circular practices"],
    photo: photos.baloni4,
    caption: "Circular sourcing in action — Baloni Farm visit.",
  },
  {
    title: "Social",
    body: "Women supported, jobs created, fair-trade and community impact across the BHAF entrepreneur network.",
    items: ["1,782 women supported", "140 jobs created", "11 countries reached"],
    photo: photos.abuja1,
    caption: "Cohort training in session — Abuja Accelerator.",
  },
  {
    title: "Governance",
    body: "Verified ownership, transparent reporting and ethical operating practices documented through MarketBridge.",
    items: ["165 verified profiles", "317 certifications issued", "24 audited funding deals"],
    photo: photos.drc5,
    caption: "Certification ceremony — DRC training cohort.",
  },
];

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact & ESG"
        title="Donor-grade impact reporting, built from live entrepreneur activity."
        description="MarketBridge aggregates entrepreneur ESG self-reporting into a transparent, verifiable view of the BHAF network's outcomes."
        photo={photos.nyc1}
        caption="BHAF global launch in New York — a movement turning local impact into globally legible evidence."
      />

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
          <SectionHeader eyebrow="ESG framework" title="Three pillars. One reporting standard." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {esgPillars.map((p) => (
              <div key={p.title} className="card flex h-full flex-col overflow-hidden">
                <AnnotatedPhoto
                  photo={p.photo}
                  aspect="video"
                  caption={p.caption}
                  rounded="lg"
                  className="rounded-b-none"
                />
                <div className="flex flex-1 flex-col p-7">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 py-20">
        <div className="container-edge">
          <SectionHeader eyebrow="Sector breakdown" title="Impact across BHAF's five strategic sectors." />
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

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <AnnotatedPhoto
              photo={photos.ihs2}
              tag="Dublin"
              caption="InvestHer Summit — bringing impact data to global capital."
              aspect="auto"
              className="min-h-[260px]"
            />
            <AnnotatedPhoto
              photo={photos.abuja12}
              tag="Abuja"
              caption="Keynote at the Abuja Accelerator launch — programme-level evidence for funders."
              aspect="auto"
              className="min-h-[260px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
