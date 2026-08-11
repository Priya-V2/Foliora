import { cn } from "@/lib/utils";

type PageSectionSpacing = "primary" | "supporting";

const spacingClasses: Record<PageSectionSpacing, string> = {
  primary: "mt-8 sm:mt-10 lg:mt-",
  supporting: "mt-6 sm:mt-8 md:mt-4",
};

interface PageSectionProps {
  children: React.ReactNode;
  spacing?: PageSectionSpacing;
  className?: string;
}

// One vertical-rhythm scale for content blocks below the page header:
// `primary` for the main content area, `supporting` for helper/callout
// content beneath it. Replaces page-specific mt-* magic numbers.
export default function PageSection({
  children,
  spacing = "primary",
  className,
}: PageSectionProps) {
  return (
    <div className={cn(spacingClasses[spacing], className)}>{children}</div>
  );
}
