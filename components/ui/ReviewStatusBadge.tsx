import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  PENDING: "border-gold-300 bg-gold-50 text-gold-800",
  APPROVED: "border-forest-200 bg-forest-50 text-forest-800",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
};

const dots: Record<string, string> = {
  PENDING: "bg-gold-500",
  APPROVED: "bg-forest-500",
  REJECTED: "bg-red-500",
};

const labels: Record<string, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function ReviewStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        styles[status] ?? styles.PENDING,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[status] ?? dots.PENDING)} />
      {labels[status] ?? status}
    </span>
  );
}
