import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

// See docs/ui-guidelines.md "Empty States": explain why nothing is shown
// and what to do next, with a required primary CTA.
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-10 text-center",
        className,
      )}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-surfaceAlt text-textMuted"
        aria-hidden="true"
      >
        <Icon size={22} />
      </div>
      <p className="mt-4 text-sm font-medium text-text">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-textMuted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
