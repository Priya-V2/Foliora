"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // TODO: wire up registration logic
    console.log("Sign up:", form);
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
          {/* Logo */}
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
              Create your account
            </h1>
            <p className="mt-1.5 text-gray-500 tracking-[0.005em] text-sm">
              Start building your professional portfolio today.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-surfaceAlt border border-border text-text placeholder-textMuted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-surfaceAlt border border-border text-text placeholder-textMuted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-surfaceAlt border border-border text-text placeholder-textMuted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-md bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-textMuted">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 py-3 rounded-md border border-border bg-surfaceAlt text-sm font-medium text-text hover:bg-border/40 transition">
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-textMuted mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
