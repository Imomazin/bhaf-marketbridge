/**
 * Static content for the /use-cases section. These are illustrative
 * prototype scenarios — not delivery claims — used to demonstrate how
 * MarketBridge can create value when deployed with BHAF and its
 * ecosystem partners.
 *
 * Every metric is a prototype label. Replace with real client data only
 * once it has been confirmed and consented to.
 */

export type Stakeholder = "Entrepreneur" | "Buyer" | "Funder";

export interface JourneyStep {
  label: string;
  detail: string;
}

export interface FeatureUsed {
  name: string;
  href?: string;
}

export interface PrototypeMetric {
  label: string;
  value: string; // always a prototype label, e.g. "Profile completed", "To be populated"
}

export interface UseCase {
  slug: string;
  number: number;
  title: string;
  stakeholder: Stakeholder;
  region: string;
  sector: string;
  painPoint: string;
  intervention: string;
  expectedValue: string;
  headlineMetric: string;
  badge: string;
  accent: "forest" | "gold" | "navy"; // visual differentiation
  challenge: string;
  scenario: string;
  journey: JourneyStep[];
  featuresUsed: FeatureUsed[];
  expectedValuesList: string[];
  suggestedMetrics: PrototypeMetric[];
  audienceMoment: string;
  cta: { label: string; href: string };
}

export const PROTOTYPE_DISCLAIMER_LONG =
  "These use cases are illustrative MVP scenarios showing how MarketBridge can create value when deployed with ecosystem partners. They should not be read as completed delivery claims.";

export const PROTOTYPE_DISCLAIMER_SHORT = "Prototype scenario, for demonstration purposes.";

export const useCases: UseCase[] = [
  {
    slug: "entrepreneur-market-access",
    number: 1,
    title: "Entrepreneur Verification and Market Access",
    stakeholder: "Entrepreneur",
    region: "Bukavu, DRC",
    sector: "Eco-fashion · Textile upcycling · Circular economy",
    painPoint:
      "Growth-stage women-led ventures lack structured visibility, verified credibility and a market-ready evidence base — limiting buyer, partner and investor access.",
    intervention:
      "MarketBridge structures the entrepreneur profile, validates registration evidence, publishes a listing and surfaces the venture to buyers, developers and funders.",
    expectedValue:
      "Visibility, verification, buyer access, funding readiness and stronger investor confidence.",
    headlineMetric: "Profile readiness pathway",
    badge: "Entrepreneur · DRC",
    accent: "forest",
    challenge:
      "Blandine BISHENGEZI runs Centre de Recyclage KAHYA from home, transforming textile waste into eco-responsible clothing, accessories and decorative items. To scale she needs a workshop and showroom, stronger credibility with investors, and structured visibility for buyers and developer partners — especially developers who can help her build a textile-waste traceability app to evidence environmental impact.",
    scenario:
      "Blandine creates a MarketBridge profile, uploads her business registration document, publishes a textile-craft listing and tells her impact story. Her profile becomes discoverable to buyers, funders, developers and ecosystem partners. The demo closes with a simulated enquiry — illustrating how a verified, structured profile can convert informal potential into investible opportunity.",
    journey: [
      {
        label: "Profile created",
        detail: "Entrepreneur signs up on MarketBridge and selects the entrepreneur role.",
      },
      {
        label: "Registration uploaded",
        detail: "Business registration document is uploaded to the artefact vault for validation.",
      },
      {
        label: "Profile structured",
        detail:
          "Profile organised around sector, location, stage, product portfolio and ESG impact narrative.",
      },
      {
        label: "Listing published",
        detail: "Textile craft listing goes live on the marketplace with ESG highlights and tags.",
      },
      {
        label: "Impact story added",
        detail:
          "Narrative captures textile-waste reduction and women's empowerment through training workshops.",
      },
      {
        label: "Visibility unlocked",
        detail:
          "Profile is surfaced to buyers, funders, developers and ecosystem partners by sector and region.",
      },
      {
        label: "Enquiry simulated",
        detail:
          "A buyer, developer or investor enquiry is simulated to demonstrate the conversion moment.",
      },
    ],
    featuresUsed: [
      { name: "Sign-up wizard", href: "/auth/sign-up" },
      { name: "Artefact vault & validation", href: "/portal/entrepreneur" },
      { name: "Marketplace listings", href: "/marketplace" },
      { name: "Verified directory", href: "/directory" },
      { name: "Messaging", href: "/messages" },
    ],
    expectedValuesList: [
      "Greater visibility to buyers, funders and developers",
      "Stronger credibility through verified evidence",
      "Funding readiness strengthened (not investment received)",
      "Developer access for traceability-app collaboration",
      "Clearer environmental-impact narrative",
      "Investment interest simulated as the demo moment",
    ],
    suggestedMetrics: [
      { label: "Profile", value: "Profile completed" },
      { label: "Verification", value: "Business registration uploaded" },
      { label: "Listing", value: "Textile craft published" },
      { label: "Impact theme", value: "Textile waste · Women trained" },
      { label: "Enquiry", value: "Buyer / investor enquiry simulated" },
      { label: "Developer", value: "Developer interest simulated" },
    ],
    audienceMoment:
      "A clear journey from an informal but promising growth-stage entrepreneur to a structured, verified, visible and funding-ready enterprise profile.",
    cta: { label: "See how an entrepreneur joins", href: "/auth/sign-up" },
  },
  {
    slug: "corporate-rfp-supplier-discovery",
    number: 2,
    title: "Corporate RFP and Women-Led Supplier Discovery",
    stakeholder: "Buyer",
    region: "Europe-facing procurement · African supplier pool",
    sector: "Renewable energy · Waste · Circular economy · Sustainable materials",
    painPoint:
      "Public-sector and corporate buyers struggle to discover verified women-led suppliers in waste, renewable energy and circular value chains, and to compare them on ESG fit.",
    intervention:
      "MarketBridge structures the RFP, surfaces verified women-led suppliers, captures comparable responses and supports an ESG-aware shortlist.",
    expectedValue:
      "Faster supplier discovery, stronger ESG reporting, a trusted supplier pool and structured procurement responses.",
    headlineMetric: "Supplier discovery pathway",
    badge: "Buyer · Europe ↔ Africa",
    accent: "gold",
    challenge:
      "A European public-sector renewable-energy buyer (fictional buyer profile, for demonstration only) needs women-led suppliers across waste and circular-economy supply chains. The buyer wants verified business profiles, evidence of previous projects, capacity statements and ESG-compliance information — assembled in a way that allows fair, structured comparison.",
    scenario:
      "The buyer publishes a 30-day RFP on MarketBridge. Eligible women-led suppliers across DRC, Nigeria, Kenya and partner countries are surfaced. Each supplier submits a structured response: company profile, previous projects, capacity statement, ESG disclosures, supporting documents. The buyer reviews mini-profiles and ESG fit side-by-side and simulates a shortlist decision.",
    journey: [
      { label: "RFP created", detail: "Buyer drafts the RFP scope, timeline and ESG requirements." },
      { label: "Criteria defined", detail: "Supplier eligibility, required documents and submission deadline are set." },
      {
        label: "Suppliers surfaced",
        detail: "MarketBridge matches verified women-led suppliers by sector and region.",
      },
      {
        label: "Responses received",
        detail:
          "Suppliers submit structured responses with profile, prior projects, capacity and ESG evidence.",
      },
      { label: "ESG review", detail: "Buyer reviews verification status and ESG-compliance disclosures." },
      { label: "Shortlist simulated", detail: "Buyer marks a shortlist of qualified suppliers." },
      {
        label: "Engagement pathway",
        detail: "Platform generates an engagement or procurement-pathway summary for the buyer's team.",
      },
    ],
    featuresUsed: [
      { name: "RFP creation", href: "/portal/corporate/rfps/new" },
      { name: "Open RFP board", href: "/marketplace/rfps" },
      { name: "Verified directory", href: "/directory" },
      { name: "Artefact validation", href: "/portal/entrepreneur" },
      { name: "Messaging", href: "/messages" },
    ],
    expectedValuesList: [
      "Faster supplier discovery in target sectors and regions",
      "Better ESG reporting through structured supplier disclosures",
      "A trusted, verified supplier pool",
      "Structured supplier comparison across uniform fields",
      "Improved supplier-diversity pipeline",
      "Higher visibility for African women-led suppliers",
    ],
    suggestedMetrics: [
      { label: "Matched suppliers", value: "Prototype metric" },
      { label: "Responses received", value: "Prototype metric" },
      { label: "Verified shortlisted", value: "Prototype metric" },
      { label: "Award", value: "Simulated award pathway" },
      { label: "ESG fit", value: "Disclosure summary shown" },
      { label: "Diversity contribution", value: "To be populated" },
    ],
    audienceMoment:
      "A clear journey showing how a buyer can move from a vague supplier need to a structured pool of verified women-led suppliers ready for review.",
    cta: { label: "See how a buyer posts an RFP", href: "/marketplace/rfps" },
  },
  {
    slug: "funder-due-diligence-impact",
    number: 3,
    title: "Funder Due Diligence and Impact Visibility",
    stakeholder: "Funder",
    region: "Nigeria · Kenya · DRC",
    sector: "Waste · Renewable energy · Agritech · Adjacent value chains",
    painPoint:
      "Funders face fragmented evidence, weak administrative structures and slow due-diligence cycles when assessing growth-stage women-led ventures across multiple markets.",
    intervention:
      "MarketBridge consolidates verified documents, financials and impact evidence in controlled data rooms — turning fragmented business data into a funder-ready review experience.",
    expectedValue:
      "Faster due diligence, stronger trust, better evidence, reduced paperwork and clearer impact reporting.",
    headlineMetric: "Evidence-readiness pathway",
    badge: "Funder · DFI / Investor",
    accent: "navy",
    challenge:
      "An investor, DFI, donor, foundation or sponsor wants to deploy USD 100,000 – USD 1,000,000 tickets into growth-stage women-led enterprises across Nigeria, Kenya and DRC in waste, renewable energy and agritech. They struggle with weak administrative structures, fragmented financial evidence, and difficulty validating impact claims.",
    scenario:
      "The funder defines a mandate, searches by country, sector and readiness, opens an entrepreneur or cohort profile, and is granted access to a controlled data room with audits, financials, ESG evidence and an impact summary. The platform turns a fragmented review process into a structured, evidence-led shortlist decision — simulated for demo purposes.",
    journey: [
      { label: "Mandate defined", detail: "Funder records geo focus, sector focus and ticket range." },
      {
        label: "Search applied",
        detail: "Filter by country, sector and entrepreneur readiness level.",
      },
      { label: "Profile reviewed", detail: "Entrepreneur or cohort profile opened with verified evidence in view." },
      { label: "Data room opened", detail: "Controlled, time-bound access granted to a dedicated data room." },
      {
        label: "Evidence verified",
        detail: "Business registration, financials, audits and ESG documents reviewed with status labels.",
      },
      { label: "Impact summary", detail: "Aggregated impact metrics and methodology surfaced." },
      { label: "Shortlist simulated", detail: "Funder marks a shortlist or next-step engagement pathway." },
    ],
    featuresUsed: [
      { name: "Verified directory", href: "/directory" },
      { name: "Entrepreneur profiles", href: "/directory" },
      { name: "Data rooms", href: "/data-rooms" },
      { name: "Artefact validation & audit chain", href: "/portal/entrepreneur" },
      { name: "Impact report", href: "/impact/report" },
      { name: "Messaging", href: "/messages" },
    ],
    expectedValuesList: [
      "Faster due diligence on growth-stage ventures",
      "Stronger trust through tamper-evident evidence",
      "Reduced paperwork via structured artefact vault",
      "Clearer impact reporting and methodology",
      "Better investor confidence in pipeline quality",
      "Stronger compliance narrative for institutional capital",
    ],
    suggestedMetrics: [
      { label: "Documents", value: "Verified evidence assembled" },
      { label: "Data room", value: "Shared with funder" },
      { label: "Shortlist", value: "Funder shortlist simulated" },
      { label: "Impact report", value: "Generated for the cohort" },
      { label: "Financials", value: "Reviewed in data room" },
      { label: "Matchmaking", value: "Simulated for demo" },
    ],
    audienceMoment:
      "A clear journey showing how MarketBridge reduces evidence friction and turns fragmented business data into a funder-ready review experience.",
    cta: { label: "See how a data room works", href: "/data-rooms" },
  },
];

export interface FeatureValueRow {
  feature: string;
  value: string;
  stakeholder: Stakeholder | "All";
  href?: string;
}

export const featureValueMap: FeatureValueRow[] = [
  {
    feature: "Verified entrepreneur profiles",
    value: "Credibility and readiness signalling",
    stakeholder: "Entrepreneur",
    href: "/directory",
  },
  {
    feature: "Artefact upload and document validation",
    value: "Trust and reduced due-diligence risk",
    stakeholder: "All",
    href: "/portal/entrepreneur",
  },
  {
    feature: "Marketplace listings",
    value: "Visibility and buyer access",
    stakeholder: "Entrepreneur",
    href: "/marketplace",
  },
  {
    feature: "Corporate RFP flow",
    value: "Structured procurement and supplier discovery",
    stakeholder: "Buyer",
    href: "/marketplace/rfps",
  },
  {
    feature: "Data rooms",
    value: "Secure funder review and evidence sharing",
    stakeholder: "Funder",
    href: "/data-rooms",
  },
  {
    feature: "Messaging",
    value: "Engagement, follow-up and contextual conversations",
    stakeholder: "All",
    href: "/messages",
  },
  {
    feature: "Impact reporting",
    value: "Donor, ESG and partner accountability",
    stakeholder: "All",
    href: "/impact/report",
  },
  {
    feature: "Cohorts",
    value: "Programme management and enterprise pipeline development",
    stakeholder: "All",
  },
];

export interface BlandineProfile {
  name: string;
  business: string;
  country: string;
  region: string;
  sector: string;
  stage: string;
  bio: string;
  activities: string[];
  competencies: string[];
  vision: string;
  evidenceList: string[];
  productListing: string;
  impactThemes: string[];
  languages: string[];
}

export const blandine: BlandineProfile = {
  name: "Blandine BISHENGEZI",
  business: "Centre de Recyclage KAHYA",
  country: "DRC",
  region: "Bukavu",
  sector: "Eco-fashion · Textile upcycling",
  stage: "Growth stage",
  bio:
    "Congolese entrepreneur and eco-fashion designer. Founder of Centre de Recyclage KAHYA in Bukavu, transforming textile waste into eco-responsible clothing, accessories and decorative items. Trained in Agronomic Sciences (Phytotechny) at Université Catholique de Bukavu — bridging scientific knowledge with artistic innovation.",
  activities: [
    "Participation in Made in Bukavu fashion show, 2025",
    "Training workshops for women heads of households on entrepreneurship and upcycling, 2025",
    "Collaboration with Panzi Foundation survivors for exhibitions at the Mukwege Chair Congress, 2025",
    "Eco-fashion creations showcased at the Swiss Cooperation Grands-Lacs Christmas Market, 2025",
  ],
  competencies: [
    "Sustainable fashion design",
    "Textile upcycling",
    "Women's empowerment",
    "Entrepreneurship training",
    "Project management",
    "Creative innovation",
  ],
  vision:
    "Promote eco-responsible fashion in Africa, reduce textile waste and empower women through creative entrepreneurship.",
  evidenceList: ["Business registration document"],
  productListing: "Textile craft (pricing to be confirmed)",
  impactThemes: ["Textile waste reduction", "Women trained in upcycling"],
  languages: ["French", "Swahili", "English"],
};
