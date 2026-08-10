import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 h-7 text-xs font-semibold",
  {
    variants: {
      variant: {
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        danger: "bg-danger/10 text-danger",
        info: "bg-primary/10 text-primary",
        neutral: "bg-surfaceAlt text-textMuted",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
