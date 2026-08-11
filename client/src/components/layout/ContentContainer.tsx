import { cn } from "@/lib/utils";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Standard page-level content width (max-w-5xl) so every app page shares one
// outer boundary. See docs/ui-guidelines.md "Maximum content width should
// remain consistent across the application."
export default function ContentContainer({
  children,
  className,
}: ContentContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 sm:px-8", className)}>
      {children}
    </div>
  );
}
