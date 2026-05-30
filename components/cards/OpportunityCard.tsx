import type { Opportunity, OpportunityType } from "@/data/opportunities";
import { ApplyButton } from "@/components/opportunities/ApplyButton";
import { cn } from "@/lib/utils";

const typeStyles: Record<OpportunityType, string> = {
  Grant: "bg-gold-50 text-gold-800 border-gold-200",
  Investment: "bg-forest-50 text-forest-800 border-forest-200",
  Procurement: "bg-cream-100 text-charcoal-600 border-cream-300",
  Programme: "bg-forest-900 text-cream-50 border-forest-900",
  Certification: "bg-white text-forest-900 border-forest-200",
  Government: "bg-[#0d2840] text-cream-50 border-[#0d2840]",
};

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
            typeStyles[opportunity.type],
          )}
        >
          {opportunity.type}
        </span>
        <span className="text-[11px] text-charcoal-400">{opportunity.region}</span>
      </div>

      <h3 className="mt-4 font-serif text-lg text-forest-900">{opportunity.title}</h3>
      <p className="text-xs text-charcoal-400">{opportunity.organisation}</p>

      <p className="mt-4 text-sm leading-relaxed text-charcoal-500">{opportunity.description}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-cream-200 pt-4 text-xs">
        <div>
          <dt className="text-charcoal-400">Award</dt>
          <dd className="mt-0.5 font-medium text-forest-900">{opportunity.amount}</dd>
        </div>
        <div>
          <dt className="text-charcoal-400">Deadline</dt>
          <dd className="mt-0.5 font-medium text-forest-900">{opportunity.deadline}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-400">
          Eligibility
        </p>
        <ul className="mt-2 space-y-1.5">
          {opportunity.eligibility.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-charcoal-500">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <ApplyButton opportunityId={opportunity.id} title={opportunity.title} />
    </article>
  );
}
