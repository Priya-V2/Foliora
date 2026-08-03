import { cn } from "@/lib/utils";

interface PageDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

// Sits directly under a PageTitle; margin-top is part of the component so
// pages never need to hand-pick spacing between title and description.
export default function PageDescription({
  children,
  className,
}: PageDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-3 text-base leading-7 text-textMuted sm:mt-4",
        className,
      )}
    >
      {children}
    </p>
  );
}
