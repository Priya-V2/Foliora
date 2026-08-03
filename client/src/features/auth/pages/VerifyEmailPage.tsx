"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, CheckCircle2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import Spinner from "@/components/ui/Spinner";
import { AuthCard, AuthCardHeader } from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import { useResendVerification } from "../hooks/useResendVerification";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import {
  ResendVerificationFormValues,
  resendVerificationSchema,
} from "../schemas/auth.schema";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const { status } = useVerifyEmail(searchParams.get("token"));

  return (
    <AuthLayout>
      <AuthCard className="text-center">
        {status === "verifying" && <VerifyingState />}
        {status === "success" && <SuccessState />}
        {status === "failed" && <FailedState />}
        {status === "already-verified" && <AlreadyVerifiedState />}
      </AuthCard>
    </AuthLayout>
  );
}

function VerifyingState() {
  return (
    <div className="py-6">
      <Spinner size={32} className="mx-auto mb-5 text-primary" />
      <p className="text-sm font-medium text-text">
        Verifying your email...
      </p>
    </div>
  );
}

function SuccessState() {
  return (
    <div>
      <CheckCircle2
        size={56}
        className="mx-auto mb-5 text-success"
        strokeWidth={1.5}
      />
      <AuthCardHeader
        title="Email Verified"
        subtitle="Your email has been verified successfully."
      />
      <Link href="/login">
        <Button fullWidth>Continue to Login</Button>
      </Link>
    </div>
  );
}

function AlreadyVerifiedState() {
  return (
    <div>
      <BadgeCheck
        size={56}
        className="mx-auto mb-5 text-primary"
        strokeWidth={1.5}
      />
      <AuthCardHeader title="Email Already Verified" />
      <Link href="/login">
        <Button fullWidth>Login</Button>
      </Link>
    </div>
  );
}

function FailedState() {
  const [showResendForm, setShowResendForm] = useState(false);
  const { resend, isLoading, isSent, error } = useResendVerification();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
  });

  async function onSubmit(values: ResendVerificationFormValues) {
    await resend(values.email);
  }

  return (
    <div>
      <XCircle
        size={56}
        className="mx-auto mb-5 text-danger"
        strokeWidth={1.5}
      />
      <AuthCardHeader
        title="Verification Failed"
        subtitle="This verification link is invalid or has expired."
      />

      {!showResendForm && !isSent && (
        <div className="space-y-3">
          <Button fullWidth onClick={() => setShowResendForm(true)}>
            Resend Verification Email
          </Button>
          <Link href="/login">
            <Button variant="secondary" fullWidth>
              Back to Login
            </Button>
          </Link>
        </div>
      )}

      {showResendForm && !isSent && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 text-left"
        >
          {error && (
            <div
              role="alert"
              className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
              {error}
            </div>
          )}
          <FormInput
            label="Email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            Send Verification Email
          </Button>
          <Link href="/login">
            <Button variant="secondary" fullWidth type="button">
              Back to Login
            </Button>
          </Link>
        </form>
      )}

      {isSent && (
        <div>
          <p className="text-sm text-text mb-6">
            If an account exists for that email, we&apos;ve sent a new
            verification link.
          </p>
          <Link href="/login">
            <Button fullWidth>Back to Login</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
