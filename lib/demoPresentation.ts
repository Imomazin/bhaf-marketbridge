import type { ReadinessLevel } from "@/data/entrepreneurs";

export function buildInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "MB";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getEntrepreneurWorkflowStep(input: {
  hasProfile: boolean;
  hasEsgActivity: boolean;
  hasFirstListing: boolean;
  hasFirstArtefact: boolean;
}): number {
  if (!input.hasProfile) return 2;
  if (!input.hasEsgActivity) return 3;
  if (!input.hasFirstListing) return 4;
  if (!input.hasFirstArtefact) return 5;
  return 6;
}

export function getReadinessLevel(score: number): ReadinessLevel {
  if (score >= 5) return "Funding-Ready";
  if (score >= 4) return "Market-Ready";
  if (score >= 2) return "Developing";
  return "Emerging";
}

export function formatIsoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}
