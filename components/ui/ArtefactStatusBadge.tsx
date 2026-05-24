import type { ArtefactStatus } from "@/data/artefacts";
import { statusLabel, statusTone } from "@/data/artefacts";
import { cn } from "@/lib/utils";

const toneStyles = {
  neutral: "border-cream-300 bg-cream-100 text-charcoal-600",
  info: "border-blue-200 bg-blue-50 text-[#0d2840]",
  warn: "border-gold-300 bg-gold-50 text-gold-800",
  ok: "border-forest-300 bg-forest-50 text-forest-800",
  bad: "border-red-300 bg-red-50 text-red-700",
};

const toneDot = {
  neutral: "bg-charcoal-300",
  info: "bg-[#0d2840]",
  warn: "bg-gold-500",
  ok: "bg-forest-700",
  bad: "bg-red-500",
};

interface ArtefactStatusBadgeProps {
  status: ArtefactStatus;
  className?: string;
  pulse?: boolean;
}

export function ArtefactStatusBadge({ status, className, pulse = false }: ArtefactStatusBadgeProps) {
  const tone = statusTone[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em]",
        toneStyles[tone],
        className,
      )}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {pulse && tone === "info" && (
          <span className={cn("absolute h-2 w-2 animate-ping rounded-full opacity-60", toneDot[tone])} />
        )}
        <span className={cn("h-1.5 w-1.5 rounded-full", toneDot[tone])} />
      </span>
      {statusLabel[status]}
    </span>
  );
}
