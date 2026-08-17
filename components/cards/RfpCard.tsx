import { RfpApplyButton } from "@/components/opportunities/RfpApplyButton";
import { cn } from "@/lib/utils";

interface RfpCardProps {
  rfp: {
    id: string;
    title: string;
    category: string;
    description: string;
    region: string | null;
    budgetUsd: string | null;
    deadline: Date | null;
    owner: { name: string | null };
  };
  hasApplied?: boolean;
}

export function RfpCard({ rfp, hasApplied }: RfpCardProps) {
  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium border-[#0d2840] bg-[#0d2840] text-cream-50"
          )}
        >
          {rfp.category}
        </span>
        <span className="text-[11px] text-charcoal-400">{rfp.region || "Global"}</span>
      </div>

      <h3 className="mt-4 font-serif text-lg text-forest-900">{rfp.title}</h3>
      <p className="text-xs text-charcoal-400">{rfp.owner.name || "Corporate Partner"}</p>

      <p className="mt-4 text-sm leading-relaxed text-charcoal-500">{rfp.description}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-cream-200 pt-4 text-xs">
        <div>
          <dt className="text-charcoal-400">Budget</dt>
          <dd className="mt-0.5 font-medium text-forest-900">{rfp.budgetUsd || "Not specified"}</dd>
        </div>
        <div>
          <dt className="text-charcoal-400">Deadline</dt>
          <dd className="mt-0.5 font-medium text-forest-900">
            {rfp.deadline ? rfp.deadline.toISOString().slice(0, 10) : "Rolling"}
          </dd>
        </div>
      </dl>

      <div className="mt-auto pt-4">
        <RfpApplyButton rfpId={rfp.id} title={rfp.title} hasApplied={hasApplied} />
      </div>
    </article>
  );
}
