import { z } from "zod";

export const ROLES = ["ENTREPRENEUR", "FUNDER", "CORPORATE"] as const;

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one digit."),
  name: z.string().min(2, "Tell us your name.").max(120),
  role: z.enum(ROLES),
  businessName: z.string().max(160).optional(),
  country: z.string().max(60).optional(),
  sector: z.string().max(60).optional(),
  description: z.string().max(2000).optional(),
  orgName: z.string().max(160).optional(),
  acceptedTerms: z
    .literal(true, { message: "You must accept the Terms of Service." }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
