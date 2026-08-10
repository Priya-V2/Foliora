import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  className?: string;
}

// Shared masthead for authenticated app pages (Onboarding, Upload Resume,
// Dashboard-style pages). Distinct from AuthLayout's header, which carries a
// "Back to Site" link for the public-facing auth flow.
export default function PageHeader({ className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4",
        className,
      )}
    >
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-primary sm:text-xl"
      >
        Foliora
      </Link>

      <Link
        href="/onboarding"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-textMuted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to Onboarding
      </Link>
    </header>
  );
}
