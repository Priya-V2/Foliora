import { TextareaHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "min-h-[140px] w-full resize-y rounded-md border border-border bg-surfaceAlt px-4 py-3 text-sm text-text placeholder-textMuted transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
            error && "border-danger focus:border-danger focus:ring-danger/30",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
