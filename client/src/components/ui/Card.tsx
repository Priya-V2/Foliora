import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Foliora's single "card" surface: bg-surface, border-border, rounded-2xl,
// shadow-card (see docs/design-system.md Cards). Extracted from the
// duplicated idiom in AuthCard/OnboardingOptionCard so future screens reuse
// one implementation instead of re-typing the same four utility classes.
export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
