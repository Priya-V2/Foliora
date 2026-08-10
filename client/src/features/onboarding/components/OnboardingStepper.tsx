import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ONBOARDING_STEPS = [
  "Upload Resume",
  "Review Parsed Data",
  "Connect GitHub",
  "Choose Template",
  "Preview Portfolio",
];

interface OnboardingStepperProps {
  /** 1-indexed current step. */
  currentStep: number;
  className?: string;
}

// Shared "Step X of 5" progress chrome for the resume onboarding flow.
// Desktop shows the full breadcrumb (see reference screenshots); mobile and
// tablet collapse to a compact "Step X of 5" label + progress bar (see
// docs/design-system.md "Progress": 8px height, pill radius, indigo fill).
export default function OnboardingStepper({
  currentStep,
  className,
}: OnboardingStepperProps) {
  const total = ONBOARDING_STEPS.length;
  const percent = Math.round((currentStep / total) * 100);

  return (
    <div className={className}>
      <ol
        className="hidden items-center gap-2 text-sm lg:flex"
        aria-label="Onboarding progress"
      >
        {ONBOARDING_STEPS.map((label, index) => {
          const step = index + 1;
          const isDone = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <li key={label} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-border" aria-hidden="true">
                  /
                </span>
              )}
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1 font-medium",
                  isCurrent
                    ? "text-primary"
                    : isDone
                      ? "text-text"
                      : "text-textMuted",
                )}
              >
                {isDone && <Check size={14} aria-hidden="true" />}
                Step {step}: {label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="lg:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text">
            Step {currentStep} of {total}
          </span>
          <span className="text-textMuted">
            {ONBOARDING_STEPS[currentStep - 1]}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Onboarding progress"
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surfaceAlt"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
