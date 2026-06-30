import { cn } from "@/lib/utils";

interface PrototypeDisclaimerProps {
  text: string;
  variant?: "strip" | "badge";
  className?: string;
}

export function PrototypeDisclaimer({
  text,
  variant = "strip",
  className,
}: PrototypeDisclaimerProps) {
  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-gold-300 bg-gold-50/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-800",
          className,
        )}
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
        {text}
      </span>
    );
  }
  return (
    <div
      role="note"
      aria-label="Prototype disclaimer"
      className={cn(
        "rounded-xl border border-gold-200 bg-gradient-to-r from-gold-50 via-cream-50 to-cream-50 px-4 py-3 text-[12px] leading-relaxed text-charcoal-700 shadow-soft",
        className,
      )}
    >
      <span className="mr-2 inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-700 ring-1 ring-gold-200">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
        Prototype
      </span>
      {text}
    </div>
  );
}
