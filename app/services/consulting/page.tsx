import Link from "next/link";
import { auth } from "@/auth";
import { ConsultingRequestForm } from "@/components/consulting/ConsultingRequestForm";
import { SERVICE_TRACKS } from "@/lib/consultingPricing";

export const metadata = {
  title: "Bespoke Consulting & Advisory · BHAF Circular Academy & Consulting",
  description:
    "Tailored ESG compliance, investment readiness, circular economy transformation, and inclusive procurement consulting for African enterprises, corporates, and funders.",
};

export const dynamic = "force-dynamic";

export default async function ConsultingServicesPage() {
  const session = await auth();

  return (
    <div className="bg-cream-50">
      {/* Hero Section */}
      <section className="border-b border-cream-200 bg-white py-14 md:py-20">
        <div className="container-edge">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              BHAF Circular Academy & Consulting Firm
            </p>
            <h1 className="mt-3 font-serif text-3xl text-forest-900 md:text-5xl">
              Personalized & Bespoke Advisory Services
            </h1>
            <p className="mt-4 text-base text-charcoal-600 leading-relaxed">
              Transform your enterprise with specialized technical advisory, ESG compliance audits,
              institutional data room architecture, and cross-border trade structuring delivered by senior African market specialists.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-forest-50 border border-forest-200 px-3 py-1 text-xs font-semibold text-forest-800">
                ✓ Concessionary Grassroots Pricing
              </span>
              <span className="rounded-full bg-forest-50 border border-forest-200 px-3 py-1 text-xs font-semibold text-forest-800">
                ✓ Transparent Variable Price Range
              </span>
              <span className="rounded-full bg-forest-50 border border-forest-200 px-3 py-1 text-xs font-semibold text-forest-800">
                ✓ Fixed-Price Proposal Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Tracks Showcase */}
      <section className="py-12 md:py-16 border-b border-cream-200">
        <div className="container-edge">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400">
                Advisory Pillars
              </p>
              <h2 className="mt-1 font-serif text-2xl text-forest-900 md:text-3xl">
                Specialized Practice Areas
              </h2>
            </div>
            <Link href="#request-form" className="text-xs font-semibold text-forest-800 hover:text-gold-700">
              Configure your scope below ↓
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_TRACKS.map((track) => (
              <div
                key={track.id}
                className="card flex flex-col justify-between border-cream-300 bg-white p-6 transition hover:shadow-soft"
              >
                <div>
                  <span className="text-3xl">{track.icon}</span>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-forest-900">
                    {track.title}
                  </h3>
                  <p className="mt-2 text-xs text-charcoal-600">
                    {track.shortDesc}
                  </p>
                </div>
                <div className="mt-6 border-t border-cream-200 pt-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-charcoal-400">
                    Key Outputs:
                  </span>
                  <ul className="mt-2 space-y-1 text-xs text-charcoal-700">
                    {track.keyDeliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-gold-600 font-bold">›</span>
                        {del}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Form with Live Variable Pricing */}
      <section id="request-form" className="py-12 md:py-20">
        <div className="container-edge">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              Interactive Scope Builder
            </p>
            <h2 className="mt-2 font-serif text-3xl text-forest-900 md:text-4xl">
              Request a Bespoke Proposal
            </h2>
            <p className="mt-2 text-sm text-charcoal-500">
              Select your required service track and describe your project. Our team will review your requirements and reach out to schedule a consultation.
            </p>
          </div>

          <ConsultingRequestForm initialUser={session?.user} />
        </div>
      </section>
    </div>
  );
}
