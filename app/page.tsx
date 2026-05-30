import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ImpactMetricCard } from "@/components/cards/ImpactMetricCard";
import { HeroPhotoCarousel, type HeroSlide } from "@/components/ui/HeroPhotoCarousel";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { MarqueePartners } from "@/components/ui/MarqueePartners";
import { PhotoCarousel, type PhotoSlide } from "@/components/ui/PhotoCarousel";
import { EntrepreneurCarousel } from "@/components/ui/EntrepreneurCarousel";
import { AnimatedBars, type BarRow } from "@/components/ui/AnimatedBars";
import { RoleFlowTabs } from "@/components/sections/RoleFlowTabs";
import { entrepreneurs } from "@/data/entrepreneurs";
import { impactMetrics } from "@/data/impact";
import { sectorImpact } from "@/data/impact";
import { roles, accentClasses } from "@/data/roles";
import { bhafPartners, photos } from "@/data/photos";
import { cn } from "@/lib/utils";

// Photo discipline: each image is used in exactly ONE place across the
// landing page. Hero gets the 4 signature shots; the gallery carousel and
// the platform-section image draw from the rest of the library.
const heroSlides: HeroSlide[] = [
  { photo: photos.abuja1, location: "Abuja", event: "Accelerator Cohort 1 in session" },
  { photo: photos.nyc1, location: "New York", event: "BHAF Global Launch at the UN" },
  { photo: photos.ihs1, location: "Dublin", event: "InvestHer Summit marketplace stage" },
  { photo: photos.drc1, location: "Kinshasa", event: "FEMEC RDC circular economy training" },
];

const gallerySlides: PhotoSlide[] = [
  {
    photo: photos.abuja7,
    location: "Abuja",
    event: "Accelerator Cohort 1",
    caption: "Cohort 1 group portrait — the founders carrying BHAF's first wave.",
  },
  {
    photo: photos.abuja11,
    location: "Abuja",
    event: "Founder discussion",
    caption: "Discussion circles that translate ambition into next steps.",
  },
  {
    photo: photos.baloni1,
    location: "Baloni Farm",
    event: "Field visit",
    caption: "Entrepreneurs touring a working circular-economy site.",
  },
  {
    photo: photos.baloni3,
    location: "Baloni Farm",
    event: "Product showcase",
    caption: "Real goods, real producers, real provenance.",
  },
  {
    photo: photos.drc2,
    location: "Kinshasa",
    event: "FEMEC training",
    caption: "Collaborative session inside the DRC training cohort.",
  },
  {
    photo: photos.drc5,
    location: "Kinshasa",
    event: "Certification ceremony",
    caption: "DRC cohort graduates with completion certificates.",
  },
  {
    photo: photos.nyc3,
    location: "New York",
    event: "Panel · BHAF Launch",
    caption: "Leadership conversation at the BHAF NYC Launch.",
  },
  {
    photo: photos.ihs2,
    location: "Dublin",
    event: "InvestHer Summit",
    caption: "Global investor connections on the marketplace stage.",
  },
];

const sectorBars: BarRow[] = sectorImpact.map((s) => ({
  label: s.sector,
  value: s.entrepreneurs,
  display: `${s.entrepreneurs} ventures · ${s.fundingMobilised}`,
  caption: `${s.womenSupported.toLocaleString()} women supported`,
}));

const heroStatsConfig = [
  { label: "Verified businesses", to: 165, suffix: "+", caption: "Across 11 African countries" },
  { label: "Women supported", to: 1782, suffix: "", caption: "Through BHAF programmes" },
  { label: "Funding mobilised", to: 3.6, prefix: "$", suffix: "M", decimals: 1, caption: "Grants, equity, procurement" },
  { label: "Active opportunities", to: 24, suffix: "", caption: "Live this cycle" },
];

const trustPartners = [
  "UN Global Compact",
  "Pour Elles",
  "Plastic Odyssey",
  "Global Invest Her",
  "Abuja Accelerator",
  "Congo Circulaire",
  "Africa Circular",
  "Federal Ministry of Women Affairs",
];

const problemPoints = [
  {
    number: "01",
    title: "Invisible to capital",
    body: "Women-led African businesses receive less than 7 percent of venture and grant capital flowing into the continent, despite strong unit economics.",
  },
  {
    number: "02",
    title: "Undocumented impact",
    body: "Most entrepreneurs already practise ESG and circular economy, but lack the documentation funders and corporates require.",
  },
  {
    number: "03",
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


export default function HomePage() {

  return (
    <>
      {/* =========================================================== */}
      {/* HERO — full-bleed CAROUSEL, animated stats, scroll reveal     */}
      {/* =========================================================== */}
      <section className="relative isolate overflow-hidden bg-forest-950">
        <HeroPhotoCarousel slides={heroSlides} />

        {/* Layered overlays — lighter so the photos shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/70 to-forest-950/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-forest-950/40" />
        {/* Bolder gold accent streak */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 78% 55%, rgba(219, 161, 40, 0.65), transparent 55%), radial-gradient(circle at 8% 12%, rgba(230, 189, 69, 0.35), transparent 38%)",
          }}
        />

        <div className="container-edge relative flex min-h-[680px] flex-col justify-end py-16 md:min-h-[760px] md:py-24">
          <div className="max-w-3xl text-cream-50">
            <Reveal from="up">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/50 bg-forest-950/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-300 animate-pulse" />
                BHAF Circular Academy · MarketBridge
              </span>
            </Reveal>

            <Reveal from="up" delayMs={120}>
              <h1 className="mt-6 font-serif text-[2.5rem] font-bold leading-[1.04] tracking-tight text-cream-50 md:text-[4rem] lg:text-[4.6rem]">
                Made by <span className="italic text-gold-300">African women</span>.
                <br className="hidden md:block" /> Verified by BHAF. Ready for the world.
              </h1>
            </Reveal>

            <Reveal from="up" delayMs={260}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-100 md:text-lg">
                MarketBridge is the verified marketplace connecting Africa's women-led businesses with the
                funders, corporate buyers and global market access they belong in.
              </p>
            </Reveal>

            <Reveal from="up" delayMs={400}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/portal/entrepreneur" className="btn-gold !px-6 !py-3.5 text-sm">
                  Register your business
                </Link>
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center rounded-md border border-cream-50/50 bg-forest-950/40 px-6 py-3.5 text-sm font-medium text-cream-50 backdrop-blur transition hover:border-cream-50 hover:bg-cream-50/10"
                >
                  Sign in
                </Link>
                <Link
                  href="#roles"
                  className="ml-2 text-sm font-medium text-cream-50 underline-offset-4 hover:text-gold-200 hover:underline"
                >
                  See how it works →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Stat strip with animated counters */}
        <div className="relative border-t border-cream-50/15 bg-forest-950/85 backdrop-blur-md">
          <dl className="container-edge grid grid-cols-2 gap-x-6 gap-y-4 py-5 md:grid-cols-4 md:py-6">
            {heroStatsConfig.map((s, idx) => (
              <div key={s.label} className={idx > 0 ? "md:border-l md:border-cream-50/10 md:pl-6" : ""}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">{s.label}</dt>
                <dd className="mt-1 font-serif text-3xl font-bold text-cream-50 md:text-4xl">
                  <AnimatedCounter
                    to={s.to}
                    prefix={s.prefix ?? ""}
                    suffix={s.suffix ?? ""}
                    decimals={s.decimals ?? 0}
                  />
                </dd>
                <dd className="mt-0.5 text-[11px] text-cream-100/70">{s.caption}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* =========================================================== */}
      {/* TRUST STRIP — partners in continuous marquee scroll           */}
      {/* =========================================================== */}
      <section className="border-b border-cream-200 bg-white">
        <div className="container-edge pt-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal-400">
            In partnership with
          </p>
        </div>
        <MarqueePartners partners={trustPartners} />
      </section>

      {/* =========================================================== */}
      {/* PROBLEM — clean 3 cards, no photos, numbered                  */}
      {/* =========================================================== */}
      <section className="bg-cream-50 py-24">
        <div className="container-edge">
          <Reveal>
            <SectionHeader
              eyebrow="The problem"
              title="African women entrepreneurs are building exceptional businesses — and still being overlooked."
              description="Capital, procurement and ESG opportunities exist in abundance. What is missing is the infrastructure to make women-led businesses visible, verified and ready."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {problemPoints.map((p, idx) => (
              <Reveal key={p.number} delayMs={idx * 120}>
                <div className="card flex h-full flex-col p-8 transition hover:-translate-y-1 hover:shadow-soft">
                  <p className="font-serif text-3xl text-gold-500">{p.number}</p>
                  <h3 className="mt-4 font-serif text-xl text-forest-900">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* PLATFORM SOLUTION — editorial pairing, ONE clean photo        */}
      {/* =========================================================== */}
      <section className="bg-white py-24">
        <div className="container-edge grid items-center gap-14 md:grid-cols-2">
          <div className="order-2 md:order-1">
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
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/directory" className="btn-primary">
                Explore the directory
              </Link>
              <Link href="/impact" className="btn-secondary">
                See the ESG framework
              </Link>
            </div>
          </div>

          <Reveal from="right" className="order-1 md:order-2">
            <figure className="relative">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
                <Image
                  src={photos.abuja4.src}
                  alt={photos.abuja4.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                    Abuja Accelerator · Cohort 1
                  </p>
                  <p className="mt-1.5 font-serif text-lg leading-snug">
                    Founder panel — every voice on this stage maps to a profile MarketBridge makes discoverable.
                  </p>
                </figcaption>
              </div>

              {/* Floating ESG snapshot card with gentle motion */}
              <div className="animate-float-soft absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-cream-200 bg-white p-4 shadow-soft md:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                  ESG snapshot
                </p>
                <div className="mt-2 space-y-1.5 text-[11px] text-charcoal-600">
                  {[
                    ["Women supported", "1,782"],
                    ["Jobs created", "140"],
                    ["CO₂ avoided", "612 t"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between">
                      <span className="text-charcoal-500">{label}</span>
                      <span className="font-serif font-semibold text-forest-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* =========================================================== */}
      {/* ROLE PICKER — 4 distinct entry paths, staggered reveal        */}
      {/* =========================================================== */}
      <section id="roles" className="bg-forest-50 py-24">
        <div className="container-edge">
          <Reveal>
            <SectionHeader
              eyebrow="Choose your role"
              title="MarketBridge works differently for each kind of partner."
              description="A workspace built for the way you actually use the platform — pick yours and continue."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((role, idx) => {
              const accent = accentClasses[role.accent];
              return (
                <Reveal key={role.id} delayMs={idx * 100}>
                  <Link
                    href={role.href}
                    className="group flex h-full flex-col rounded-2xl border border-cream-200 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft hover:ring-1 hover:ring-gold-200"
                  >
                    <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md text-cream-50 transition group-hover:scale-110", accent.bg)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <h3 className="mt-5 font-serif text-xl text-forest-900">{role.shortLabel}</h3>
                    <p className="mt-1 text-sm text-charcoal-500">{role.tagline}</p>
                    <ul className="mt-5 space-y-2 border-t border-cream-200 pt-4">
                      {role.primaryActions.slice(0, 3).map((a) => (
                        <li key={a} className="flex items-start gap-2 text-xs text-charcoal-600">
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold-500" />
                          {a}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto pt-6 text-sm font-medium text-forest-900 transition group-hover:translate-x-1 group-hover:text-gold-700">
                      {role.signInLabel} →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* YOUR JOURNEY — tabbed flow per role (1st, 2nd, 3rd...)        */}
      {/* =========================================================== */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <Reveal>
            <SectionHeader
              eyebrow="Your journey"
              title="What you do, in order — for every role on the platform."
              description="Each role has a clear sequence of moves on MarketBridge. Pick yours and see exactly what step one looks like, what comes next, and how it leads to the outcome you care about."
            />
          </Reveal>
          <Reveal delayMs={150} className="mt-12">
            <RoleFlowTabs />
          </Reveal>
        </div>
      </section>


      {/* =========================================================== */}
      {/* KEY MODULES — pure product grid                               */}
      {/* =========================================================== */}
      <section className="bg-cream-50 py-24">
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

      {/* =========================================================== */}
      {/* BHAF IN ACTION — auto-advancing horizontal photo carousel     */}
      {/* (no longer a stacked grid)                                    */}
      {/* =========================================================== */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <Reveal>
            <SectionHeader
              eyebrow="BHAF in action"
              title="Real cohorts. Real cities. Real momentum."
              description="From Abuja to Kinshasa to Dublin and New York — BHAF is already convening, training and connecting the women entrepreneurs MarketBridge brings online."
            />
          </Reveal>
          <Reveal delayMs={150} className="mt-12">
            <PhotoCarousel slides={gallerySlides} />
          </Reveal>
        </div>
      </section>

      {/* =========================================================== */}
      {/* FEATURED ENTREPRENEURS — auto-rotating carousel               */}
      {/* =========================================================== */}
      <section className="bg-cream-50 py-24">
        <div className="container-edge">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow="Featured entrepreneurs"
                title="Verified women-led businesses ready for buyers, funders and partners."
              />
              <Link href="/directory" className="btn-secondary">
                View directory
              </Link>
            </div>
          </Reveal>
          <Reveal delayMs={150} className="mt-12">
            <EntrepreneurCarousel entrepreneurs={entrepreneurs} />
          </Reveal>
          <p className="mt-6 text-center text-xs text-charcoal-400">
            Sample profiles used to illustrate the MVP. Real entrepreneur profiles will surface here once the
            directory is live.
          </p>
        </div>
      </section>

      {/* =========================================================== */}
      {/* FUNDERS & PARTNERS — editorial, partner sheet on display      */}
      {/* =========================================================== */}
      <section id="funders" className="bg-forest-900 py-24 text-cream-50">
        <div className="container-edge grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Funders & partners"
              title="A trusted pipeline of verified, ready-to-deploy women-led businesses."
              description="Donors, impact investors, corporate buyers and ESG procurement teams can shortlist verified entrepreneurs aligned to their mandates and reporting needs."
              tone="dark"
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/portal/funder" className="btn-gold">
                Funder workspace
              </Link>
              <Link href="/portal/corporate" className="inline-flex items-center justify-center rounded-md border border-cream-50/30 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-cream-50/70">
                Corporate workspace
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Pre-vetted businesses", value: "165+", caption: "Across 11 countries" },
                { label: "Active opportunities", value: "24", caption: "Grants, deals, procurement" },
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

      {/* =========================================================== */}
      {/* IMPACT — animated metric cards + sector bar chart that fills   */}
      {/* in on scroll. No photo, so no repeats.                         */}
      {/* =========================================================== */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <Reveal>
            <SectionHeader
              eyebrow="Impact reporting"
              title="Real numbers. Real evidence. Real accountability."
              description="MarketBridge captures live impact data across women supported, jobs created, ESG outcomes and funding mobilised — turning activity into donor-grade reporting."
            />
          </Reveal>

          <Reveal delayMs={120} className="mt-14">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {impactMetrics.slice(0, 4).map((m, idx) => (
                <ImpactMetricCard key={m.id} metric={m} emphasis={idx === 0} />
              ))}
            </div>
          </Reveal>

          <Reveal delayMs={200} className="mt-12">
            <div className="rounded-3xl border border-cream-200 bg-cream-50 p-7 md:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                    Sector breakdown
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-forest-900">
                    Where the BHAF network is concentrated.
                  </h3>
                </div>
                <Link
                  href="/impact"
                  className="text-sm font-medium text-forest-900 hover:text-gold-700"
                >
                  Full impact report →
                </Link>
              </div>
              <div className="mt-8">
                <AnimatedBars rows={sectorBars} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================== */}
      {/* CTA — animated gradient backdrop, reveal-in heading           */}
      {/* =========================================================== */}
      <section
        id="register"
        className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 py-24 text-cream-50"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(212, 167, 58, 0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(143, 182, 161, 0.18), transparent 50%)",
          }}
        />
        <div className="container-edge relative">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                Join MarketBridge
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-5xl">
                Bring your business to the platform built for African women entrepreneurs.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base text-cream-100/85 md:text-lg">
                Register, build your profile, document your impact and become visible to the funders, buyers and
                partners shaping the next decade of African enterprise.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link href="/portal/entrepreneur" className="btn-gold transition hover:-translate-y-0.5">
                  Register as entrepreneur
                </Link>
                <Link
                  href="/portal/funder"
                  className="inline-flex items-center justify-center rounded-md border border-cream-50/40 px-5 py-3 text-sm font-medium text-cream-50 transition hover:-translate-y-0.5 hover:border-cream-50/80"
                >
                  Sign in as funder
                </Link>
                <Link
                  href="/portal/corporate"
                  className="inline-flex items-center justify-center rounded-md border border-cream-50/40 px-5 py-3 text-sm font-medium text-cream-50 transition hover:-translate-y-0.5 hover:border-cream-50/80"
                >
                  Sign in as corporate
                </Link>
                <Link
                  href="/billing"
                  className="inline-flex items-center justify-center rounded-md border border-cream-50/40 px-5 py-3 text-sm font-medium text-cream-50 transition hover:-translate-y-0.5 hover:border-cream-50/80"
                >
                  See pricing
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-md bg-cream-50 px-5 py-3 text-sm font-medium text-forest-900 transition hover:-translate-y-0.5 hover:bg-cream-100"
                >
                  BHAF admin
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
