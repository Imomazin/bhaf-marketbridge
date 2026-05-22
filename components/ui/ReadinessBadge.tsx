import { cn } from "@/lib/utils";
import type { ReadinessLevel } from "@/data/entrepreneurs";

const styles: Record<ReadinessLevel, string> = {
  Emerging: "border-charcoal-200 bg-charcoal-50 text-charcoal-600",
  Developing: "border-cream-300 bg-cream-100 text-charcoal-600",
  "Market-Ready": "border-forest-200 bg-forest-50 text-forest-800",
  "Funding-Ready": "border-gold-300 bg-gold-50 text-gold-800",
};

const dots: Record<ReadinessLevel, string> = {
  Emerging: "bg-charcoal-300",
  Developing: "bg-cream-300",
  "Market-Ready": "bg-forest-500",
  "Funding-Ready": "bg-gold-500",
};

interface ReadinessBadgeProps {
  level: ReadinessLevel;
  className?: string;
}

export function ReadinessBadge({ level, className }: ReadinessBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        styles[level],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[level])} />
      {level}
    </span>
  );
}
