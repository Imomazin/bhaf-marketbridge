import { z } from "zod";

export const OPPORTUNITY_TYPES = [
  "GRANT",
  "INVESTMENT",
  "PROCUREMENT",
  "PROGRAMME",
  "CERTIFICATION",
] as const;

export const opportunitySchema = z.object({
  title: z.string().min(6, "Title must be at least 6 characters.").max(200),
  organisation: z.string().min(2, "Organisation is required.").max(160),
  type: z.enum(OPPORTUNITY_TYPES),
  region: z.string().max(120).optional(),
  amount: z.string().max(120).optional(),
  deadline: z.string().optional(),
  description: z.string().min(20, "Describe the opportunity in at least 20 characters.").max(4000),
  eligibility: z.string().max(2000).optional(),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;
