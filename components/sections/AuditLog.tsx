import type { AuditEntry } from "@/data/artefacts";

interface AuditLogProps {
  entries: AuditEntry[];
}

export function AuditLog({ entries }: AuditLogProps) {
  return (
    <section className="rounded-2xl border border-forest-200 bg-forest-50 p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-forest-200/60 pb-3">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Tamper-evident audit log
          </p>
          <span className="gold-rule" />
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-forest-700">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-forest-600 opacity-50" />
              <span className="h-1.5 w-1.5 rounded-full bg-forest-700" />
            </span>
            Live · streaming
          </span>
          <button className="font-medium text-forest-800 underline-offset-2 hover:underline">
            Export for auditor
          </button>
        </div>
      </header>

      <ol className="mt-4 space-y-3">
        {entries.map((e, idx) => (
          <li key={idx} className="grid gap-1 border-l-2 border-gold-300 pl-3 text-xs sm:grid-cols-[160px_1fr]">
            <p className="font-mono text-[10px] text-charcoal-500">{e.ts}</p>
            <div>
              <p className="text-forest-900">
                <span className="font-semibold">{e.actor}</span> · {e.action}
              </p>
              {e.hash && (
                <p className="mt-0.5 font-mono text-[10px] text-charcoal-500">
                  hash {e.hash.slice(0, 10)}…{e.hash.slice(-6)}
                  {e.resultHash && (
                    <>
                      {" "}
                      → result {e.resultHash.slice(0, 10)}…{e.resultHash.slice(-6)}
                    </>
                  )}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <footer className="mt-5 border-t border-forest-200/60 pt-3 text-[10px] text-charcoal-500">
        Audit entries are append-only and chained by SHA-256. Auditors can export a signed pack from any
        timestamp range. Backed by ISO 27001-aligned controls.
      </footer>
    </section>
  );
}
