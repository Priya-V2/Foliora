import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  {
    variants: {
      variant: {
        ghost: "text-textMuted hover:bg-surfaceAlt hover:text-text",
        danger: "text-textMuted hover:bg-danger/10 hover:text-danger",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "sm",
    },
  },
);

interface IconButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Required: icon-only buttons must always have an accessible name. */
  "aria-label": string;
}

// Icon-only affordance for obvious, universally-recognized actions (edit
// pencil, delete trash) on compact card rows - see docs/ui-guidelines.md
// "Never use icon-only buttons unless obvious."
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
