import { cn } from "@/lib/utils";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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

export default function OnboardingStepper({
  currentStep,
  className,
}: OnboardingStepperProps) {
  const total = ONBOARDING_STEPS.length;

  return (
    <div
      className={cn("group relative", className)}
      tabIndex={0}
      id="onboarding-step-details"
    >
      {/* Compact step indicator */}
      <div className="flex items-center justify-between text-base">
        <span className="font-semibold text-text">
          Step {currentStep} of {total}
        </span>
      </div>

      {/* Step details tooltip */}
      <Tooltip
        anchorSelect={"[id='onboarding-step-details']"}
        place="bottom"
        className="bg-surface! border border-border! text-text rounded-xl p-4 w-64"
        style={{ zIndex: 9999 }}
      >
        <ol className="space-y-2.5">
          {ONBOARDING_STEPS.map((label, index) => {
            const step = index + 1;
            const isDone = step < currentStep;
            const isCurrent = step === currentStep;

            return (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-3 text-sm",
                  isDone && "text-success",
                  isCurrent && "font-semibold text-primary",
                  !isDone && !isCurrent && "text-textMuted",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    isDone && "border-success/30 bg-success/10 text-success",
                    isCurrent && "border-primary/30 bg-primary/10 text-primary",
                    !isDone &&
                      !isCurrent &&
                      "border-border bg-surfaceAlt text-textMuted",
                  )}
                >
                  {isDone ? "✓" : step}
                </span>

                <span>{label}</span>
              </li>
            );
          })}
        </ol>
      </Tooltip>
    </div>
  );
}
