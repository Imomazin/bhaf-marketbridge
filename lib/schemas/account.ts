import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(10, "New password must be at least 10 characters.")
      .regex(/[A-Z]/, "Include at least one uppercase letter.")
      .regex(/[0-9]/, "Include at least one digit."),
    confirm: z.string().min(1, "Confirm your new password."),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: "Passwords don't match.",
    path: ["confirm"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Enter your name.").max(120),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
