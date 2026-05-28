import { z } from "zod";

export const requestResetSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(8),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one digit."),
});

export type RequestResetInput = z.infer<typeof requestResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
