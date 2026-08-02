import { z } from "zod";

// Mirrors server/src/auth/dto/login.dto.ts and register.dto.ts so the
// frontend rejects obviously-invalid input before it ever reaches the API.
// The backend remains the final source of truth (see docs/security.md).

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters")
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Include an uppercase letter, a lowercase letter, and a number",
    ),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters")
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Include an uppercase letter, a lowercase letter, and a number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const resendVerificationSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export type ResendVerificationFormValues = z.infer<
  typeof resendVerificationSchema
>;
