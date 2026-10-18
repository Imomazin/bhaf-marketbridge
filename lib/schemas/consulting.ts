import { z } from "zod";

export const consultingRequestSchema = z.object({
  name: z.string().min(2, "Your full name is required").max(120),
  email: z.string().email("A valid email address is required").max(254),
  orgName: z.string().min(2, "Company or organization name is required").max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  country: z.string().min(2, "Country is required").max(100),
  serviceTrackId: z.string().min(1, "Please select a service track"),
  orgStageId: z.string().min(1, "Please select your organization stage"),
  engagementTypeId: z.string().min(1, "Please select an engagement type"),
  selectedAddonIds: z.array(z.string()).default([]),
  urgency: z.enum(["STANDARD", "EXPEDITED"]).default("STANDARD"),
  clientBudget: z.string().max(100).optional().or(z.literal("")),
  targetStartDate: z.string().max(100).optional().or(z.literal("")),
  description: z
    .string()
    .min(10, "Please provide at least 10 characters describing your project goals and requirements.")
    .max(10000),
});

export const updateConsultingRequestStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["SUBMITTED", "UNDER_REVIEW", "PROPOSAL_SENT", "ACCEPTED", "DECLINED"]),
  quotedPriceUsd: z.coerce.number().min(0).optional().nullable(),
  adminNotes: z.string().max(10000).optional().or(z.literal("")),
});

export type ConsultingRequestInput = z.infer<typeof consultingRequestSchema>;
export type UpdateConsultingRequestStatusInput = z.infer<
  typeof updateConsultingRequestStatusSchema
>;
