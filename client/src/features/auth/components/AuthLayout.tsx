import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
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

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-20">
        {children}
      </main>

      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border">
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
