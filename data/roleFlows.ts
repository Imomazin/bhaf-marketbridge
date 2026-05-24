import type { RoleId } from "./roles";

export interface FlowStep {
  number: string;
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
}

export interface RoleFlow {
  intro: string;
  steps: FlowStep[];
}

export const roleFlows: Record<RoleId, RoleFlow> = {
  entrepreneur: {
    intro:
      "Your path from first registration to global visibility — what to do, in order, to turn your business into a fundable, market-ready profile.",
    steps: [
      {
        number: "01",
        title: "Register your business",
        description: "Create an account, pick your sector and country, confirm contact details.",
        href: "/portal/entrepreneur",
        hrefLabel: "Open entrepreneur portal",
      },
      {
        number: "02",
        title: "Build your profile",
        description: "Add company description, founders, certifications and upload verification documents.",
      },
      {
        number: "03",
        title: "Document ESG activity",
        description: "Capture environmental, social and governance practice through guided forms.",
        href: "/impact",
        hrefLabel: "See the ESG framework",
      },
      {
        number: "04",
        title: "List products or services",
        description: "Publish to the marketplace so buyers and corporate partners can enquire directly.",
        href: "/marketplace",
        hrefLabel: "View marketplace",
      },
      {
        number: "05",
        title: "Complete the readiness checklist",
        description: "Move from Emerging → Developing → Market-Ready → Funding-Ready to unlock visibility tiers.",
      },
      {
        number: "06",
        title: "Apply to curated opportunities",
        description: "Get matched to grants, investment and procurement opportunities aligned to your profile.",
        href: "/opportunities",
        hrefLabel: "Browse opportunities",
      },
    ],
  },
  funder: {
    intro:
      "From sourcing to committed capital — the sequence of moves an impact investor, donor or grantmaker runs through MarketBridge.",
    steps: [
      {
        number: "01",
        title: "Set your mandate",
        description: "Define sectors, geographies, ticket sizes and ESG criteria for your fund or programme.",
        href: "/portal/funder",
        hrefLabel: "Open funder portal",
      },
      {
        number: "02",
        title: "Browse the verified directory",
        description: "Filter the BHAF network by readiness tier, sector, country and impact lens.",
        href: "/directory",
        hrefLabel: "Open directory",
      },
      {
        number: "03",
        title: "Build shortlists & pipelines",
        description: "Save investable ventures into named lists and route them to your investment team.",
      },
      {
        number: "04",
        title: "Run diligence",
        description: "Review ESG documentation, financials, founder bios and BHAF verification status in one place.",
      },
      {
        number: "05",
        title: "Deploy capital",
        description: "Issue term sheets, grants or programme support and track them through to closing.",
      },
      {
        number: "06",
        title: "Pull donor-grade impact reports",
        description: "Aggregate live entrepreneur data into board, donor and LP-ready impact reports.",
        href: "/impact",
        hrefLabel: "Impact framework",
      },
    ],
  },
  corporate: {
    intro:
      "From supplier discovery to procurement and supplier-diversity reporting — how a procurement or ESG team operates on MarketBridge.",
    steps: [
      {
        number: "01",
        title: "Onboard your team",
        description: "Invite buyers, procurement leads and ESG officers into the corporate workspace.",
        href: "/portal/corporate",
        hrefLabel: "Open corporate portal",
      },
      {
        number: "02",
        title: "Browse the marketplace",
        description: "Filter by category, country and supplier diversity status.",
        href: "/marketplace",
        hrefLabel: "Browse marketplace",
      },
      {
        number: "03",
        title: "Shortlist verified suppliers",
        description: "Save, tag and route women-led suppliers directly to your buying teams.",
      },
      {
        number: "04",
        title: "Post RFPs and sourcing calls",
        description: "Run targeted sourcing requests to qualified BHAF cohorts.",
      },
      {
        number: "05",
        title: "Onboard and contract",
        description: "Move from PO to active supplier with ESG documentation already in place.",
      },
      {
        number: "06",
        title: "Report supplier diversity & ESG",
        description: "Pull supplier diversity, ESG and spend reports for board, regulator and disclosure use.",
      },
    ],
  },
  admin: {
    intro:
      "From profile moderation to network-wide impact reporting — how a BHAF administrator runs the platform end-to-end.",
    steps: [
      {
        number: "01",
        title: "Review pending profiles",
        description: "Verify new entrepreneur registrations and supporting documents.",
        href: "/admin",
        hrefLabel: "Open admin dashboard",
      },
      {
        number: "02",
        title: "Approve listings and ESG submissions",
        description: "Approve marketplace listings and impact reporting before they go live.",
      },
      {
        number: "03",
        title: "Publish opportunities and cohorts",
        description: "Push grants, procurement calls, certification cohorts and training programmes to the network.",
        href: "/opportunities",
        hrefLabel: "Opportunity board",
      },
      {
        number: "04",
        title: "Run cohorts end-to-end",
        description: "Manage Accelerator, FEMEC RDC, InvestHer and Baloni Farm cohort enrolments.",
      },
      {
        number: "05",
        title: "Monitor the readiness pipeline",
        description: "Track entrepreneurs progressing through Emerging → Funding-Ready tiers.",
      },
      {
        number: "06",
        title: "Compile network impact reports",
        description: "Aggregate live data into donor and stakeholder reports.",
        href: "/impact",
        hrefLabel: "Impact reporting",
      },
    ],
  },
};
