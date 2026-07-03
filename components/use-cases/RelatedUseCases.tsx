import Link from "next/link";
import { useCases, type UseCase } from "@/data/use-cases";

const accentClass: Record<UseCase["accent"], string> = {
  forest: "border-forest-200 hover:border-forest-400",
  gold: "border-gold-200 hover:border-gold-400",
  navy: "border-blue-200 hover:border-blue-400",
};

const accentEyebrow: Record<UseCase["accent"], string> = {
  forest: "text-forest-700",
  gold: "text-gold-700",
  navy: "text-blue-700",
};

export function RelatedUseCases({ currentSlug }: { currentSlug: string }) {
  const others = useCases.filter((u) => u.slug !== currentSlug);
  return (
    <section className="border-t border-cream-200 bg-cream-50 py-14 print:hidden">
      <div className="container-edge max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-700">
          Related use cases
        </p>
        <h2 className="mt-2 font-serif text-2xl text-forest-900 md:text-3xl">
          Keep exploring the stakeholder pathways
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {others.map((uc) => (
            <Link
              key={uc.slug}
              href={`/use-cases/${uc.slug}`}
              className={`group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg ${accentClass[uc.accent]}`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${accentEyebrow[uc.accent]}`}
              >
                Use case 0{uc.number} · {uc.stakeholder}
              </p>
              <h3 className="mt-2 font-serif text-lg leading-tight text-forest-900">
                {uc.title}
              </h3>
              <p className="mt-3 flex-1 text-sm text-charcoal-600">{uc.intervention}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-900 group-hover:text-gold-700">
                Read the full journey <span aria-hidden>→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
