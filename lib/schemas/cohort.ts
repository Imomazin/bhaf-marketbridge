import { z } from "zod";

export const cohortSchema = z.object({
  name: z.string().min(3).max(160),
  programme: z.string().max(120).optional(),
  region: z.string().max(120).optional(),
  description: z.string().max(4000).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  capacity: z.coerce.number().int().min(1).max(10000).optional(),
});

export type CohortInput = z.infer<typeof cohortSchema>;
