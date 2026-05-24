import Link from "next/link";
import { roleFlows } from "@/data/roleFlows";
import { roles, accentClasses, type RoleId } from "@/data/roles";
import { cn } from "@/lib/utils";

interface PortalWorkflowStripProps {
  roleId: RoleId;
  currentStep?: number; // 1-indexed; defaults to 1
}

export function PortalWorkflowStrip({ roleId, currentStep = 1 }: PortalWorkflowStripProps) {
  const flow = roleFlows[roleId];
  const role = roles.find((r) => r.id === roleId)!;
  const accent = accentClasses[role.accent];

  return (
    <section className="border-b border-cream-200 bg-cream-100/60">
      <div className="container-edge py-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              Your workflow
            </span>
            <span className="gold-rule" />
          </div>
          <Link href="/#roles" className="text-xs font-medium text-forest-700 hover:text-gold-700">
            See full role journey →
          </Link>
        </div>

        <ol className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6">
          {flow.steps.map((step, idx) => {
            const isComplete = idx + 1 < currentStep;
            const isCurrent = idx + 1 === currentStep;
            return (
              <li
                key={step.number}
                className={cn(
                  "relative rounded-lg border px-3 py-2.5 transition",
                  isCurrent
                    ? "border-gold-300 bg-gold-50 shadow-soft"
                    : isComplete
                    ? "border-forest-200 bg-forest-50"
                    : "border-cream-200 bg-white",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                      isCurrent
                        ? accent.bg + " text-cream-50"
                        : isComplete
                        ? "bg-forest-700 text-cream-50"
                        : "border border-cream-300 text-charcoal-400",
                    )}
                  >
                    {isComplete ? "✓" : step.number}
                  </span>
                  <span
                    className={cn(
                      "truncate text-[11px] font-medium",
                      isCurrent ? "text-forest-900" : isComplete ? "text-forest-700" : "text-charcoal-500",
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
