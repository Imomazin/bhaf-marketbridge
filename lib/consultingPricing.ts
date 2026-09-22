export interface ServiceTrack {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  basePriceAudit: number;
  basePriceSprint: number;
  basePriceRetainer: number;
  keyDeliverables: string[];
}

export interface EngagementType {
  id: string;
  name: string;
  duration: string;
  description: string;
  multiplier: number;
}

export interface OrgStage {
  id: string;
  label: string;
  description: string;
  multiplier: number;
  discountBadge?: string;
}

export interface DeliverableAddon {
  id: string;
  name: string;
  description: string;
  priceUsd: number;
  category: "Technical" | "Impact" | "Advisory";
}

export const SERVICE_TRACKS: ServiceTrack[] = [
  {
    id: "ESG_SUSTAINABILITY",
    title: "ESG & Sustainability Compliance",
    shortDesc: "GRI/ISSB alignment, ESG disclosure metrics, and supply chain audit readiness.",
    icon: "🌱",
    basePriceAudit: 2200,
    basePriceSprint: 6500,
    basePriceRetainer: 14000,
    keyDeliverables: [
      "Materiality Assessment Matrix",
      "GRI/ISSB Metric Gap Analysis",
      "Executive ESG Compliance Roadmap",
    ],
  },
  {
    id: "INVESTMENT_READINESS",
    title: "Investment Readiness & Data Room",
    shortDesc: "Financial modeling, valuation benchmark, data room structuring, and deal pack.",
    icon: "💼",
    basePriceAudit: 2500,
    basePriceSprint: 8000,
    basePriceRetainer: 18000,
    keyDeliverables: [
      "Audited Data Room Architecture",
      "3-5 Year Integrated Financial Model",
      "Institutional Pitch & Teaser Deck",
    ],
  },
  {
    id: "CIRCULAR_ECONOMY",
    title: "Circular Economy & Eco-Design",
    shortDesc: "Lifecycle assessment, waste-to-value redesign, and circular certification pathways.",
    icon: "🔄",
    basePriceAudit: 2200,
    basePriceSprint: 7000,
    basePriceRetainer: 15000,
    keyDeliverables: [
      "Product Material Lifecycle Audit",
      "Waste-to-Value Sourcing Strategy",
      "Eco-Label & Certification Roadmap",
    ],
  },
  {
    id: "INCLUSIVE_PROCUREMENT",
    title: "Supply Chain & Supplier Diversity",
    shortDesc: "Corporate vendor localization, gender-inclusive procurement, and tier-1 vendor audits.",
    icon: "🏢",
    basePriceAudit: 3000,
    basePriceSprint: 9500,
    basePriceRetainer: 20000,
    keyDeliverables: [
      "Supplier Diversity Baseline Audit",
      "Gender-Inclusive Sourcing Playbook",
      "Vendor Verification Protocol",
    ],
  },
  {
    id: "EXPORT_TRADE",
    title: "Cross-Border Trade & AfCFTA Readiness",
    shortDesc: "Rules of origin compliance, export packaging, trade finance, and market entry strategy.",
    icon: "🌍",
    basePriceAudit: 2500,
    basePriceSprint: 7500,
    basePriceRetainer: 16000,
    keyDeliverables: [
      "AfCFTA Tariff & Rules of Origin Guide",
      "Export Quality & Packaging Standard",
      "Regional Market Entry Blueprint",
    ],
  },
  {
    id: "CUSTOM_BESPOKE",
    title: "Custom Strategic Advisory",
    shortDesc: "Tailored strategic consulting, board advisory, or hybrid impact programme design.",
    icon: "✨",
    basePriceAudit: 3200,
    basePriceSprint: 10000,
    basePriceRetainer: 24000,
    keyDeliverables: [
      "Custom Terms of Reference (ToR)",
      "Dedicated Senior Advisory Panel",
      "Tailored Executive Deliverables",
    ],
  },
];

export const ENGAGEMENT_TYPES: EngagementType[] = [
  {
    id: "EXPRESS_AUDIT",
    name: "Express Diagnostic & Roadmap",
    duration: "1–2 Weeks",
    description: "Rapid baseline audit, gap analysis, and prioritized action plan.",
    multiplier: 1.0,
  },
  {
    id: "PROJECT_SPRINT",
    name: "Execution & Structuring Sprint",
    duration: "4–6 Weeks",
    description: "Deep-dive implementation, modeling, asset production, and coaching.",
    multiplier: 1.0, // base price comes directly from track basePriceSprint
  },
  {
    id: "STRATEGIC_RETAINER",
    name: "Strategic Advisory Retainer",
    duration: "3–6 Months",
    description: "Ongoing dedicated advisory, board sessions, and continuous optimization.",
    multiplier: 1.0, // base price comes directly from track basePriceRetainer
  },
];

export const ORG_STAGES: OrgStage[] = [
  {
    id: "EARLY_STAGE",
    label: "Early-Stage Venture (<$100k ARR)",
    description: "Concessionary grassroots pricing for early-stage women-led enterprises.",
    multiplier: 0.75,
    discountBadge: "25% Grassroots Concession",
  },
  {
    id: "GROWTH_STAGE",
    label: "Growth Stage Venture ($100k–$1M ARR)",
    description: "Standard venture pricing with high-touch execution support.",
    multiplier: 1.0,
  },
  {
    id: "MID_MARKET",
    label: "Mid-Market Enterprise ($1M–$10M ARR)",
    description: "Scaled enterprise advisory and cross-functional team alignment.",
    multiplier: 1.4,
  },
  {
    id: "ENTERPRISE_CORPORATE",
    label: "Large Corporate / Multinational ($10M+ ARR)",
    description: "Comprehensive enterprise governance, multi-subsidiary scope.",
    multiplier: 2.0,
  },
  {
    id: "INSTITUTIONAL_DONOR",
    label: "DFI / Development Partner / Foundation",
    description: "Institutional programme design, impact monitoring, and technical assistance.",
    multiplier: 1.6,
  },
];

export const DELIVERABLE_ADDONS: DeliverableAddon[] = [
  {
    id: "DATA_ROOM_AUDIT",
    name: "In-Depth Data Room & Financial Model Audit",
    description: "Comprehensive stress-test of financial projections and cap-table hygiene.",
    priceUsd: 1200,
    category: "Technical",
  },
  {
    id: "ON_SITE_VERIFICATION",
    name: "On-Site Field Audit & Operational Inspection",
    description: "Physical on-ground inspection of facilities, safety, and supply chain nodes.",
    priceUsd: 2500,
    category: "Impact",
  },
  {
    id: "CARBON_METRIC_REPORT",
    name: "GHG Scope 1-3 & Carbon Accounting Baseline",
    description: "Certified carbon footprint quantification and reduction roadmap.",
    priceUsd: 2800,
    category: "Technical",
  },
  {
    id: "INVESTOR_MATCHMAKING",
    name: "Curated Investor Pitch & Matchmaking Session",
    description: "Direct curated introductions to matched institutional impact investors.",
    priceUsd: 1800,
    category: "Advisory",
  },
  {
    id: "DEDICATED_ADVISOR",
    name: "Dedicated Senior Executive Advisory Lead",
    description: "Allocated senior partner for weekly 1-on-1 sparring and board representation.",
    priceUsd: 2200,
    category: "Advisory",
  },
  {
    id: "BOARD_PRESENTATION",
    name: "Board & Investment Committee Briefing Deck",
    description: "Executive synthesis designed specifically for board sign-off and AGM reporting.",
    priceUsd: 1400,
    category: "Advisory",
  },
];

export interface ConsultingPricingInput {
  serviceTrackId: string;
  engagementTypeId: string;
  orgStageId: string;
  selectedAddonIds: string[];
  urgency: "STANDARD" | "EXPEDITED";
}

export interface ConsultingPricingEstimate {
  track: ServiceTrack;
  engagement: EngagementType;
  stage: OrgStage;
  basePrice: number;
  stageAdjustedBase: number;
  addonsCost: number;
  urgencySurcharge: number;
  totalMinUsd: number;
  totalMaxUsd: number;
  discountAmount: number;
  breakdown: {
    label: string;
    amountUsd: number;
    detail?: string;
  }[];
}

export function calculateConsultingEstimate(
  input: ConsultingPricingInput,
): ConsultingPricingEstimate {
  const track =
    SERVICE_TRACKS.find((t) => t.id === input.serviceTrackId) ?? SERVICE_TRACKS[0];
  const engagement =
    ENGAGEMENT_TYPES.find((e) => e.id === input.engagementTypeId) ?? ENGAGEMENT_TYPES[0];
  const stage =
    ORG_STAGES.find((s) => s.id === input.orgStageId) ?? ORG_STAGES[1];

  let rawBase = track.basePriceAudit;
  if (engagement.id === "PROJECT_SPRINT") rawBase = track.basePriceSprint;
  if (engagement.id === "STRATEGIC_RETAINER") rawBase = track.basePriceRetainer;

  const stageAdjustedBase = Math.round(rawBase * stage.multiplier);
  const discountAmount = stage.multiplier < 1 ? Math.round(rawBase * (1 - stage.multiplier)) : 0;

  // Selected add-ons
  const selectedAddons = DELIVERABLE_ADDONS.filter((a) =>
    input.selectedAddonIds.includes(a.id),
  );
  const addonsCost = selectedAddons.reduce((sum, a) => sum + a.priceUsd, 0);

  // Subtotal before urgency
  const subtotal = stageAdjustedBase + addonsCost;

  // Urgency Surcharge
  const urgencyMultiplier = input.urgency === "EXPEDITED" ? 0.25 : 0;
  const urgencySurcharge = Math.round(subtotal * urgencyMultiplier);

  const exactEstimate = subtotal + urgencySurcharge;

  // Variable range spread: -8% min, +15% max for tailored contingency buffer
  const totalMinUsd = Math.round((exactEstimate * 0.92) / 50) * 50;
  const totalMaxUsd = Math.round((exactEstimate * 1.15) / 50) * 50;

  const breakdown = [
    {
      label: `${track.title} (${engagement.name})`,
      amountUsd: stageAdjustedBase,
      detail:
        stage.multiplier !== 1
          ? `Adjusted for ${stage.label} (${Math.round(stage.multiplier * 100)}%)`
          : undefined,
    },
    ...selectedAddons.map((addon) => ({
      label: `Add-on: ${addon.name}`,
      amountUsd: addon.priceUsd,
    })),
  ];

  if (urgencySurcharge > 0) {
    breakdown.push({
      label: "Expedited Turnaround Surcharge (+25%)",
      amountUsd: urgencySurcharge,
      detail: "Priority allocation and accelerated schedule",
    });
  }

  return {
    track,
    engagement,
    stage,
    basePrice: rawBase,
    stageAdjustedBase,
    addonsCost,
    urgencySurcharge,
    totalMinUsd,
    totalMaxUsd,
    discountAmount,
    breakdown,
  };
}
