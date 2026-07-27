"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // In a real app, the email would come from a query param / token lookup
  const accountEmail = "developer@foliora.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // TODO: wire up password-reset logic
    console.log("Reset password:", form);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <Link
          href="/"
          className="text-primary font-bold text-xl tracking-tight"
        >
          Foliora
        </Link>
        <Link
          href="/"
          className="text-sm text-text hover:text-primary transition-colors"
        >
          Back to Site
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-elevated p-8">
          {/* Icon */}
          <div className="flex justify-center mb-3">
            <div className="text-center">
              <Link
                href="/"
                className="text-primary font-bold text-4xl tracking-tight"
              >
                Foliora
              </Link>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text leading-tight mb-1">
              Reset your password
            </h1>
            <p className="text-gray-500 tracking-[0.005em] text-sm">
              Enter a new password for your account.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Account Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Account Email
              </label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-md bg-surfaceAlt border border-border text-textMuted text-sm">
                <LockIcon />
                <span>{accountEmail}</span>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-text mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-md bg-surfaceAlt border border-border text-text placeholder-textMuted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-md bg-surfaceAlt border border-border text-text placeholder-textMuted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Password hint */}
            <div className="flex items-start gap-2.5 bg-surfaceAlt border border-border rounded-md px-4 py-3">
              <InfoIcon className="mt-0.5 shrink-0 text-primary" />
              <p className="text-xs text-textMuted leading-relaxed">
                Password must be at least 8 characters long and include a mix of
                uppercase, lowercase, and numbers.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-md bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Reset Password
            </button>
          </div>

          {/* Back to login */}
          <div className="flex justify-center mt-6">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              <ArrowLeftIcon />
              Back to Log In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-4 border-t border-border">
        <p className="text-xs text-success font-medium">
          © 2026 Foliora. Premium Developer Portfolios.
        </p>

        <div className="flex items-center gap-5">
          <Link
            href="/privacy"
            className="text-xs text-textMuted hover:text-text transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-textMuted hover:text-text transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/support"
            className="text-xs text-textMuted hover:text-text transition-colors"
          >
            Support
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ---- Icons ----

function ResetIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4F46E5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
