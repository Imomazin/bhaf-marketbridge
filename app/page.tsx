import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EntrepreneurCard } from "@/components/cards/EntrepreneurCard";
import { ImpactMetricCard } from "@/components/cards/ImpactMetricCard";
import { entrepreneurs } from "@/data/entrepreneurs";
import { impactMetrics } from "@/data/impact";
import { roles, accentClasses } from "@/data/roles";
import { bhafPartners, photos } from "@/data/photos";
import { cn } from "@/lib/utils";

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
  const heroStats = impactMetrics.slice(0, 3);

  return (
    <>
      {/* =========================================================== */}
      {/* HERO — editorial split, single anchor photo, clean text       */}
      {/* =========================================================== */}
      <section className="relative overflow-hidden bg-forest-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 0% 10%, rgba(212, 167, 58, 0.18), transparent 45%), radial-gradient(circle at 100% 90%, rgba(36, 70, 56, 0.4), transparent 50%)",
          }}
        />
        <div className="container-edge relative grid items-stretch gap-12 py-16 md:grid-cols-[1.05fr_1fr] md:gap-16 md:py-24">
          <div className="flex flex-col justify-center text-cream-50">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-300/40 bg-gold-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-gold-200">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
              BHAF Circular Academy · MarketBridge
            </span>
            <h1 className="mt-6 font-serif text-[2.7rem] leading-[1.05] tracking-tight md:text-[3.6rem] lg:text-[4.2rem]">
              The market is moving.
              <br />
              <span className="text-gold-300">She</span> belongs in it.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/85 md:text-lg">
              MarketBridge is the marketplace and impact infrastructure platform connecting verified African
              women-led businesses with funders, corporate buyers and global market access.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/portal" className="btn-gold">
                Sign in or register
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center justify-center rounded-md border border-cream-50/30 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-cream-50/70"
              >
                See how it works
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-x-6 gap-y-4 border-t border-cream-50/15 pt-8">
              {heroStats.map((m) => (
                <div key={m.id}>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-gold-300">{m.label}</dt>
                  <dd className="mt-1 font-serif text-3xl text-cream-50">{m.value}</dd>
                  <dd className="mt-0.5 text-[11px] text-cream-100/60">{m.caption.split(",")[0]}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Single anchor hero photo — no rotated overlays */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-cream-50/10 shadow-soft">
              <Image
                src={photos.abuja1.src}
                alt={photos.abuja1.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                  Abuja Accelerator · Cohort 1
                </p>
                <p className="mt-1 text-sm leading-snug text-cream-100/95">
                  Women entrepreneurs in session — building the documentation, networks and readiness that turn
                  ambition into deal flow.
                </p>
              </figcaption>
            </div>

            {/* small floating badge — single, controlled */}
            <div className="absolute -bottom-5 left-6 hidden items-center gap-3 rounded-full bg-cream-50 px-4 py-2 shadow-soft md:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-800 font-serif text-xs text-cream-50">
                ✓
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.16em] text-charcoal-400">Verified network</p>
                <p className="text-xs font-semibold text-forest-900">165+ businesses · 11 countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* TRUST STRIP — partners in elegant text band                   */}
      {/* =========================================================== */}
      <section className="border-y border-cream-200 bg-cream-50">
        <div className="container-edge flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-500">
            Convened with
          </p>
          {trustPartners.map((name) => (
            <span key={name} className="text-xs font-medium text-charcoal-600">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* =========================================================== */}
      {/* PROBLEM — clean 3 cards, no photos, numbered                  */}
      {/* =========================================================== */}
      <section className="bg-cream-50 py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="The problem"
            title="African women entrepreneurs are building exceptional businesses — and still being overlooked."
            description="Capital, procurement and ESG opportunities exist in abundance. What is missing is the infrastructure to make women-led businesses visible, verified and ready."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {problemPoints.map((p) => (
              <div key={p.number} className="card flex h-full flex-col p-8">
                <p className="font-serif text-3xl text-gold-500">{p.number}</p>
                <h3 className="mt-4 font-serif text-xl text-forest-900">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-500">{p.body}</p>
              </div>
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
      {/* ROLE PICKER — 4 distinct entry paths                          */}
      {/* =========================================================== */}
      <section id="roles" className="bg-forest-50 py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="Choose your role"
            title="MarketBridge works differently for each kind of partner."
            description="A workspace built for the way you actually use the platform — pick yours and continue."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => {
              const accent = accentClasses[role.accent];
              return (
                <Link
                  key={role.id}
                  href={role.href}
                  className="group flex h-full flex-col rounded-2xl border border-cream-200 bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md text-cream-50", accent.bg)}>
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
                  <span className="mt-auto pt-6 text-sm font-medium text-forest-900 transition group-hover:text-gold-700">
                    {role.signInLabel} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================== */}
      {/* HOW IT WORKS — clean 6 steps                                  */}
      {/* =========================================================== */}
      <section id="how" className="bg-white py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="How it works"
            title="A clear path from registration to global visibility."
            description="The MarketBridge journey turns an entrepreneur's existing impact into structured, fundable, market-ready evidence."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
      {/* BHAF IN ACTION — uniform 6-card gallery, captions BELOW       */}
      {/* =========================================================== */}
      <section className="bg-white py-24">
        <div className="container-edge">
          <SectionHeader
            eyebrow="BHAF in action"
            title="Real cohorts. Real cities. Real momentum."
            description="From Abuja to Kinshasa to Dublin and New York — BHAF is already convening, training and connecting the women entrepreneurs MarketBridge brings online."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galleryPhotos.map((g) => (
              <figure key={g.photo.src} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-forest-900">
                  <Image
                    src={g.photo.src}
                    alt={g.photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">
                    {g.location} · {g.event}
                  </p>
                  <p className="mt-1 text-sm text-charcoal-600">{g.caption}</p>
                </figcaption>
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
      {/* CTA — clean, no photo. Bold typography moment                 */}
      {/* =========================================================== */}
      <section id="register" className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 py-24 text-cream-50">
        <div className="container-edge">
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
              <Link href="/portal/entrepreneur" className="btn-gold">
                Register as entrepreneur
              </Link>
              <Link
                href="/portal/funder"
                className="inline-flex items-center justify-center rounded-md border border-cream-50/40 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-cream-50/80"
              >
                Sign in as funder
              </Link>
              <Link
                href="/portal/corporate"
                className="inline-flex items-center justify-center rounded-md border border-cream-50/40 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-cream-50/80"
              >
                Sign in as corporate
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-md bg-cream-50 px-5 py-3 text-sm font-medium text-forest-900 transition hover:bg-cream-100"
              >
                BHAF admin
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
