import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  PENDING: "border-gold-300 bg-gold-50 text-gold-800",
  APPROVED: "border-forest-200 bg-forest-50 text-forest-800",
  PARTIALLY_APPROVED: "border-forest-200 bg-forest-50 text-forest-800",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
};

const dots: Record<string, string> = {
  PENDING: "bg-gold-500",
  APPROVED: "bg-forest-500",
  PARTIALLY_APPROVED: "bg-forest-500",
  REJECTED: "bg-red-500",
};

const labels: Record<string, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  PARTIALLY_APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function ReviewStatusBadge({ status, className }: { status: string; className?: string }) {
  const isPartial = status === "PARTIALLY_APPROVED";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium relative group cursor-default",
        styles[status] ?? styles.PENDING,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[status] ?? dots.PENDING)} />
      {labels[status] ?? status}

      {isPartial && (
        <>
          <svg className="h-3.5 w-3.5 text-forest-600 opacity-70 transition-opacity hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="absolute left-1/2 top-full z-50 mt-2 hidden w-64 -translate-x-1/2 rounded-md bg-charcoal-900 p-3 text-[11px] leading-relaxed font-normal text-white shadow-xl group-hover:block text-left">
            <p className="font-semibold text-gold-400">AI-Verified (Partially Approved)</p>
            <p className="mt-1">Your documents passed AI automated verification. Your profile is active with full platform access, however an admin will still conduct a final review.</p>
            <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-charcoal-900"></div>
          </div>
        </>
      )}
    </span>
  );
}
