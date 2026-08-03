import { entrepreneurs } from "@/data/entrepreneurs";
import type { DemoFunderProfile } from "@/lib/demoState";

export interface FunderPipelineStage {
  stage: string;
  count: number;
  capital: string;
  description: string;
}

export interface FunderPipelineEntry {
  entrepreneurId: string;
  stage: string;
  capital: string;
  nextStep: string;
}

export interface FunderShortlist {
  id: string;
  name: string;
  count: number;
  owner: string;
  focus: string;
  updatedAt: string;
  members: string[];
}

export interface FunderReportTemplate {
  id: string;
  title: string;
  audience: string;
  summary: string;
}

export function isSeededFunderAccount(userId: string): boolean {
  return userId === "demo-funder";
}

export function getDemoSeedFunderProfile(userId: string): DemoFunderProfile | null {
  if (!isSeededFunderAccount(userId)) return null;

  return {
    userId,
    orgName: "Mosaic Impact Partners",
    mandate:
      "Catalytic impact capital for women-led ventures in circular economy, clean energy and agri-processing across East and Southern Africa.",
    geoFocus: ["Kenya", "Nigeria", "South Africa", "Senegal"],
    sectorFocus: ["Circular Economy", "Clean Energy", "Agri-Processing"],
    ticketMin: 50000,
    ticketMax: 250000,
    updatedAt: "2026-06-18T09:30:00.000Z",
  };
}

export const SEEDED_FUNDER_PIPELINE: FunderPipelineStage[] = [
  {
    stage: "Sourcing",
    count: 6,
    capital: "—",
    description: "Promising ventures identified from the MarketBridge directory.",
  },
  {
    stage: "Diligence",
    count: 3,
    capital: "$860k",
    description: "Businesses currently under mandate, ESG and document review.",
  },
  {
    stage: "Term sheet",
    count: 2,
    capital: "$430k",
    description: "Commercial terms being aligned with founders and programme partners.",
  },
  {
    stage: "Closed",
    count: 1,
    capital: "$180k",
    description: "Capital deployed and now flowing into impact reporting.",
  },
];

export const SEEDED_FUNDER_PIPELINE_ENTRIES: FunderPipelineEntry[] = [
  {
    entrepreneurId: "fatou-diop",
    stage: "Closed",
    capital: "$180k",
    nextStep: "Quarterly impact update due in August 2026.",
  },
  {
    entrepreneurId: "amara-okafor",
    stage: "Diligence",
    capital: "$120k",
    nextStep: "Review uploaded registration and ESG artefacts.",
  },
  {
    entrepreneurId: "thandiwe-ncube",
    stage: "Term sheet",
    capital: "$250k",
    nextStep: "Confirm board observer rights and disbursement milestones.",
  },
  {
    entrepreneurId: "naledi-mokoena",
    stage: "Sourcing",
    capital: "$240k",
    nextStep: "Initial founder call and shortlist discussion.",
  },
  {
    entrepreneurId: "wanjiru-kamau",
    stage: "Diligence",
    capital: "$80k",
    nextStep: "Assess export-readiness documents before decision memo.",
  },
];

export const SEEDED_FUNDER_SHORTLISTS: FunderShortlist[] = [
  {
    id: "funder-shortlist-clean-energy",
    name: "Clean energy follow-up",
    count: 2,
    owner: "Investment team",
    focus: "Off-grid energy and productive-use solutions",
    updatedAt: "2026-07-12",
    members: ["Fatou Diop", "Thandiwe Ncube"],
  },
  {
    id: "funder-shortlist-circular",
    name: "Circular economy review",
    count: 2,
    owner: "ESG advisory",
    focus: "Waste reduction, circular production and trade readiness",
    updatedAt: "2026-07-15",
    members: ["Amara Okafor", "Naledi Mokoena"],
  },
  {
    id: "funder-shortlist-board-pack",
    name: "Board pack candidates",
    count: 3,
    owner: "Catalyst committee",
    focus: "Funding-ready women-led ventures for next investment committee",
    updatedAt: "2026-07-18",
    members: ["Amara Okafor", "Fatou Diop", "Wanjiru Kamau"],
  },
];

export const FUNDER_REPORT_TEMPLATES: FunderReportTemplate[] = [
  {
    id: "quarterly-board",
    title: "Quarterly board report",
    audience: "Board / IC",
    summary: "A concise pipeline, deployment and impact snapshot for internal governance meetings.",
  },
  {
    id: "donor-update",
    title: "Donor update pack",
    audience: "Donors / LPs",
    summary: "Shows who has been funded, why they were selected, and the outcomes reported so far.",
  },
  {
    id: "programme-brief",
    title: "Programme brief",
    audience: "BHAF / partners",
    summary: "Summarises shortlists, diligence progress and the readiness themes emerging from the network.",
  },
];

export const FUNDER_MATCHES = entrepreneurs.filter(
  (entrepreneur) => entrepreneur.readinessLevel === "Funding-Ready",
);

export function formatTicketRange(min?: number | null, max?: number | null): string {
  if (min != null && max != null) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min != null) return `From $${min.toLocaleString()}`;
  if (max != null) return `Up to $${max.toLocaleString()}`;
  return "Add your ticket size range";
}

export function getFunderWorkflowStep(input: {
  hasProfile: boolean;
  hasFirstArtefact: boolean;
  seeded?: boolean;
}): number {
  if (input.seeded) return 6;
  if (!input.hasProfile) return 1;
  if (!input.hasFirstArtefact) return 2;
  return 4;
}
