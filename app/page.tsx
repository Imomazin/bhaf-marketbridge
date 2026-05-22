import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EntrepreneurCard } from "@/components/cards/EntrepreneurCard";
import { ImpactMetricCard } from "@/components/cards/ImpactMetricCard";
import { entrepreneurs } from "@/data/entrepreneurs";
import { impactMetrics } from "@/data/impact";

const problemPoints = [
  {
    title: "Invisible to capital",
    body: "Women-led African businesses receive less than 7 percent of venture and grant capital flowing into the continent, despite strong unit economics.",
  },
  {
    title: "Undocumented impact",
    body: "Most entrepreneurs are already practising ESG and circular economy, but lack the documentation funders and corporates require.",
  },
  {
    title: "Locked out of supply chains",
    body: "Corporate procurement, export markets and donor pipelines rarely reach women entrepreneurs because verified, structured profiles do not exist.",
  },
];

const modules = [
  { title: "Entrepreneur Directory", body: "Structured, searchable profiles with sector, country and readiness signals." },
  { title: "Marketplace", body: "Listings for products and services with enquiry routing to verified buyers." },
  { title: "Funding Readiness Hub", body: "Assessments, document vault and guided readiness pathways." },
  { title: "ESG & Impact Toolkit", body: "Self-reporting framework aligned to funder and corporate ESG standards." },
  { title: "Training & Certification", body: "Certification pathways delivered through BHAF SkillHubs." },
  { title: "Corporate & Donor Portal", body: "Discovery, shortlisting and impact reporting for partners." },
  { title: "Case Study Repository", body: "Donor-facing evidence and storytelling generated from live platform data." },
  { title: "Admin Dashboard", body: "BHAF moderation, approvals, opportunity publishing and impact oversight." },
];

const howItWorks = [
  { step: "01", title: "Register", body: "Entrepreneurs create an account and select their sector and country." },
  { step: "02", title: "Create profile", body: "Structured profile with business details, products and verification documents." },
  { step: "03", title: "Document ESG", body: "Capture environmental, social and governance activity using guided forms." },
  { step: "04", title: "List products", body: "Publish marketplace listings for buyers, corporates and partners." },
  { step: "05", title: "Readiness check", body: "Complete the readiness checklist to unlock visibility tiers." },
  { step: "06", title: "Get discovered", body: "Become visible to funders, donors, buyers and corporate procurement." },
];

export default function HomePage() {
  const featured = entrepreneurs.slice(0, 3);
  const heroMetrics = impactMetrics.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-900 text-cream-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 10%, rgba(212, 167, 58, 0.35), transparent 35%), radial-gradient(circle at 85% 80%, rgba(143, 182, 161, 0.18), transparent 45%)",
          }}
        />
        <div className="container-edge relative grid gap-14 py-20 md:grid-cols-[1.1fr_1fr] md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-gold-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gold-200">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
              Build Her A Future · MarketBridge MVP
            </span>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] text-cream-50 md:text-6xl">
              Where African women entrepreneurs become{" "}
              <span className="text-gold-300">visible</span>,{" "}
              <span className="text-gold-300">fundable</span> and{" "}
              <span className="text-gold-300">market-ready</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/80 md:text-lg">
              MarketBridge is the marketplace and impact infrastructure platform connecting verified women-led
              enterprises with funders, corporate buyers and global market access.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="#register" className="btn-gold">
                Register as an entrepreneur
              </Link>
              <Link
                href="#funders"
                className="inline-flex items-center justify-center rounded-md border border-cream-50/30 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-cream-50/60"
              >
                Partner with BHAF
              </Link>
            </div>
          </div>

          <div className="grid gap-4 self-end">
            {heroMetrics.map((metric, idx) => (
              <ImpactMetricCard key={metric.id} metric={metric} emphasis={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-cream-200 bg-cream-50 py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="The problem"
            title="African women entrepreneurs are building exceptional businesses — and still being overlooked."
            description="Capital, procurement and ESG opportunities exist in abundance. What is missing is the infrastructure to make women-led businesses visible, verified and ready."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {problemPoints.map((p) => (
              <div key={p.title} className="card p-7">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold-100 font-serif text-base text-gold-800">
                  ↗
                </span>
                <h3 className="mt-4 font-serif text-lg text-forest-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform solution */}
      <section className="bg-white py-24">
        <div className="container-edge grid items-center gap-14 md:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="The platform"
              title="One platform. Five strategic sectors. Real visibility for women entrepreneurs."
              description="MarketBridge is a hybrid social enterprise platform supporting circular economy, enterprise industry, governance, funding readiness and generative solutions across Africa."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Structured profiles that meet donor and corporate ESG requirements",
                "Marketplace listings with enquiry routing to verified buyers",
                "Funding readiness assessments and curated opportunity matching",
                "Impact reporting framework aligned to global standards",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-charcoal-600">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="card relative overflow-hidden p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 0%, rgba(212, 167, 58, 0.18), transparent 40%), radial-gradient(circle at 100% 100%, rgba(11, 40, 32, 0.08), transparent 40%)",
              }}
            />
            <div className="relative">
              <p className="eyebrow">Platform snapshot</p>
              <h3 className="mt-2 font-serif text-xl text-forest-900">Entrepreneur profile</h3>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 font-serif text-cream-50">
                  AO
                </div>
                <div>
                  <p className="font-serif text-base text-forest-900">Amara Okafor</p>
                  <p className="text-xs text-charcoal-400">GreenWeave Textiles · Lagos, Nigeria</p>
                </div>
                <span className="ml-auto chip-gold">Funding-Ready</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Women supported", value: "84" },
                  { label: "Jobs created", value: "31" },
                  { label: "Funding need", value: "$120k" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-cream-200 bg-cream-50 px-3 py-3">
                    <p className="font-serif text-lg text-forest-900">{item.value}</p>
                    <p className="text-[10px] uppercase tracking-wide text-charcoal-400">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 text-xs">
                {[
                  ["Business profile", "Complete"],
                  ["ESG documentation", "Complete"],
                  ["Funding readiness", "Complete"],
                  ["Market access", "In review"],
                ].map(([label, status]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-charcoal-500">{label}</span>
                    <span
                      className={
                        status === "Complete"
                          ? "rounded-full bg-forest-50 px-2 py-0.5 font-medium text-forest-800"
                          : "rounded-full bg-gold-50 px-2 py-0.5 font-medium text-gold-800"
                      }
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream-50 py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="How it works"
            title="A clear path from registration to global visibility."
            description="The MarketBridge journey turns an entrepreneur's existing impact into structured, fundable, market-ready evidence."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {howItWorks.map((step) => (
              <div key={step.step} className="card flex h-full flex-col p-7">
                <span className="font-serif text-3xl text-gold-500">{step.step}</span>
                <h3 className="mt-3 font-serif text-lg text-forest-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key modules */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Key modules"
            title="Everything an entrepreneur, funder or partner needs in one platform."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((m) => (
              <div key={m.title} className="card h-full p-5">
                <h3 className="font-serif text-base text-forest-900">{m.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-charcoal-500">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured entrepreneurs */}
      <section className="bg-cream-50 py-24">
        <div className="container-edge">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Featured entrepreneurs"
              title="Verified women-led businesses ready for buyers, funders and partners."
            />
            <Link href="/entrepreneurs" className="btn-secondary">
              View directory
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((e) => (
              <EntrepreneurCard key={e.id} entrepreneur={e} />
            ))}
          </div>
        </div>
      </section>

      {/* Funding & partner */}
      <section id="funders" className="bg-forest-900 py-24 text-cream-50">
        <div className="container-edge grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeader
              eyebrow="Funders & partners"
              title="A trusted pipeline of verified, ready-to-deploy women-led businesses."
              description="Donors, impact investors, corporate buyers and ESG procurement teams can shortlist verified entrepreneurs aligned to their mandates and reporting needs."
              tone="dark"
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/opportunities" className="btn-gold">
                Browse opportunities
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-md border border-cream-50/30 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-cream-50/70"
              >
                Talk to BHAF partnerships
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Pre-vetted businesses", value: "165+", caption: "Across 11 countries" },
              { label: "Active opportunities", value: "24", caption: "Grants, deals and procurement" },
              { label: "ESG reporting cohorts", value: "9", caption: "Live this cycle" },
              { label: "Corporate partners", value: "18", caption: "Across FMCG, energy and tech" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-cream-50/15 bg-cream-50/5 p-5 backdrop-blur"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold-300">{stat.label}</p>
                <p className="mt-3 font-serif text-3xl text-cream-50">{stat.value}</p>
                <p className="mt-1 text-xs text-cream-100/70">{stat.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact reporting */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Impact reporting"
            title="Real numbers. Real evidence. Real accountability."
            description="MarketBridge captures live impact data across women supported, jobs created, ESG outcomes and funding mobilised — turning activity into donor-grade reporting."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {impactMetrics.slice(0, 6).map((m) => (
              <ImpactMetricCard key={m.id} metric={m} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="register" className="bg-cream-100 py-24">
        <div className="container-edge">
          <div className="card relative overflow-hidden p-10 md:p-14">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 0% 0%, rgba(212, 167, 58, 0.22), transparent 35%), radial-gradient(circle at 100% 100%, rgba(36, 70, 56, 0.18), transparent 40%)",
              }}
            />
            <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="eyebrow">Join MarketBridge</p>
                <h2 className="mt-3 font-serif text-3xl text-forest-900 md:text-4xl">
                  Bring your business to the platform built for African women entrepreneurs.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal-500">
                  Register, build your profile, document your impact and become visible to the funders, buyers and
                  partners shaping the next decade of African enterprise.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="#" className="btn-primary">
                  Register as an entrepreneur
                </Link>
                <Link href="#funders" className="btn-gold">
                  Register as a partner
                </Link>
                <Link href="/admin" className="btn-secondary">
                  BHAF administrator sign-in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
