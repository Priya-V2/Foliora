import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
  /** Optional content rendered inline on the label row, e.g. a "Forgot password?" link. */
  labelAddon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, id, className, rightElement, labelAddon, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={inputId} className="text-sm font-medium text-text">
            {label}
          </label>
          {labelAddon}
        </div>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full px-4 py-3 rounded-md bg-surfaceAlt border border-border text-text placeholder-textMuted text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
              rightElement && "pr-12",
              error && "border-danger focus:ring-danger/30 focus:border-danger",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
