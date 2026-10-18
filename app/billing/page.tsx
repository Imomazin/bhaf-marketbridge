import Link from "next/link";
import { auth } from "@/auth";
import { PRICING } from "@/lib/integrations/payments";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { cn } from "@/lib/utils";

export const metadata = { title: "Pricing · BHAF MarketBridge" };
export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await auth();
  const showCorporate = session?.user?.role !== "FUNDER";
  const showFunder = session?.user?.role !== "CORPORATE";

  return (
    <section className="bg-cream-50 py-12 md:py-16">
      <div className="container-edge">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Pricing</p>
        <h1 className="mt-2 font-serif text-3xl text-forest-900 md:text-5xl">
          One platform. Tiers for every partner.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-charcoal-500">
          Entrepreneurs are free during launch. Funder and corporate subscriptions fund the
          infrastructure that keeps BHAF MarketBridge running.
        </p>

        {showCorporate && (
          <div className="mt-12">
            <h2 className="font-serif text-xl text-forest-900">Corporate partners</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {PRICING.corporate.map((p, i) => (
                <PlanCard key={p.id} plan={p} highlight={i === 1} />
              ))}
            </div>
          </div>
        )}

        {showFunder && (
          <div className="mt-12">
            <h2 className="font-serif text-xl text-forest-900">Funders & donors</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {PRICING.funder.map((p, i) => (
                <PlanCard key={p.id} plan={p} highlight={i === 1} />
              ))}
            </div>
          </div>
        )}

        {/* Bespoke Consulting & Advisory Services */}
        <div className="mt-14 rounded-2xl border border-forest-300 bg-forest-900 p-8 text-cream-50 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="rounded-full bg-gold-500/20 border border-gold-400/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-300">
                BHAF Advisory Practice
              </span>
              <h3 className="mt-3 font-serif text-2xl text-cream-50 md:text-3xl">
                Need Bespoke Consulting or Tailored Advisory?
              </h3>
              <p className="mt-2 text-sm text-cream-200">
                We offer personalized technical advisory, ESG compliance audits, data room structuring, and inclusive supply chain transformation with transparent, variable pricing.
              </p>
            </div>
            <Link
              href="/services/consulting"
              className="rounded-lg bg-gold-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-forest-950 hover:bg-gold-400 transition shadow-md"
            >
              Explore Bespoke Consulting →
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-gold-200 bg-gold-50 p-5 text-xs text-gold-900">
          <p className="font-semibold uppercase tracking-wide">Entrepreneurs always free</p>
          <p className="mt-1">
            Women entrepreneurs never pay to publish profiles, list products, upload artefacts or apply to
            opportunities. BHAF MarketBridge stays viable through corporate, funder, and grant revenue.
          </p>
        </div>

        {!session?.user && (
          <p className="mt-8 text-xs text-charcoal-500">
            <Link href="/auth/sign-in" className="font-medium text-forest-800 underline">Sign in</Link> to subscribe.
          </p>
        )}
      </div>
    </section>
  );
}

function PlanCard({ plan, highlight }: { plan: { id: string; name: string; priceUsd: number; period: string; features: readonly string[] }; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-white p-6",
        highlight ? "border-gold-300 shadow-soft" : "border-cream-200",
      )}
    >
      <p className="font-serif text-lg text-forest-900">{plan.name}</p>
      <p className="mt-3 font-serif text-3xl text-forest-900">
        ${plan.priceUsd.toLocaleString()}
        <span className="text-sm font-normal text-charcoal-500">{plan.period}</span>
      </p>
      <ul className="mt-5 flex-1 space-y-2 text-xs text-charcoal-600">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold-500" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <CheckoutButton planId={plan.id} planName={plan.name} amountUsdCents={plan.priceUsd * 100} />
      </div>
    </div>
  );
}
