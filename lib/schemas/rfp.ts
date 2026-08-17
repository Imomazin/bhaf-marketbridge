import { z } from "zod";

export const rfpSchema = z.object({
  title: z.string().min(1, "Title is required").max(1000),
  category: z.string().min(1).max(200),
  region: z.string().max(500).optional(),
  budgetUsd: z.string().max(500).optional(),
  deadline: z.string().optional(),
  description: z.string().min(1, "Description is required").max(50000),
});

export const rfpResponseSchema = z.object({
  rfpId: z.string().min(1),
  body: z.string().min(1, "Response note is required").max(50000),
});

export type RfpInput = z.infer<typeof rfpSchema>;
export type RfpResponseInput = z.infer<typeof rfpResponseSchema>;
