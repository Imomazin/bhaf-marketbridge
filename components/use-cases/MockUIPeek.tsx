/**
 * Inline HTML/SVG mock UIs that visually represent the real MarketBridge
 * surfaces without screenshotting the live app. Each peek includes
 * annotation callouts so the audience reads what the platform exposes.
 *
 * Three variants — one per use case.
 */

interface PeekProps {
  variant: "entrepreneur" | "buyer" | "funder";
}

export function MockUIPeek({ variant }: PeekProps) {
  if (variant === "entrepreneur") return <EntrepreneurPeek />;
  if (variant === "buyer") return <BuyerPeek />;
  return <FunderPeek />;
}

function PeekFrame({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-cream-200 bg-cream-50 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-charcoal-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-charcoal-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-charcoal-200" />
        </span>
        <span className="ml-2 truncate font-mono text-[10px] text-charcoal-500">
          marketbridge.bhaf · {title}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-gold-200 bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-800">
          <span aria-hidden className="h-1 w-1 rounded-full bg-gold-500" />
          Mock UI · for demo
        </span>
      </div>
      <div className="p-5">{children}</div>
      <p className="border-t border-cream-200 bg-cream-50/60 px-4 py-2 text-[11px] text-charcoal-500">
        {caption}
      </p>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute inline-flex items-center gap-1 rounded-md border border-gold-300 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-gold-800 shadow-soft">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
      {children}
    </span>
  );
}

/* ───────────────────────── ENTREPRENEUR PEEK ───────────────────────── */

function EntrepreneurPeek() {
  return (
    <PeekFrame
      title="/directory/blandine-bishengezi"
      caption="What buyers, funders and developers see when Blandine's profile is opened."
    >
      <div className="relative">
        {/* header */}
        <div className="flex items-start gap-4">
          <div
            aria-hidden
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-forest-700 to-forest-500 font-serif text-lg text-cream-50"
          >
            BB
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg text-forest-900">Blandine BISHENGEZI</p>
            <p className="text-[11px] text-charcoal-500">
              Centre de Recyclage KAHYA · Bukavu, DRC
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-forest-200 bg-forest-50 px-2 py-0.5 text-[10px] font-semibold text-forest-800">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                Verified profile
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-gold-200 bg-gold-50 px-2 py-0.5 text-[10px] font-semibold text-gold-800">
                Growth stage
              </span>
            </div>
          </div>
        </div>

        {/* callout on verified badge */}
        <Callout>← Verified badge</Callout>

        <div className="mt-5 grid gap-3 sm:grid-cols-3 text-[11px]">
          <Cell label="Sector" value="Eco-fashion · Upcycling" />
          <Cell label="Stage" value="Growth · funding-ready signal" />
          <Cell label="Impact" value="Textile waste · women trained" />
        </div>

        {/* listing row */}
        <div className="mt-5 rounded-lg border border-cream-200 bg-cream-50/60 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-forest-900">Textile craft listing</p>
              <p className="text-[10px] text-charcoal-500">Published · 1 product</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-forest-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-forest-700">
              Live
            </span>
          </div>
        </div>

        {/* artefact row */}
        <div className="mt-3 rounded-lg border border-cream-200 bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-500">
            Artefact vault
          </p>
          <ul className="mt-2 space-y-1.5 text-[11px]">
            <li className="flex items-center justify-between">
              <span className="text-forest-900">Business registration · KAHYA</span>
              <span className="rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-semibold text-forest-700">
                Validated
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-charcoal-500">Tax certificate</span>
              <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-semibold text-gold-800">
                Pending
              </span>
            </li>
          </ul>
        </div>
      </div>
    </PeekFrame>
  );
}

/* ───────────────────────────── BUYER PEEK ───────────────────────────── */

function BuyerPeek() {
  return (
    <PeekFrame
      title="/portal/corporate/rfps/rfp-87f3"
      caption="What the buyer sees after responses arrive — uniform structure across suppliers."
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-700">
            RFP-87f3 · Open
          </p>
          <p className="mt-1 font-serif text-lg text-forest-900">
            Circular materials suppliers — RE supply chain
          </p>
          <p className="text-[11px] text-charcoal-500">
            Buyer: European public-sector RE buyer (fictional) · Deadline in 18 days
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-gold-300 bg-gold-50 px-2 py-0.5 text-[10px] font-semibold text-gold-800">
          4 responses
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-cream-200">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-cream-50 text-[9px] uppercase tracking-[0.14em] text-charcoal-500">
            <tr>
              <th scope="col" className="px-3 py-2">Supplier</th>
              <th scope="col" className="px-3 py-2">Verified</th>
              <th scope="col" className="px-3 py-2">ESG</th>
              <th scope="col" className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-cream-100">
              <td className="px-3 py-2 font-medium text-forest-900">ECONUDGE DRC</td>
              <td className="px-3 py-2">
                <Pill tone="forest">Verified</Pill>
              </td>
              <td className="px-3 py-2">
                <Pill tone="forest">Strong</Pill>
              </td>
              <td className="px-3 py-2">
                <Pill tone="gold">Shortlist</Pill>
              </td>
            </tr>
            <tr className="border-t border-cream-100">
              <td className="px-3 py-2 font-medium text-forest-900">Fictional · NG-01</td>
              <td className="px-3 py-2">
                <Pill tone="forest">Verified</Pill>
              </td>
              <td className="px-3 py-2">
                <Pill tone="forest">Strong</Pill>
              </td>
              <td className="px-3 py-2">
                <Pill tone="charcoal">Review</Pill>
              </td>
            </tr>
            <tr className="border-t border-cream-100">
              <td className="px-3 py-2 font-medium text-forest-900">Fictional · KE-02</td>
              <td className="px-3 py-2">
                <Pill tone="gold">In review</Pill>
              </td>
              <td className="px-3 py-2">
                <Pill tone="gold">Moderate</Pill>
              </td>
              <td className="px-3 py-2">
                <Pill tone="charcoal">Review</Pill>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[10px] text-charcoal-500">
        Reviewing each response uses the same fields — capacity statement, prior projects, ESG
        disclosure, supporting documents.
      </p>
    </PeekFrame>
  );
}

/* ───────────────────────────── FUNDER PEEK ───────────────────────────── */

function FunderPeek() {
  return (
    <PeekFrame
      title="/data-rooms/dr-92a1"
      caption="A controlled data room with verified evidence and tamper-evident audit log."
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">
            Data room · Restricted · Access expires in 14 days
          </p>
          <p className="mt-1 font-serif text-lg text-forest-900">
            GreenWeave Textiles — Series A diligence
          </p>
          <p className="text-[11px] text-charcoal-500">
            Owner: entrepreneur · 1 funder granted (VIEW)
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-800">
          6 artefacts
        </span>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {[
          { name: "Audited accounts FY24", state: "Validated", tone: "forest" as const },
          { name: "Business registration", state: "Validated", tone: "forest" as const },
          { name: "ESG disclosure pack", state: "Uploaded", tone: "blue" as const },
          { name: "Impact summary", state: "Validated", tone: "forest" as const },
          { name: "Cap table", state: "Pending", tone: "gold" as const },
          { name: "Insurance certificate", state: "Validated", tone: "forest" as const },
        ].map((a) => (
          <div
            key={a.name}
            className="flex items-center justify-between gap-2 rounded-md border border-cream-200 bg-cream-50/60 px-3 py-2 text-[11px]"
          >
            <span className="truncate text-forest-900">{a.name}</span>
            <Pill tone={a.tone}>{a.state}</Pill>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-cream-200 bg-white p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-500">
          Audit log · last 3
        </p>
        <ul className="mt-2 space-y-1 font-mono text-[10px] text-charcoal-700">
          <li className="truncate">
            <span className="text-gold-700">12:42</span> · funder@mosaic.example · VIEW · audited-accounts.pdf
          </li>
          <li className="truncate">
            <span className="text-gold-700">12:38</span> · admin@bhaf · GRANT_ACCESS · funder@mosaic.example
          </li>
          <li className="truncate">
            <span className="text-gold-700">12:31</span> · entrepreneur · UPLOAD · impact-summary.pdf
          </li>
        </ul>
      </div>
    </PeekFrame>
  );
}

/* ────────────────────────────── ATOMS ────────────────────────────── */

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-cream-200 bg-cream-50/60 px-2 py-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-charcoal-500">
        {label}
      </p>
      <p className="mt-0.5 truncate text-[11px] font-medium text-forest-900">{value}</p>
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "forest" | "gold" | "blue" | "charcoal";
  children: React.ReactNode;
}) {
  const map: Record<string, string> = {
    forest: "bg-forest-50 text-forest-700 border-forest-200",
    gold: "bg-gold-50 text-gold-800 border-gold-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    charcoal: "bg-cream-100 text-charcoal-600 border-cream-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${map[tone]}`}
    >
      {children}
    </span>
  );
}
