import { cn } from "@/lib/utils";

type CardPadding = "default" | "none";

const paddingClasses: Record<CardPadding, string> = {
  default: "p-4 md:p-5 lg:p-6",
  none: "",
};

interface CardProps {
  children: React.ReactNode;
  /** "default" (p-5 md:p-6, see docs/design-system.md Cards Padding: 24px)
   * or "none" for consumers - like SectionCard - that manage their own
   * internal header/body padding and need an unpadded outer shell. */
  padding?: CardPadding;
  className?: string;
}

// Foliora's single "card" surface: bg-surface, border-border, rounded-2xl,
// shadow-card, and shared responsive padding (see docs/design-system.md
// Cards). Extracted from the duplicated idiom in AuthCard/OnboardingOptionCard
// so future screens reuse one implementation instead of re-typing the same
// utility classes.
export default function Card({
  children,
  padding = "default",
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-card",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
