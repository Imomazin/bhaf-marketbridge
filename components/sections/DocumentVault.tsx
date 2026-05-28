import type { Artefact } from "@/data/artefacts";
import { ArtefactCard } from "@/components/ui/ArtefactCard";
import { UploadDropzone } from "@/components/ui/UploadDropzone";
import { RealUploadDropzone } from "@/components/ui/RealUploadDropzone";
import { DB_ENABLED } from "@/lib/db";

interface DocumentVaultProps {
  artefacts: Artefact[];
  title?: string;
  intro?: string;
}

export function DocumentVault({
  artefacts,
  title = "Document vault",
  intro = "Every artefact is hashed, validated and routed through BHAF's verification queue. Required items must be Validated before your profile becomes visible to funders and buyers.",
}: DocumentVaultProps) {
  // Group by category preserving order of first appearance
  const grouped = artefacts.reduce<Record<string, Artefact[]>>((acc, a) => {
    (acc[a.category] = acc[a.category] || []).push(a);
    return acc;
  }, {});

  const requiredTotal = artefacts.filter((a) => a.required).length;
  const requiredValidated = artefacts.filter((a) => a.required && a.status === "validated").length;
  const completion = requiredTotal === 0 ? 100 : Math.round((requiredValidated / requiredTotal) * 100);

  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-cream-200 pb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Quality assurance
          </p>
          <h2 className="mt-1 font-serif text-2xl text-forest-900">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-charcoal-500">{intro}</p>
        </div>
        <div className="w-full max-w-xs">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-forest-900">Required artefacts</span>
            <span className="text-charcoal-500">
              {requiredValidated} of {requiredTotal} validated
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-gold-400 transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-charcoal-400">
            Profile authentication unlocks when all required artefacts are Validated.
          </p>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="font-serif text-sm uppercase tracking-[0.14em] text-forest-800">{category}</h3>
                <span className="gold-rule" />
              </div>
              <div className="grid gap-3">
                {items.map((a) => (
                  <ArtefactCard key={a.id} artefact={a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {DB_ENABLED ? <RealUploadDropzone /> : <UploadDropzone />}
          <div className="rounded-2xl border border-cream-200 bg-cream-50 p-5 text-xs text-charcoal-600">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
              How validation works
            </p>
            <ol className="mt-3 space-y-2">
              {[
                "Upload triggers SHA-256 hashing + AV scan.",
                "Automated checks (format, metadata, sanctions) run in seconds.",
                "Sensitive items route for dual sign-off (4-eyes principle).",
                "Validated artefacts unlock visibility tiers and audit-ready evidence.",
                "Every step is written to the tamper-evident audit log.",
              ].map((line, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-forest-800 text-[9px] font-bold text-cream-50">
                    {idx + 1}
                  </span>
                  {line}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
