import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

// Compact tag used for skill/tech-stack/achievement lists. With `onRemove`
// it becomes an editable chip (used inside add/edit forms); without it, a
// plain read-only tag (used on the review cards).
export default function Chip({
  children,
  onRemove,
  removeLabel = "Remove",
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surfaceAlt px-3 py-1 text-xs font-medium text-text",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="rounded-full p-0.5 text-textMuted transition-colors hover:bg-border/60 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
