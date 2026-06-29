import { blandine } from "@/data/use-cases";

export function EntrepreneurProfileCard() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
      {/* Profile summary */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-700">
              Entrepreneur profile · Prototype
            </p>
            <h3 className="mt-2 font-serif text-xl text-forest-900">{blandine.name}</h3>
            <p className="text-sm text-charcoal-600">{blandine.business}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-forest-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest-800">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-forest-700" />
              {blandine.stage}
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-charcoal-500">
              {blandine.region} · {blandine.country}
            </span>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
          <Field label="Sector" value={blandine.sector} />
          <Field label="Languages" value={blandine.languages.join(" · ")} />
          <Field label="Product listing" value={blandine.productListing} />
          <Field label="Impact theme" value={blandine.impactThemes.join(" · ")} />
        </dl>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
            Bio
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal-700">{blandine.bio}</p>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
            Vision
          </p>
          <p className="mt-1.5 text-[13px] italic leading-relaxed text-charcoal-700">
            “{blandine.vision}”
          </p>
        </div>
      </div>

      {/* Activities + Verification */}
      <div className="space-y-5">
        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-700">
            Verified evidence · prototype
          </p>
          <ul className="mt-3 space-y-2">
            {blandine.evidenceList.map((e) => (
              <li
                key={e}
                className="flex items-center justify-between gap-3 rounded-lg border border-forest-100 bg-forest-50/40 px-3 py-2 text-[12px]"
              >
                <span className="font-medium text-forest-900">{e}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest-700 ring-1 ring-forest-200">
                  Uploaded · pending validation
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-charcoal-500">
            Additional artefacts (tax certificate, KYC, ESG evidence) can be added through the
            standard MarketBridge validation pipeline.
          </p>
        </div>

        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-700">
            Activities (2025)
          </p>
          <ul className="mt-3 space-y-2 text-[13px] text-charcoal-700">
            {blandine.activities.map((a) => (
              <li key={a} className="flex items-start gap-2">
                <span aria-hidden className="gold-dot mt-1.5" />
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest-700">
            Core competencies
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {blandine.competencies.map((c) => (
              <li
                key={c}
                className="inline-flex rounded-full border border-cream-200 bg-cream-50 px-2.5 py-1 text-[11px] font-medium text-charcoal-700"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold uppercase tracking-wide text-charcoal-500">{label}</dt>
      <dd className="mt-0.5 text-charcoal-700">{value}</dd>
    </div>
  );
}
