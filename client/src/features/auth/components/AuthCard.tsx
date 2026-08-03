import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

// Card radius/shadow follow docs/design-system.md's "Cards" tokens (16px
// radius, soft shadow) rather than the heavier "Dialog" tokens the pages
// previously borrowed - part of what made them feel oversized.
export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-surface border border-border rounded-lg shadow-card p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface AuthCardHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
}

export function AuthCardHeader({ title, subtitle }: AuthCardHeaderProps) {
  return (
    <div className="text-center mb-7">
      <h1
        className={cn(
          "text-2xl font-bold text-text leading-tight",
          subtitle && "mb-1.5",
        )}
      >
        {title}
      </h1>
      {subtitle && <p className="text-sm text-textMuted">{subtitle}</p>}
    </div>
  );
}
