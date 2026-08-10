import { SelectHTMLAttributes, forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, options, placeholder, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full appearance-none rounded-md border border-border bg-surfaceAlt px-4 py-3 pr-10 text-sm text-text transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
              error && "border-danger focus:border-danger focus:ring-danger/30",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-textMuted"
          />
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

Select.displayName = "Select";

export default Select;
