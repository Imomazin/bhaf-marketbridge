import type { ImpactMetric } from "@/data/impact";
import { cn } from "@/lib/utils";

interface ImpactMetricCardProps {
  metric: ImpactMetric;
  emphasis?: boolean;
}

export function ImpactMetricCard({ metric, emphasis = false }: ImpactMetricCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-6",
        emphasis
          ? "border-gold-300 bg-gradient-to-br from-forest-900 to-forest-800 text-cream-50 shadow-soft"
          : "border-cream-200 bg-white shadow-card",
      )}
    >
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.18em]",
          emphasis ? "text-gold-300" : "text-gold-700",
        )}
      >
        {metric.label}
      </p>
      <p
        className={cn(
          "mt-3 font-serif text-4xl",
          emphasis ? "text-cream-50" : "text-forest-900",
        )}
      >
        {metric.value}
      </p>
      <p
        className={cn(
          "mt-2 text-sm",
          emphasis ? "text-cream-100/80" : "text-charcoal-500",
        )}
      >
        {metric.caption}
      </p>
      <p
        className={cn(
          "mt-auto pt-4 text-xs",
          emphasis ? "text-gold-200" : "text-forest-700",
        )}
      >
        {metric.trend}
      </p>
    </div>
  );
}
