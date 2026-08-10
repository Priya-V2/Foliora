import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90 px-6",
        secondary:
          "bg-surface border border-border text-text hover:bg-surfaceAlt px-6",
        danger: "bg-danger text-white hover:bg-danger/90 px-6",
        ghost: "bg-transparent text-text hover:bg-surfaceAlt px-6",
        dashed:
          "border border-dashed border-border bg-transparent text-primary hover:bg-surfaceAlt px-6",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      fullWidth: false,
    },
  },
);

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      fullWidth,
      isLoading,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          buttonVariants({ variant, fullWidth }),
          "h-11",
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Spinner size={16} />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
