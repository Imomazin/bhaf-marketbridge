import type { QueueItem } from "@/data/artefacts";
import { cn } from "@/lib/utils";

interface VerificationQueueProps {
  items: QueueItem[];
}

const priorityStyles = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-gold-200 bg-gold-50 text-gold-800",
  low: "border-cream-300 bg-cream-100 text-charcoal-600",
};

export function VerificationQueue({ items }: VerificationQueueProps) {
  return (
    <section className="rounded-2xl border border-cream-200 bg-white p-6 shadow-card">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Quality assurance · verification queue
          </p>
          <h3 className="mt-1 font-serif text-lg text-forest-900">
            {items.length} artefacts awaiting review
          </h3>
          <p className="mt-1 text-xs text-charcoal-500">
            Auto-checks run on upload. Dual sign-off enforced on sensitive items. Decisions are written to
            the audit log immediately.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900">
            Filter
          </button>
          <button className="btn-secondary !py-1.5 !px-3 text-xs">Export audit pack</button>
        </div>
      </header>

      <ul className="mt-4 divide-y divide-cream-200">
        {items.map((q) => {
          const pct = Math.round((q.autoChecks.passed / q.autoChecks.total) * 100);
          return (
            <li key={q.id} className="grid gap-4 py-4 lg:grid-cols-[1.4fr_1fr_auto] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                      priorityStyles[q.priority],
                    )}
                  >
                    {q.priority}
                  </span>
                  {q.requiresDualSignOff && (
                    <span className="rounded-full border border-gold-300 bg-gold-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-800">
                      Dual sign-off
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm font-medium text-forest-900">{q.artefact}</p>
                <p className="text-xs text-charcoal-500">
                  {q.entrepreneur} · {q.business} · uploaded {q.uploadedAt}
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="text-charcoal-500">Auto-checks</span>
                  <span className="font-medium text-forest-900">
                    {q.autoChecks.passed} / {q.autoChecks.total} passed
                    {q.autoChecks.warnings > 0 && (
                      <span className="ml-1 text-gold-700">· {q.autoChecks.warnings} warning</span>
                    )}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream-200">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      pct === 100
                        ? "bg-gradient-to-r from-forest-700 to-gold-400"
                        : "bg-gradient-to-r from-gold-400 to-gold-500",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {q.requiresDualSignOff && (
                  <p className="mt-1.5 text-[10px] text-charcoal-500">
                    {q.signOffs && q.signOffs.length > 0
                      ? `Admin 1 ✓ ${q.signOffs[0].admin} · awaiting 2nd`
                      : "0 of 2 sign-offs collected"}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="rounded-md border border-cream-300 px-3 py-1.5 text-xs font-medium text-charcoal-600 hover:border-forest-700 hover:text-forest-900">
                  Review
                </button>
                <button className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-400">
                  Reject
                </button>
                <button className="rounded-md bg-forest-800 px-3 py-1.5 text-xs font-medium text-cream-50 hover:bg-forest-700">
                  Approve
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
