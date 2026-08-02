"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthCard, AuthCardHeader } from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import GoogleAuthButton from "../components/GoogleAuthButton";
import PublicOnlyRoute from "../components/PublicOnlyRoute";
import { useRegister } from "../hooks/useRegister";
import { RegisterFormValues, registerSchema } from "../schemas/auth.schema";

export default function SignupPage() {
  const { register: registerUser, error } = useRegister();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser(values);
      setSubmittedEmail(values.email);
    } catch {
      // Surfaced below via `error` from useRegister.
    }
  }

  return (
    <PublicOnlyRoute>
      <AuthLayout>
        <AuthCard>
          {submittedEmail ? (
            <CheckYourEmail email={submittedEmail} />
          ) : (
            <>
              <AuthCardHeader
                title="Create your account"
                subtitle="Start building your professional portfolio today."
              />

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-5"
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
                  label="Full Name"
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <FormInput
                  label="Email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <PasswordInput
                  id="password"
                  label="Password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register("password")}
                />

                <Button type="submit" fullWidth isLoading={isSubmitting}>
                  Create Account
                </Button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-textMuted">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <GoogleAuthButton />

              <p className="text-center text-sm text-textMuted mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Log In
                </Link>
              </p>
            </>
          )}
        </AuthCard>
      </AuthLayout>
    </PublicOnlyRoute>
  );
}

function CheckYourEmail({ email }: { email: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surfaceAlt text-primary">
        <MailCheck size={28} />
      </div>
      <h1 className="text-2xl font-bold text-text leading-tight mb-2">
        Check your email
      </h1>
      <p className="text-sm text-textMuted leading-relaxed">
        We&apos;ve sent a verification link to{" "}
        <span className="font-medium text-text">{email}</span>. Click it to
        activate your account.
      </p>
      <Link href="/login" className="mt-6 inline-block">
        <Button variant="secondary">Back to Log In</Button>
      </Link>
    </div>
  );
}
