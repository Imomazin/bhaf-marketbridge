import { z } from "zod";

export const entrepreneurProfileSchema = z.object({
  businessName: z.string().min(2).max(160),
  country: z.string().min(2).max(60),
  sector: z.string().min(2).max(60),
  description: z.string().max(4000).optional(),
  fundingNeed: z.string().max(400).optional(),
  esgActivity: z.string().max(2000).optional(),
  yearFounded: z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional(),
  womenSupported: z.coerce.number().int().min(0).optional(),
  jobsCreated: z.coerce.number().int().min(0).optional(),
});

export const funderProfileSchema = z.object({
  orgName: z.string().min(2).max(160),
  mandate: z.string().max(4000).optional(),
  geoFocus: z.string().max(400).optional(),
  sectorFocus: z.string().max(400).optional(),
  ticketMin: z.coerce.number().int().min(0).optional(),
  ticketMax: z.coerce.number().int().min(0).optional(),
});

export const corporateProfileSchema = z.object({
  orgName: z.string().min(2).max(160),
  industry: z.string().max(120),
  procurementGeo: z.string().max(400).optional(),
  esgFramework: z.string().max(120).optional(),
});

export type EntrepreneurProfileInput = z.infer<typeof entrepreneurProfileSchema>;
export type FunderProfileInput = z.infer<typeof funderProfileSchema>;
export type CorporateProfileInput = z.infer<typeof corporateProfileSchema>;
