import { z } from "zod";

export const requestResetSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address."),
  otp: z.string().length(6, "OTP must be exactly 6 digits.").regex(/^\d+$/, "OTP must only contain numbers."),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address."),
  otp: z.string().length(6, "OTP must be exactly 6 digits.").regex(/^\d+$/, "OTP must only contain numbers."),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[0-9]/, "Include at least one digit."),
});

export type RequestResetInput = z.infer<typeof requestResetSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
