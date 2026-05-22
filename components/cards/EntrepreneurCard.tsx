import type { Entrepreneur } from "@/data/entrepreneurs";
import { ReadinessBadge } from "@/components/ui/ReadinessBadge";

interface EntrepreneurCardProps {
  entrepreneur: Entrepreneur;
}

export function EntrepreneurCard({ entrepreneur }: EntrepreneurCardProps) {
  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 font-serif text-cream-50">
            {entrepreneur.initials}
          </div>
          <div>
            <h3 className="font-serif text-lg text-forest-900">{entrepreneur.name}</h3>
            <p className="text-xs text-charcoal-400">
              {entrepreneur.businessName} · {entrepreneur.country}
            </p>
          </div>
        </div>
        <ReadinessBadge level={entrepreneur.readinessLevel} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="chip">{entrepreneur.sector}</span>
        <span className="chip-gold">Est. {entrepreneur.yearFounded}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-charcoal-500">{entrepreneur.description}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-cream-200 pt-4 text-xs">
        <div>
          <dt className="text-charcoal-400">Funding need</dt>
          <dd className="mt-0.5 text-forest-900">{entrepreneur.fundingNeed}</dd>
        </div>
        <div>
          <dt className="text-charcoal-400">ESG activity</dt>
          <dd className="mt-0.5 text-forest-900">{entrepreneur.esgActivity}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-cream-200 pt-4 text-xs text-charcoal-500">
        <span>
          <span className="font-semibold text-forest-800">{entrepreneur.womenSupported}</span> women supported
        </span>
        <span>
          <span className="font-semibold text-forest-800">{entrepreneur.jobsCreated}</span> jobs created
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {entrepreneur.certifications.slice(0, 2).map((cert) => (
          <span key={cert} className="chip">
            {cert}
          </span>
        ))}
        {entrepreneur.certifications.length > 2 && (
          <span className="chip">+{entrepreneur.certifications.length - 2} more</span>
        )}
      </div>

      <button className="mt-6 w-full rounded-md border border-forest-800/15 px-4 py-2.5 text-xs font-medium text-forest-900 transition hover:border-forest-800 hover:bg-forest-50">
        View profile
      </button>
    </article>
  );
}
