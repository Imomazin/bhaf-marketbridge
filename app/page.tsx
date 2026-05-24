import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EntrepreneurCard } from "@/components/cards/EntrepreneurCard";
import { ImpactMetricCard } from "@/components/cards/ImpactMetricCard";
import { HeroPhotoCarousel, type HeroSlide } from "@/components/ui/HeroPhotoCarousel";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { MarqueePartners } from "@/components/ui/MarqueePartners";
import { entrepreneurs } from "@/data/entrepreneurs";
import { impactMetrics } from "@/data/impact";
import { roles, accentClasses } from "@/data/roles";
import { bhafPartners, photos } from "@/data/photos";
import { cn } from "@/lib/utils";

const heroSlides: HeroSlide[] = [
  { photo: photos.abuja1, location: "Abuja", event: "Accelerator Cohort 1 in session" },
  { photo: photos.nyc1, location: "New York", event: "BHAF Global Launch at the UN" },
  { photo: photos.ihs1, location: "Dublin", event: "InvestHer Summit marketplace stage" },
  { photo: photos.drc1, location: "Kinshasa", event: "FEMEC RDC circular economy training" },
];

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

const howItWorks = [
  { step: "01", title: "Register", body: "Entrepreneurs create an account and select their sector and country." },
  { step: "02", title: "Create profile", body: "Structured profile with business details, products and verification documents." },
  { step: "03", title: "Document ESG", body: "Capture environmental, social and governance activity using guided forms." },
  { step: "04", title: "List products", body: "Publish marketplace listings for buyers, corporates and partners." },
  { step: "05", title: "Readiness check", body: "Complete the readiness checklist to unlock visibility tiers." },
  { step: "06", title: "Get discovered", body: "Become visible to funders, donors, buyers and corporate procurement." },
];

const galleryPhotos = [
  { photo: photos.nyc1, location: "New York", event: "BHAF Global Launch", caption: "Convened with IPWRA at the United Nations." },
  { photo: photos.abuja7, location: "Abuja", event: "Accelerator Cohort 1", caption: "Group portrait of the inaugural cohort." },
  { photo: photos.drc1, location: "Kinshasa", event: "FEMEC RDC Launch", caption: "Circular economy training in session." },
  { photo: photos.ihs1, location: "Dublin", event: "InvestHer Summit", caption: "BHAF on the networking & marketplace stage." },
  { photo: photos.baloni3, location: "Baloni Farm", event: "Field Visit", caption: "Live ESG and circular economy site visit." },
  { photo: photos.drc5, location: "Kinshasa", event: "Certification Ceremony", caption: "DRC cohort graduates with certificates." },
];

export default function HomePage() {
  const featured = entrepreneurs.slice(0, 3);

  return (
    <>
      {/* =========================================================== */}
      {/* HERO — full-bleed CAROUSEL, animated stats, scroll reveal     */}
      {/* =========================================================== */}
      <section className="relative isolate overflow-hidden bg-forest-950">
        <HeroPhotoCarousel slides={heroSlides} />

        {/* Layered overlays for depth + text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-forest-950/70" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 60%, rgba(212, 167, 58, 0.35), transparent 45%)",
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
                  href="#how"
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

          <figure className="order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
              <Image
                src={photos.abuja12.src}
                alt={photos.abuja12.alt}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-transparent to-transparent" />
            </div>
            <figcaption className="mt-3 text-xs text-charcoal-500">
              <span className="font-semibold uppercase tracking-[0.16em] text-gold-700">Abuja Accelerator</span>
              <span className="ml-2">Keynote at the Cohort 1 launch.</span>
            </figcaption>
          </figure>
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
      {/* HOW IT WORKS — staggered reveal, hover lift                   */}
      {/* =========================================================== */}
      <section id="how" className="bg-white py-24">
        <div className="container-edge">
          <Reveal>
            <SectionHeader
              eyebrow="How it works"
              title="A clear path from registration to global visibility."
              description="The MarketBridge journey turns an entrepreneur's existing impact into structured, fundable, market-ready evidence."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((step, idx) => (
              <Reveal key={step.step} delayMs={idx * 80}>
                <div className="card flex h-full flex-col p-7 transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <span className="font-serif text-3xl text-gold-500">{step.step}</span>
                  <h3 className="mt-3 font-serif text-lg text-forest-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-500">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
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
      {/* BHAF IN ACTION — magazine layout, one hero + 5 thumbnails    */}
      {/* =========================================================== */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="BHAF in action"
            title="Real cohorts. Real cities. Real momentum."
            description="From Abuja to Kinshasa to Dublin and New York — BHAF is already convening, training and connecting the women entrepreneurs MarketBridge brings online."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            {/* Hero feature photo — spans 7 cols on desktop */}
            <figure className="group lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-forest-900 lg:aspect-[16/11]">
                <Image
                  src={galleryPhotos[0].photo.src}
                  alt={galleryPhotos[0].photo.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover transition duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream-50 md:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                    {galleryPhotos[0].location} · {galleryPhotos[0].event}
                  </p>
                  <p className="mt-2 max-w-md font-serif text-xl leading-snug md:text-2xl">
                    {galleryPhotos[0].caption}
                  </p>
                </figcaption>
              </div>
            </figure>

            {/* Right column — 2 medium thumbnails stacked */}
            <div className="grid gap-6 lg:col-span-5 lg:grid-rows-2">
              {galleryPhotos.slice(1, 3).map((g) => (
                <figure key={g.photo.src} className="group">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-forest-900 lg:aspect-auto lg:h-full">
                    <Image
                      src={g.photo.src}
                      alt={g.photo.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/5 to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream-50">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                        {g.location} · {g.event}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-cream-100">{g.caption}</p>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>

            {/* Bottom row — 3 thumbnails */}
            {galleryPhotos.slice(3).map((g) => (
              <figure key={g.photo.src} className="group lg:col-span-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest-900">
                  <Image
                    src={g.photo.src}
                    alt={g.photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/5 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream-50">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                      {g.location} · {g.event}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-cream-100">{g.caption}</p>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* FEATURED ENTREPRENEURS                                        */}
      {/* =========================================================== */}
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
      {/* IMPACT — metrics anchored by one Dublin photo                 */}
      {/* =========================================================== */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Impact reporting"
            title="Real numbers. Real evidence. Real accountability."
            description="MarketBridge captures live impact data across women supported, jobs created, ESG outcomes and funding mobilised — turning activity into donor-grade reporting."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={photos.ihs1.src}
                  alt={photos.ihs1.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream-50">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                    InvestHer Summit · Dublin
                  </p>
                  <p className="mt-1 text-sm text-cream-100/95">
                    Where MarketBridge data meets global capital.
                  </p>
                </figcaption>
              </div>
            </figure>
            <div className="grid gap-4 sm:grid-cols-2">
              {impactMetrics.slice(0, 4).map((m, idx) => (
                <ImpactMetricCard key={m.id} metric={m} emphasis={idx === 0} />
              ))}
            </div>
          </div>
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
