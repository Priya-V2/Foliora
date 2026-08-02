"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthCard, AuthCardHeader } from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import PublicOnlyRoute from "../components/PublicOnlyRoute";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "../schemas/auth.schema";

// NOTE: The backend does not yet expose forgot/reset-password endpoints
// (only the `PasswordResetToken` Prisma model and related env vars are
// scaffolded - see server/prisma/schema.prisma and .env.example). This page
// is validated and ready, but submission is intentionally a no-op until
// those endpoints exist. See the follow-up recommendations in the summary.
export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit() {
    toast.info("Password reset isn't available yet. Please check back soon.");
  }

  return (
    <PublicOnlyRoute>
      <AuthLayout>
        <AuthCard>
          <AuthCardHeader
            title="Reset your password"
            subtitle="Enter a new password for your account."
          />

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <PasswordInput
              id="newPassword"
              label="New Password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <div className="flex items-start gap-2.5 bg-surfaceAlt border border-border rounded-md px-4 py-3">
              <Info size={16} className="mt-0.5 shrink-0 text-primary" />
              <p className="text-xs text-textMuted leading-relaxed">
                Password must be at least 8 characters long and include a mix
                of uppercase, lowercase, and numbers.
              </p>
            </div>

            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Reset Password
            </Button>
          </form>

          <div className="flex justify-center mt-6">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Log In
            </Link>
          </div>
        </AuthCard>
      </AuthLayout>
    </PublicOnlyRoute>
  );
}
