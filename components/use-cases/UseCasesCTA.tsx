import Link from "next/link";

export function UseCasesCTA() {
  return (
    <section
      id="closing-cta"
      className="relative overflow-hidden border-t border-cream-200 bg-gradient-to-br from-forest-900 to-forest-800 text-cream-50"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl"
      />

      <div className="container-edge relative max-w-4xl py-16 text-center md:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
          Continuous partnership
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
          Partner with BHAF to turn women-led enterprise potential into{" "}
          <span className="text-gold-300">verified, investible and market-ready</span> opportunity
          pipelines.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream-200">
          MarketBridge gives BHAF and its ecosystem partners a shared infrastructure for trust,
          visibility, procurement and impact reporting — designed to compound over time.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/messages" className="btn-gold !py-2.5 !px-5 text-xs">
            Start a partnership conversation
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-cream-50/30 bg-white/5 px-5 py-2.5 text-xs font-medium text-cream-50 transition hover:bg-white/10"
          >
            Explore the platform
          </Link>
        </div>

        <p className="mt-10 text-[11px] uppercase tracking-[0.18em] text-cream-200/70">
          BHAF Circular Academy &amp; Consulting Firm · MarketBridge
        </p>
      </div>
    </section>
  );
}
