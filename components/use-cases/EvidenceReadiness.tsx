interface EvidenceItem {
  label: string;
  state: "Validated" | "Uploaded" | "Pending" | "To request";
  hint?: string;
}

const items: EvidenceItem[] = [
  { label: "Business profile", state: "Validated", hint: "Sector · region · stage" },
  { label: "Business registration", state: "Uploaded", hint: "Awaiting validation" },
  { label: "Financial statements", state: "Pending", hint: "Last 2 reporting cycles" },
  { label: "Audit documents", state: "To request", hint: "From auditor" },
  { label: "ESG / impact evidence", state: "Uploaded", hint: "Self-disclosure + artefacts" },
  { label: "Impact summary", state: "Validated", hint: "Generated from cohort + profile" },
];

const tone: Record<EvidenceItem["state"], { chip: string; dot: string }> = {
  Validated: {
    chip: "border-forest-200 bg-forest-50 text-forest-800",
    dot: "bg-forest-600",
  },
  Uploaded: {
    chip: "border-blue-200 bg-blue-50 text-blue-800",
    dot: "bg-blue-600",
  },
  Pending: {
    chip: "border-gold-200 bg-gold-50 text-gold-800",
    dot: "bg-gold-500",
  },
  "To request": {
    chip: "border-cream-300 bg-cream-100 text-charcoal-700",
    dot: "bg-charcoal-400",
  },
};

export function EvidenceReadiness() {
  return (
    <div className="card p-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
            Evidence readiness · prototype
          </p>
          <h3 className="mt-1 font-serif text-base text-forest-900">
            What sits in the funder data room
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-800">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blue-700" />
          Controlled access
        </span>
      </header>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => {
          const t = tone[i.state];
          return (
            <li
              key={i.label}
              className="rounded-xl border border-cream-200 bg-white p-4 shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-forest-900">{i.label}</p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${t.chip}`}
                >
                  <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                  {i.state}
                </span>
              </div>
              {i.hint && <p className="mt-1 text-[11px] text-charcoal-500">{i.hint}</p>}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[11px] text-charcoal-500">
        States above are prototype labels. In the live product, each artefact follows the standard
        validation pipeline (SHA-256 hash, MIME check, AV scan, BHAF sign-off) and is recorded in
        the tamper-evident audit log.
      </p>
    </div>
  );
}
