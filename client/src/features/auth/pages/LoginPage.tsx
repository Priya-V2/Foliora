"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthCard, AuthCardHeader } from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import GoogleAuthButton from "../components/GoogleAuthButton";
import PublicOnlyRoute from "../components/PublicOnlyRoute";
import { useLogin } from "../hooks/useLogin";
import { LoginFormValues, loginSchema } from "../schemas/auth.schema";

export default function LoginPage() {
  const { login, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
    } catch {
      // Surfaced below via `error` from useLogin.
    }
  }

  return (
    <PublicOnlyRoute>
      <AuthLayout>
        <AuthCard>
          <AuthCardHeader
            title="Welcome back."
            subtitle="Log in to manage your portfolio."
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
              autoComplete="current-password"
              error={errors.password?.message}
              labelAddon={
                <Link
                  href="/reset-password"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              }
              {...register("password")}
            />

            <Button type="submit" fullWidth isLoading={isSubmitting}>
              Log In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-textMuted">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <GoogleAuthButton />

          <p className="text-center text-sm text-textMuted mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </AuthCard>
      </AuthLayout>
    </PublicOnlyRoute>
  );
}
