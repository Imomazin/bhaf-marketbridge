import type { UseCase } from "@/data/use-cases";

const accentEyebrow: Record<UseCase["accent"], string> = {
  forest: "text-forest-700",
  gold: "text-gold-700",
  navy: "text-blue-700",
};

export function DetailNarrative({ uc }: { uc: UseCase }) {
  const a = accentEyebrow[uc.accent];
  return (
    <section className="border-t border-cream-200 bg-white py-12 md:py-16 print:py-6">
      <div className="container-edge max-w-6xl">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${a}`}>
          The story in three moves
        </p>
        <h2 className="mt-2 font-serif text-2xl text-forest-900 md:text-3xl">
          From fragmented potential to verified opportunity
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Column
            step="01"
            title="The world today"
            body={uc.challenge}
            tone="muted"
          />
          <Column
            step="02"
            title="The MarketBridge moment"
            body={uc.scenario}
            tone="accent"
            accent={uc.accent}
          />
          <Column
            step="03"
            title="The projected outcome"
            body={uc.expectedValue}
            tone="strong"
            accent={uc.accent}
          />
        </div>
      </div>
    </section>
  );
}

function Column({
  step,
  title,
  body,
  tone,
  accent,
}: {
  step: string;
  title: string;
  body: string;
  tone: "muted" | "accent" | "strong";
  accent?: UseCase["accent"];
}) {
  const accentBg: Record<string, string> = {
    forest: "border-forest-200 bg-forest-50/70",
    gold: "border-gold-200 bg-gold-50/60",
    navy: "border-blue-200 bg-blue-50/60",
  };

  const box =
    tone === "muted"
      ? "border-cream-300 bg-cream-50/70"
      : tone === "accent" && accent
      ? accentBg[accent]
      : "border-forest-800 bg-forest-800 text-cream-50";

  const eyebrow =
    tone === "strong"
      ? "text-gold-300"
      : accent === "forest"
      ? "text-forest-700"
      : accent === "gold"
      ? "text-gold-700"
      : accent === "navy"
      ? "text-blue-700"
      : "text-charcoal-500";

  const bodyColor = tone === "strong" ? "text-cream-100" : "text-charcoal-700";
  const titleColor = tone === "strong" ? "text-cream-50" : "text-forest-900";

  return (
    <div className={`rounded-2xl border p-6 shadow-soft ${box} print:shadow-none`}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${eyebrow}`}>
        Step {step}
      </p>
      <h3 className={`mt-1 font-serif text-lg ${titleColor}`}>{title}</h3>
      <p className={`mt-3 text-[13px] leading-relaxed ${bodyColor}`}>{body}</p>
    </div>
  );
}
