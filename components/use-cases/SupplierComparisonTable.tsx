interface SupplierRow {
  supplier: string;
  country: string;
  sector: string;
  verified: "Verified" | "In review" | "Profile draft";
  esgFit: "Strong" | "Moderate" | "To assess";
  response: "Submitted" | "Shortlisted" | "Pending" | "Withdrawn";
}

const rows: SupplierRow[] = [
  {
    supplier: "ECONUDGE DRC",
    country: "DRC",
    sector: "Circular materials · waste",
    verified: "Verified",
    esgFit: "Strong",
    response: "Shortlisted",
  },
  {
    supplier: "Fictional supplier · NG-01",
    country: "Nigeria",
    sector: "Renewable energy · components",
    verified: "Verified",
    esgFit: "Strong",
    response: "Submitted",
  },
  {
    supplier: "Fictional supplier · KE-02",
    country: "Kenya",
    sector: "Agri-waste valorisation",
    verified: "In review",
    esgFit: "Moderate",
    response: "Submitted",
  },
  {
    supplier: "Fictional supplier · GH-03",
    country: "Ghana",
    sector: "Sustainable materials",
    verified: "Profile draft",
    esgFit: "To assess",
    response: "Pending",
  },
];

const verifiedTone: Record<SupplierRow["verified"], string> = {
  Verified: "bg-forest-50 text-forest-800 border-forest-200",
  "In review": "bg-gold-50 text-gold-800 border-gold-200",
  "Profile draft": "bg-cream-100 text-charcoal-600 border-cream-300",
};

const esgTone: Record<SupplierRow["esgFit"], string> = {
  Strong: "bg-forest-50 text-forest-800 border-forest-200",
  Moderate: "bg-gold-50 text-gold-800 border-gold-200",
  "To assess": "bg-cream-100 text-charcoal-600 border-cream-300",
};

const responseTone: Record<SupplierRow["response"], string> = {
  Shortlisted: "bg-gold-50 text-gold-800 border-gold-200",
  Submitted: "bg-blue-50 text-blue-800 border-blue-200",
  Pending: "bg-cream-100 text-charcoal-600 border-cream-300",
  Withdrawn: "bg-cream-100 text-charcoal-500 border-cream-300",
};

export function SupplierComparisonTable() {
  return (
    <div className="card overflow-hidden p-0">
      <header className="flex items-start justify-between gap-3 border-b border-cream-200 bg-cream-50 px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-700">
            Supplier comparison · prototype
          </p>
          <h3 className="mt-1 font-serif text-base text-forest-900">
            What the buyer sees after responses arrive
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-800">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          Fictional sample
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-cream-200 bg-cream-50/60 text-[10px] uppercase tracking-[0.16em] text-charcoal-500">
              <th scope="col" className="px-5 py-3 font-semibold">Supplier</th>
              <th scope="col" className="px-5 py-3 font-semibold">Country</th>
              <th scope="col" className="px-5 py-3 font-semibold">Sector</th>
              <th scope="col" className="px-5 py-3 font-semibold">Verification</th>
              <th scope="col" className="px-5 py-3 font-semibold">ESG fit</th>
              <th scope="col" className="px-5 py-3 font-semibold">Response</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.supplier} className="border-b border-cream-100 last:border-0">
                <td className="px-5 py-3 font-medium text-forest-900">{r.supplier}</td>
                <td className="px-5 py-3 text-charcoal-700">{r.country}</td>
                <td className="px-5 py-3 text-charcoal-700">{r.sector}</td>
                <td className="px-5 py-3">
                  <Tag tone={verifiedTone[r.verified]}>{r.verified}</Tag>
                </td>
                <td className="px-5 py-3">
                  <Tag tone={esgTone[r.esgFit]}>{r.esgFit}</Tag>
                </td>
                <td className="px-5 py-3">
                  <Tag tone={responseTone[r.response]}>{r.response}</Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-cream-200 bg-cream-50/60 px-5 py-3 text-[11px] text-charcoal-500">
        Suppliers labelled “Fictional” are illustrative placeholders. Real supplier discovery uses
        the live <span className="font-medium text-forest-900">Verified directory</span> and the
        <span className="font-medium text-forest-900"> RFP response</span> flow.
      </p>
    </div>
  );
}

function Tag({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}
