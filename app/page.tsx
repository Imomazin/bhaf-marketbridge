import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnnotatedPhoto } from "@/components/ui/AnnotatedPhoto";
import { EntrepreneurCard } from "@/components/cards/EntrepreneurCard";
import { ImpactMetricCard } from "@/components/cards/ImpactMetricCard";
import { entrepreneurs } from "@/data/entrepreneurs";
import { impactMetrics } from "@/data/impact";
import { bhafPartners, photos } from "@/data/photos";

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
      {/* HERO — Abuja Accelerator alongside the headline */}
      <section className="relative overflow-hidden bg-forest-900 text-cream-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 8% 10%, rgba(212, 167, 58, 0.35), transparent 38%), radial-gradient(circle at 92% 85%, rgba(143, 182, 161, 0.18), transparent 45%)",
          }}
        />
        <div className="container-edge relative grid items-center gap-14 py-16 md:grid-cols-[1.05fr_1fr] md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/40 bg-gold-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gold-200">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
              Build Her A Future · MarketBridge
            </span>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] text-cream-50 md:text-6xl">
              Where African women entrepreneurs become{" "}
              <span className="text-gold-300">visible</span>,{" "}
              <span className="text-gold-300">fundable</span> and{" "}
              <span className="text-gold-300">market-ready</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/85 md:text-lg">
              MarketBridge is the marketplace and impact infrastructure platform connecting verified women-led
              enterprises with funders, corporate buyers and global market access — built by BHAF Circular
              Academy &amp; Consulting Firm.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="#register" className="btn-gold">
                Register as an entrepreneur
              </Link>
              <Link
                href="#funders"
                className="inline-flex items-center justify-center rounded-md border border-cream-50/30 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-cream-50/70"
              >
                Partner with BHAF
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-cream-50/15 pt-6">
              {heroMetrics.map((m) => (
                <div key={m.id}>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-gold-300">{m.label}</dt>
                  <dd className="mt-1 font-serif text-2xl text-cream-50">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <AnnotatedPhoto
              photo={photos.abuja1}
              aspect="portrait"
              priority
              tag="Live · Abuja Accelerator"
              caption="Cohort 1 — readiness training for women-led businesses in Nigeria."
              className="shadow-soft"
            />
            <div className="absolute -bottom-6 -left-6 hidden w-44 rotate-[-4deg] sm:block">
              <AnnotatedPhoto
                photo={photos.nyc1}
                aspect="square"
                caption={null}
                tag="NYC Launch"
                rounded="xl"
              />
            </div>
            <div className="absolute -right-4 -top-6 hidden w-36 rotate-[5deg] sm:block">
              <AnnotatedPhoto
                photo={photos.ihs1}
                aspect="portrait"
                caption={null}
                tag="Dublin"
                rounded="xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM — side photo from field visit */}
      <section className="border-b border-cream-200 bg-cream-50 py-24">
        <div className="container-edge grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
          <div className="md:sticky md:top-24">
            <AnnotatedPhoto
              photo={photos.baloni1}
              aspect="portrait"
              tag="Baloni Farm Visit"
              caption="Entrepreneurs already running circular and ESG-aligned businesses — but rarely with the documentation buyers and funders demand."
            />
          </div>
          <div>
            <SectionHeader
              eyebrow="The problem"
              title="African women entrepreneurs are building exceptional businesses — and still being overlooked."
              description="Capital, procurement and ESG opportunities exist in abundance. What is missing is the infrastructure to make women-led businesses visible, verified and ready."
            />
            <div className="mt-10 space-y-4">
              {problemPoints.map((p) => (
                <div key={p.title} className="card p-6">
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-gold-100 font-serif text-base text-gold-800">
                      ↗
                    </span>
                    <div>
                      <h3 className="font-serif text-lg text-forest-900">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal-500">{p.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM SOLUTION — DRC training image alongside */}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <AnnotatedPhoto
              photo={photos.drc1}
              aspect="portrait"
              tag="Kinshasa"
              caption="FEMEC RDC launch — circular economy network for women entrepreneurs."
            />
            <div className="space-y-4 sm:pt-12">
              <AnnotatedPhoto
                photo={photos.abuja12}
                aspect="square"
                tag="Abuja"
                caption="Keynote at the Abuja Accelerator launch."
              />
              <AnnotatedPhoto
                photo={photos.drc5}
                aspect="square"
                tag="Certified"
                caption="DRC cohort with completion certificates."
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 6 steps */}
      <section className="relative overflow-hidden bg-cream-50 py-24">
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

      {/* KEY MODULES + accent photo */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Key modules"
            title="Everything an entrepreneur, funder or partner needs in one platform."
          />
          <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map((m) => (
                <div key={m.title} className="card h-full p-5">
                  <h3 className="font-serif text-base text-forest-900">{m.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal-500">{m.body}</p>
                </div>
              ))}
            </div>
            <AnnotatedPhoto
              photo={photos.abuja4}
              aspect="auto"
              tag="Abuja Accelerator"
              caption="Panel of cohort founders — every module on MarketBridge maps to a step in their journey."
              className="h-full"
            />
          </div>
        </div>
      </section>

      {/* BHAF IN ACTION — new gallery section spreading photos across the build */}
      <section className="bg-forest-50 py-24">
        <div className="container-edge">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="BHAF in action"
              title="Real cohorts. Real cities. Real momentum."
              description="From Abuja to Kinshasa to Dublin and New York — BHAF is already convening, training and connecting the women entrepreneurs MarketBridge brings online."
            />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:grid-rows-2">
            <AnnotatedPhoto
              photo={photos.nyc1}
              aspect="auto"
              className="col-span-2 row-span-2 h-full min-h-[280px] lg:col-span-3"
              tag="New York"
              caption="BHAF global launch — convened with IPWRA at the United Nations."
            />
            <AnnotatedPhoto
              photo={photos.abuja7}
              aspect="auto"
              className="col-span-2 h-full min-h-[180px] lg:col-span-2"
              tag="Abuja"
              caption="Cohort 1 group portrait."
            />
            <AnnotatedPhoto
              photo={photos.ihs1}
              aspect="auto"
              className="h-full min-h-[180px]"
              tag="Dublin"
              caption="InvestHer Summit."
            />
            <AnnotatedPhoto
              photo={photos.drc1}
              aspect="auto"
              className="h-full min-h-[180px]"
              tag="Kinshasa"
              caption="FEMEC RDC launch."
            />
            <AnnotatedPhoto
              photo={photos.baloni3}
              aspect="auto"
              className="col-span-2 h-full min-h-[180px]"
              tag="Baloni Farm"
              caption="Live ESG and circular economy site visit."
            />
            <AnnotatedPhoto
              photo={photos.abuja4}
              aspect="auto"
              className="h-full min-h-[180px]"
              tag="Panel"
              caption="Founder voices on the Abuja stage."
            />
            <AnnotatedPhoto
              photo={photos.drc5}
              aspect="auto"
              className="h-full min-h-[180px]"
              tag="Certified"
              caption="DRC cohort graduates."
            />
          </div>
        </div>
      </section>

      {/* FEATURED ENTREPRENEURS */}
      <section className="bg-cream-50 py-24">
        <div className="container-edge">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow="Featured entrepreneurs"
              title="Verified women-led businesses ready for buyers, funders and partners."
            />
            <Link href="/directory" className="btn-secondary">
              View directory
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((e) => (
              <EntrepreneurCard key={e.id} entrepreneur={e} />
            ))}
          </div>
          <p className="mt-6 text-xs text-charcoal-400">
            Sample profiles used to illustrate the MVP. Real entrepreneur profiles will surface here once the
            directory is live.
          </p>
        </div>
      </section>

      {/* FUNDERS & PARTNERS */}
      <section id="funders" className="bg-forest-900 py-24 text-cream-50">
        <div className="container-edge grid gap-12 md:grid-cols-[1.05fr_1fr] md:items-center">
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

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Pre-vetted businesses", value: "165+", caption: "Across 11 countries" },
                { label: "Active opportunities", value: "24", caption: "Grants, deals and procurement" },
                { label: "ESG reporting cohorts", value: "9", caption: "Live this cycle" },
                { label: "Corporate partners", value: "18", caption: "FMCG, energy, tech" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-cream-50/15 bg-cream-50/5 p-4 backdrop-blur"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gold-300">{stat.label}</p>
                  <p className="mt-2 font-serif text-2xl text-cream-50">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-cream-100/70">{stat.caption}</p>
                </div>
              ))}
            </div>
          </div>

          <figure className="overflow-hidden rounded-2xl bg-white p-4 shadow-soft">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={bhafPartners.src}
                alt={bhafPartners.alt}
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-3 px-2 pb-1 text-center text-[11px] uppercase tracking-[0.16em] text-charcoal-500">
              Growth through partnerships · Our evolution is built on partnership
            </figcaption>
          </figure>
        </div>
      </section>

      {/* IMPACT */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Impact reporting"
            title="Real numbers. Real evidence. Real accountability."
            description="MarketBridge captures live impact data across women supported, jobs created, ESG outcomes and funding mobilised — turning activity into donor-grade reporting."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <AnnotatedPhoto
              photo={photos.ihs1}
              aspect="auto"
              className="h-full min-h-[360px]"
              tag="InvestHer Summit · Dublin"
              caption="Where MarketBridge data meets global capital — networking and marketplace stage."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {impactMetrics.slice(0, 4).map((m) => (
                <ImpactMetricCard key={m.id} metric={m} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA — backed by a wide BHAF photo */}
      <section id="register" className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <Image
            src={photos.abuja7.src}
            alt={photos.abuja7.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900/95 via-forest-900/85 to-forest-800/80" />
        </div>
        <div className="container-edge relative">
          <div className="mx-auto max-w-3xl text-center text-cream-50">
            <p className="eyebrow text-gold-300">Join MarketBridge</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">
              Bring your business to the platform built for African women entrepreneurs.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-cream-100/85 md:text-lg">
              Register, build your profile, document your impact and become visible to the funders, buyers and
              partners shaping the next decade of African enterprise.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="#" className="btn-gold">
                Register as an entrepreneur
              </Link>
              <Link
                href="#funders"
                className="inline-flex items-center justify-center rounded-md border border-cream-50/40 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-cream-50/80"
              >
                Register as a partner
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-md bg-cream-50 px-5 py-3 text-sm font-medium text-forest-900 transition hover:bg-cream-100"
              >
                BHAF administrator sign-in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
