import Link from "next/link";
import { cn } from "@/lib/utils";

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
        "border-b border-border px-4 py-3 sm:px-6 sm:py-4",
        className,
      )}
    >
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-primary sm:text-xl"
      >
        Foliora
      </Link>
    </header>
  );
}
