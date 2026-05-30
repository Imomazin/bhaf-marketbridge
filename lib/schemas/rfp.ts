import { z } from "zod";

export const rfpSchema = z.object({
  title: z.string().min(6).max(200),
  category: z.string().min(2).max(60),
  region: z.string().max(120).optional(),
  budgetUsd: z.string().max(120).optional(),
  deadline: z.string().optional(),
  description: z.string().min(20).max(8000),
});

export const rfpResponseSchema = z.object({
  rfpId: z.string().min(1),
  body: z.string().min(20).max(8000),
  pricingNote: z.string().max(400).optional(),
});

export type RfpInput = z.infer<typeof rfpSchema>;
export type RfpResponseInput = z.infer<typeof rfpResponseSchema>;
