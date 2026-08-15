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

export const opportunities: Opportunity[]  = [];
