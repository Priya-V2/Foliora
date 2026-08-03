import { cn } from "@/lib/utils";

type SectionContainerWidth = "narrow" | "default";

const widthClasses: Record<SectionContainerWidth, string> = {
  narrow: "max-w-2xl",
  default: "max-w-3xl",
};

interface SectionContainerProps {
  children: React.ReactNode;
  width?: SectionContainerWidth;
  className?: string;
}

// Centers a narrower content column (form, prose, card grid) inside a
// ContentContainer. `narrow` and `default` mirror the two widths already in
// use across the app rather than introducing new arbitrary values.
export default function SectionContainer({
  children,
  width = "default",
  className,
}: SectionContainerProps) {
  return (
    <div className={cn("mx-auto w-full", widthClasses[width], className)}>
      {children}
    </div>
  );
}
