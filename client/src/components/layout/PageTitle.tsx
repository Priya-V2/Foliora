import { cn } from "@/lib/utils";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

// Foliora's single page-title scale: text-2xl on mobile, text-3xl from sm+.
export default function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1
      className={cn(
        "text-2xl font-bold tracking-tight text-text lg:text-3xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}
