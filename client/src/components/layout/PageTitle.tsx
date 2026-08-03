import { cn } from "@/lib/utils";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

// Foliora's single page-title scale: text-3xl on mobile, text-4xl from sm+.
export default function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold tracking-tight text-text sm:text-4xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}
