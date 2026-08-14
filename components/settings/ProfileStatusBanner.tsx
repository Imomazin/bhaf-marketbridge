import { cn } from "@/lib/utils";

const statusCopy: Record<string, { label: string; tone: string; blurb: string }> = {
  PENDING: {
    label: "Pending review",
    tone: "border-gold-200 bg-gold-50 text-gold-800",
    blurb: "BHAF is reviewing this profile. It isn't visible on the network yet.",
  },
  APPROVED: {
    label: "Approved",
    tone: "border-forest-200 bg-forest-50 text-forest-800",
    blurb: "This profile is approved and visible across the MarketBridge network.",
  },
  REJECTED: {
    label: "Changes needed",
    tone: "border-red-200 bg-red-50 text-red-700",
    blurb: "BHAF reviewed this profile and it wasn't approved. Update the details below and save to resubmit for review.",
  },
};

export function ProfileStatusBanner({ status, rejectionReason }: { status: string; rejectionReason?: string | null }) {
  const copy = statusCopy[status] ?? statusCopy.PENDING;
  return (
    <div className={cn("mb-4 rounded-md border px-4 py-3 text-xs", copy.tone)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider">{copy.label}</p>
      <p className="mt-1">{copy.blurb}</p>
      {status === "REJECTED" && rejectionReason && (
        <p className="mt-2 rounded bg-white/60 px-2 py-1.5 text-charcoal-700">
          <span className="font-semibold">Reason: </span>
          {rejectionReason}
        </p>
      )}
    </div>
  );
}
