export type ReadinessLevel = "Emerging" | "Developing" | "Market-Ready" | "Funding-Ready";

export interface Entrepreneur {
  id: string;
  name: string;
  country: string;
  sector: string;
  businessName: string;
  description: string;
  fundingNeed: string;
  esgActivity: string;
  readinessLevel: ReadinessLevel;
  products: string[];
  certifications: string[];
  womenSupported: number;
  jobsCreated: number;
  yearFounded: number;
  initials: string;
}

export const entrepreneurs: Entrepreneur[]  = [];
