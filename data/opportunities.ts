export type OpportunityType = "Grant" | "Investment" | "Procurement" | "Programme" | "Certification";

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
];
