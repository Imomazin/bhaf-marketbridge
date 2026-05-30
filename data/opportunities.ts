export type OpportunityType = "Grant" | "Investment" | "Procurement" | "Programme" | "Certification" | "Government";

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  organisation: string;
  region: string;
  amount: string;
  deadline: string;
  description: string;
  eligibility: string[];
}

export const opportunities: Opportunity[] = [
  {
    id: "green-trade-grant",
    title: "Green Trade Accelerator Grant 2026",
    type: "Grant",
    organisation: "BHAF & Pan-African Trade Foundation",
    region: "Pan-African",
    amount: "$25,000 – $75,000",
    deadline: "30 June 2026",
    description:
      "Catalytic grants for women-led businesses scaling circular economy and clean trade ventures with measurable ESG outcomes.",
    eligibility: [
      "Women-owned or women-led business",
      "Operating in an African market",
      "Demonstrable ESG or circular economy practice",
    ],
  },
  {
    id: "corporate-supplier-call",
    title: "Corporate Supplier Inclusion Call — FMCG",
    type: "Procurement",
    organisation: "Consumer Goods Alliance",
    region: "West & Southern Africa",
    amount: "Multi-year supply contracts",
    deadline: "Rolling — quarterly cohorts",
    description:
      "Direct procurement pathway for women-led suppliers of food, packaging and personal care products into FMCG supply chains.",
    eligibility: [
      "Market-Ready or Funding-Ready readiness level",
      "Verified BHAF profile",
      "Capacity for purchase orders above $50,000",
    ],
  },
  {
    id: "early-stage-equity",
    title: "Catalyst Equity — Early Stage",
    type: "Investment",
    organisation: "Mosaic Impact Partners",
    region: "East & Southern Africa",
    amount: "$100,000 – $500,000 cheques",
    deadline: "Continuous intake",
    description:
      "Patient equity capital for women-led ventures with traction, addressing climate, livelihoods and gender outcomes.",
    eligibility: [
      "Post-revenue, 12+ months of trading",
      "Founding team includes women in operating control",
      "Theory of change linked to SDGs 5, 8 or 13",
    ],
  },
  {
    id: "esg-documentation-cohort",
    title: "ESG Documentation Cohort — Q3",
    type: "Programme",
    organisation: "BHAF SkillHubs",
    region: "Pan-African (remote)",
    amount: "Fully sponsored",
    deadline: "15 August 2026",
    description:
      "Eight-week guided programme to help entrepreneurs produce funder-ready ESG and impact documentation.",
    eligibility: [
      "Active entrepreneur on BHAF MarketBridge",
      "Commit to weekly cohort sessions",
      "Profile at Developing readiness or above",
    ],
  },
  {
    id: "market-access-uk",
    title: "UK Retail Buyer Roadshow",
    type: "Procurement",
    organisation: "BHAF & UK Trade Network",
    region: "United Kingdom",
    amount: "Buyer introductions + listing support",
    deadline: "30 September 2026",
    description:
      "Curated buyer meetings with UK independent retailers and department store buyers for premium African brands.",
    eligibility: [
      "Market Access Readiness Certificate or in progress",
      "Export pricing prepared",
      "Stable production capacity",
    ],
  },
  {
    id: "circular-trader-certification",
    title: "Circular Economy Trader Certificate",
    type: "Certification",
    organisation: "BHAF SkillHubs",
    region: "Online",
    amount: "Subsidised — $90 per entrepreneur",
    deadline: "Rolling enrolment",
    description:
      "Certification pathway for businesses practising circular sourcing, waste reduction and regenerative production.",
    eligibility: [
      "Documented circular practice",
      "Willingness to publish case study",
      "Six-month follow-up reporting",
    ],
  },
  // ─── Government & multilateral funding ───────────────────────
  {
    id: "afdb-afawa",
    title: "AFAWA — Affirmative Finance Action for Women in Africa",
    type: "Government",
    organisation: "African Development Bank",
    region: "Pan-African",
    amount: "Up to $25M per partner financial institution; SME sub-loans $5k–$1M",
    deadline: "Rolling — channelled through accredited FIs",
    description:
      "Continent-wide initiative unlocking $5B for women entrepreneurs through guarantees, technical assistance and lender capacity-building. The flagship multilateral programme for African women-led SMEs.",
    eligibility: [
      "Women-owned or women-led African SME",
      "Operating in an AfDB regional member country",
      "Routed through accredited local banks / MFIs",
    ],
  },
  {
    id: "ng-boi-women",
    title: "BoI Gender Business Programme",
    type: "Government",
    organisation: "Bank of Industry — Federal Republic of Nigeria",
    region: "Nigeria",
    amount: "₦5M – ₦50M concessional loans (single-digit interest)",
    deadline: "Rolling intake",
    description:
      "Concessional SME financing for women-owned businesses in agro-processing, fashion, technology and renewable energy. Borrowers get matched with BHAF readiness support.",
    eligibility: [
      "CAC-registered women-owned business",
      "Operating ≥ 1 year with verifiable trading history",
      "Sector aligned to BoI priority list",
    ],
  },
  {
    id: "ng-dbn-msme",
    title: "DBN Women-led MSME Wholesale Facility",
    type: "Government",
    organisation: "Development Bank of Nigeria",
    region: "Nigeria",
    amount: "Up to ₦100M; tenors up to 10 years",
    deadline: "Through accredited Participating Financial Institutions",
    description:
      "Long-tenor wholesale credit on-lent through PFIs to women-owned MSMEs across Nigeria. Especially strong fit for funding-ready entrepreneurs needing patient capital.",
    eligibility: [
      "Women-owned MSME",
      "Registered with CAC and FIRS",
      "Bankable proposal aligned with PFI risk policy",
    ],
  },
  {
    id: "ng-fmwa-grant",
    title: "Federal Ministry of Women Affairs — Women Enterprise Grant",
    type: "Government",
    organisation: "Federal Ministry of Women Affairs · Nigeria",
    region: "Nigeria",
    amount: "₦500k – ₦5M grant",
    deadline: "Cohort-based — quarterly windows",
    description:
      "Direct grants for early-stage women entrepreneurs in priority sectors. Cohorts include training, mentorship and onward referral to BoI / DBN financing.",
    eligibility: [
      "Nigerian woman entrepreneur",
      "Business < 3 years old",
      "Commit to monthly impact reporting",
    ],
  },
  {
    id: "ke-wef",
    title: "Women Enterprise Fund (WEF)",
    type: "Government",
    organisation: "Government of Kenya",
    region: "Kenya",
    amount: "KES 50k – KES 5M loans + business development services",
    deadline: "Rolling intake at county offices",
    description:
      "Flagship Kenyan government fund providing affordable credit, capacity-building and market access support exclusively to women entrepreneurs.",
    eligibility: [
      "Kenyan woman aged 18+",
      "Registered business group or individual enterprise",
      "Demonstrable economic activity",
    ],
  },
  {
    id: "gh-neip",
    title: "National Entrepreneurship & Innovation Programme (NEIP)",
    type: "Government",
    organisation: "Government of Ghana",
    region: "Ghana",
    amount: "GHS 50k – GHS 500k seed funding + mentorship",
    deadline: "Quarterly cohorts",
    description:
      "Government-backed accelerator providing seed capital, mentorship and incubation to Ghanaian startups, with a dedicated women entrepreneurship track.",
    eligibility: [
      "Ghanaian-registered business",
      "Innovation- or technology-led",
      "Founder-led with clear traction",
    ],
  },
  {
    id: "gh-masloc",
    title: "MASLOC — Microfinance and Small Loans Centre",
    type: "Government",
    organisation: "Government of Ghana",
    region: "Ghana",
    amount: "GHS 1k – GHS 100k microfinance + small business loans",
    deadline: "Rolling intake at MASLOC offices",
    description:
      "Concessional microfinance for women-led micro- and small enterprises across Ghana, with group-lending products for cooperatives.",
    eligibility: [
      "Ghanaian woman entrepreneur",
      "Trading or producing for ≥ 6 months",
      "Acceptable group guarantor or collateral",
    ],
  },
  {
    id: "cd-femec",
    title: "FEMEC — Femmes Entrepreneures dans l'Économie Circulaire",
    type: "Government",
    organisation: "BHAF · DRC Ministry of Gender · UNDP",
    region: "DRC",
    amount: "Cohort grant + technical assistance",
    deadline: "Annual cohort enrolment",
    description:
      "Joint BHAF–government cohort building a circular-economy network of women entrepreneurs across Kinshasa, Lubumbashi and Goma.",
    eligibility: [
      "Congolese woman entrepreneur",
      "Demonstrable circular-economy practice",
      "Commitment to programme reporting",
    ],
  },
  {
    id: "sn-derfj",
    title: "DER/FJ — Délégation à l'Entrepreneuriat Rapide",
    type: "Government",
    organisation: "Government of Senegal",
    region: "Senegal",
    amount: "XOF 500k – XOF 50M financing + advisory",
    deadline: "Continuous intake",
    description:
      "Senegalese government rapid-entrepreneurship fund with a strong women's enterprise component, covering financing, advisory and market access.",
    eligibility: [
      "Senegalese woman entrepreneur",
      "Registered business",
      "Sector aligned to DER priorities",
    ],
  },
  {
    id: "za-sefa",
    title: "SEFA — Small Enterprise Finance Agency",
    type: "Government",
    organisation: "Government of South Africa",
    region: "South Africa",
    amount: "ZAR 50k – ZAR 5M direct + on-lending facilities",
    deadline: "Rolling intake",
    description:
      "South African DFI providing finance, business support and value-added services to small enterprises, with dedicated women- and youth-owned business products.",
    eligibility: [
      "South African woman-owned SME",
      "CIPC-registered with tax clearance",
      "Bankable proposal",
    ],
  },
  {
    id: "rw-bdf",
    title: "BDF Women & Youth Enterprise Window",
    type: "Government",
    organisation: "Business Development Fund · Rwanda",
    region: "Rwanda",
    amount: "RWF 5M – RWF 500M guarantees and matching grants",
    deadline: "Rolling — through commercial bank partners",
    description:
      "Rwandan government de-risking facility providing credit guarantees and matching grants for women-led and youth-led enterprises.",
    eligibility: [
      "Rwandan-registered enterprise",
      "Bank-approved loan application",
      "Sector aligned with NST1 priorities",
    ],
  },
  {
    id: "ecowas-gender",
    title: "ECOWAS Gender Development Centre — Programme Funding",
    type: "Government",
    organisation: "ECOWAS Gender Development Centre",
    region: "West Africa",
    amount: "Cohort-level programme grants",
    deadline: "Annual windows",
    description:
      "Regional grant funding for women's enterprise development programmes across ECOWAS member states. Strong fit for BHAF programme partnerships, not direct entrepreneur grants.",
    eligibility: [
      "Programme implementer operating in ≥ 2 ECOWAS countries",
      "Documented women-empowerment outcomes",
      "Partnership with a national gender ministry",
    ],
  },
];
