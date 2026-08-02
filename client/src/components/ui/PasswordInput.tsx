import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "./FormInput";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelAddon?: React.ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, labelAddon, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <FormInput
        ref={ref}
        label={label}
        error={error}
        labelAddon={labelAddon}
        type={visible ? "text" : "password"}
        rightElement={
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="text-textMuted hover:text-text transition-colors"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...props}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
