import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

interface ComingSoonPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  showSpinner?: boolean;
}

export default function ComingSoonPlaceholder({
  icon: Icon,
  title,
  description,
  showSpinner = false,
}: ComingSoonPlaceholderProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary"
          >
            Foliora
          </Link>
        </header>

        <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Icon size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-text">{title}</h1>
          <p className="mt-2 max-w-md text-sm text-textMuted">
            {description}
          </p>

          {showSpinner && (
            <div
              className="mt-6 flex items-center gap-2 text-sm text-textMuted"
              role="status"
              aria-live="polite"
            >
              <Spinner size={18} className="text-primary" />
              Working on it...
            </div>
          )}

          <Link
            href="/dashboard"
            className="mt-8 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Go to Dashboard
          </Link>
        </main>
      </div>
    </ProtectedRoute>
  );
}
