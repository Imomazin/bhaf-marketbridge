import { z } from "zod";
import crypto from "crypto";

export function generateSecurePassword(): string {
  const bytes = crypto.randomBytes(6).toString("hex");
  return `MB#${bytes.slice(0, 4).toUpperCase()}${bytes.slice(4)}!`;
}

export const adminCreateFunderSchema = z.object({
  orgName: z.string().min(2, "Organization name is required").max(200),
  contactName: z.string().min(2, "Contact person name is required").max(120),
  email: z.string().email("A valid email address is required").max(254),
  mandate: z.string().min(5, "Mandate / investment thesis is required").max(5000),
  geoFocus: z.string().min(2, "Geographic focus is required"),
  sectorFocus: z.string().min(2, "Sector focus is required"),
  ticketMin: z.coerce.number().min(0).optional().nullable(),
  ticketMax: z.coerce.number().min(0).optional().nullable(),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  sendWelcomeEmail: z.boolean().default(true),
});

export const adminCreateCorporateSchema = z.object({
  orgName: z.string().min(2, "Company / organization name is required").max(200),
  contactName: z.string().min(2, "Contact person name is required").max(120),
  email: z.string().email("A valid email address is required").max(254),
  industry: z.string().min(2, "Industry is required").max(120),
  procurementGeo: z.string().min(2, "Procurement geographies are required"),
  esgFramework: z.string().max(500).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  sendWelcomeEmail: z.boolean().default(true),
});

export type AdminCreateFunderInput = z.infer<typeof adminCreateFunderSchema>;
export type AdminCreateCorporateInput = z.infer<typeof adminCreateCorporateSchema>;
