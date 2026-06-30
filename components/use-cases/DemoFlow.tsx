import Link from "next/link";

const steps = [
  {
    label: "Start with the entrepreneur",
    detail:
      "Blandine BISHENGEZI structures her profile, uploads registration evidence and publishes her textile-craft listing.",
    accent: "forest",
    href: "#use-case-1",
  },
  {
    label: "Buyer discovery",
    detail:
      "A European public-sector buyer posts an RFP and surfaces verified women-led suppliers — including ECONUDGE DRC.",
    accent: "gold",
    href: "#use-case-2",
  },
  {
    label: "Funder review",
    detail:
      "A DFI or investor opens a controlled data room with audits, financials and impact evidence for a shortlist decision.",
    accent: "navy",
    href: "#use-case-3",
  },
  {
    label: "Continuous partnership",
    detail:
      "BHAF and ecosystem partners deepen the relationship — cohort follow-on, impact reporting, repeat procurement.",
    accent: "charcoal",
    href: "#closing-cta",
  },
];

const accent: Record<string, { dot: string; ring: string; eyebrow: string }> = {
  forest: { dot: "bg-forest-700", ring: "ring-forest-100", eyebrow: "text-forest-700" },
  gold: { dot: "bg-gold-500", ring: "ring-gold-100", eyebrow: "text-gold-700" },
  navy: { dot: "bg-blue-600", ring: "ring-blue-100", eyebrow: "text-blue-700" },
  charcoal: { dot: "bg-charcoal-600", ring: "ring-cream-200", eyebrow: "text-charcoal-700" },
};

export function DemoFlow() {
  return (
    <section
      id="impact-pathway"
      className="border-t border-cream-200 bg-white py-16 md:py-20"
    >
      <div className="container-edge max-w-6xl">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
            How the MVP demo flows
          </p>
          <h2 className="mt-2 font-serif text-2xl text-forest-900 md:text-3xl">
            From entrepreneur potential to investible pipeline
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-charcoal-600">
            A four-step demonstration arc connecting the three use cases into a single narrative
            BHAF and partners can walk through end-to-end.
          </p>
        </header>

        <ol className="relative mt-10 grid gap-5 md:grid-cols-4">
          <span
            aria-hidden
            className="absolute left-4 right-4 top-5 hidden h-px bg-gradient-to-r from-forest-200 via-gold-300 to-blue-200 md:block"
          />
          {steps.map((s, i) => {
            const a = accent[s.accent];
            return (
              <li key={s.label} className="relative">
                <Link
                  href={s.href}
                  className="flex h-full flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span
                    aria-hidden
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ${a.dot} ring-4 ${a.ring}`}
                  >
                    {i + 1}
                  </span>
                  <p
                    className={`mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] ${a.eyebrow}`}
                  >
                    Step {i + 1}
                  </p>
                  <p className="mt-1 font-serif text-base text-forest-900">{s.label}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal-600">{s.detail}</p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
