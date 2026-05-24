import type { Artefact, ArtefactCheck } from "@/data/artefacts";
import { ArtefactStatusBadge } from "./ArtefactStatusBadge";
import { cn } from "@/lib/utils";

const checkTone: Record<ArtefactCheck["status"], { dot: string; mark: string; text: string }> = {
  pass: { dot: "bg-forest-600", mark: "✓", text: "text-forest-800" },
  fail: { dot: "bg-red-500", mark: "✕", text: "text-red-700" },
  warn: { dot: "bg-gold-500", mark: "!", text: "text-gold-800" },
  pending: { dot: "bg-charcoal-300", mark: "•", text: "text-charcoal-500" },
};

interface ArtefactCardProps {
  artefact: Artefact;
}

export function ArtefactCard({ artefact: a }: ArtefactCardProps) {
  const isPendingUpload = a.status === "pending_upload";

  return (
    <article
      className={cn(
        "rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-card",
        a.status === "rejected" && "border-red-200",
        a.status === "expires_soon" && "border-gold-200",
        a.status === "validated" && "border-forest-200",
        ![
          "rejected",
          "expires_soon",
          "validated",
        ].includes(a.status) && "border-cream-200",
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-serif text-sm font-semibold text-forest-900">{a.name}</h4>
            {a.required && (
              <span className="rounded-full bg-cream-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-charcoal-500">
                Required
              </span>
            )}
            {a.requiresDualSignOff && (
              <span className="rounded-full bg-gold-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-800">
                Dual sign-off
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-charcoal-500">{a.description}</p>
        </div>
        <ArtefactStatusBadge status={a.status} pulse />
      </header>

      {!isPendingUpload && (
        <div className="mt-4 grid gap-3 border-t border-cream-200 pt-3 text-[11px] sm:grid-cols-2">
          {a.fileName && (
            <div>
              <p className="text-charcoal-400">File</p>
              <p className="font-mono text-forest-900">
                {a.fileName} · <span className="text-charcoal-500">{a.fileSize}</span>
              </p>
            </div>
          )}
          {a.uploadedAt && (
            <div>
              <p className="text-charcoal-400">Uploaded</p>
              <p className="text-forest-900">{a.uploadedAt}</p>
            </div>
          )}
          {a.validatedAt && (
            <div>
              <p className="text-charcoal-400">Validated</p>
              <p className="text-forest-900">
                {a.validatedAt}
                {a.reviewedBy && <span className="text-charcoal-500"> · by {a.reviewedBy}</span>}
              </p>
            </div>
          )}
          {a.expiresAt && (
            <div>
              <p className="text-charcoal-400">Expires</p>
              <p
                className={cn(
                  "text-forest-900",
                  a.status === "expires_soon" && "text-gold-800",
                  a.status === "expired" && "text-red-700",
                )}
              >
                {a.expiresAt}
              </p>
            </div>
          )}
          {a.hash && (
            <div className="sm:col-span-2">
              <p className="text-charcoal-400">Tamper-evident hash</p>
              <p className="font-mono text-[10px] text-forest-900 break-all">
                {a.hash.slice(0, 12)}…{a.hash.slice(-8)}
              </p>
            </div>
          )}
        </div>
      )}

      {a.checks.length > 0 && (
        <div className="mt-4 border-t border-cream-200 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400">
            Automated checks
          </p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {a.checks.map((c) => {
              const tone = checkTone[c.status];
              return (
                <li key={c.name} className="flex items-start gap-2 text-[11px]">
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-cream-50",
                      tone.dot,
                    )}
                  >
                    {tone.mark}
                  </span>
                  <div className="min-w-0">
                    <p className={cn("font-medium", tone.text)}>{c.name}</p>
                    {c.detail && <p className="text-charcoal-500">{c.detail}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {a.rejectionReason && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[11px] text-red-800">
          <p className="font-semibold uppercase tracking-wider">Rejection reason</p>
          <p className="mt-1">{a.rejectionReason}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {isPendingUpload ? (
          <button className="btn-primary !py-2 !px-3 text-xs">Upload document</button>
        ) : a.status === "rejected" ? (
          <button className="btn-gold !py-2 !px-3 text-xs">Re-upload corrected version</button>
        ) : a.status === "expires_soon" || a.status === "expired" ? (
          <button className="btn-gold !py-2 !px-3 text-xs">Renew & re-upload</button>
        ) : (
          <>
            <button className="btn-secondary !py-2 !px-3 text-xs">View document</button>
            <button className="rounded-md px-3 py-2 text-xs font-medium text-charcoal-500 hover:text-forest-900">
              Replace
            </button>
          </>
        )}
      </div>
    </article>
  );
}
