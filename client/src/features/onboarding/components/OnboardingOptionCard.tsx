import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface OnboardingOptionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  features: string[];
  helperText: string;
  ctaLabel: string;
  href: string;
  recommended?: boolean;
  variant?: "primary" | "ghost";
}

export default function OnboardingOptionCard({
  icon: Icon,
  title,
  subtitle,
  features,
  helperText,
  ctaLabel,
  href,
  recommended = false,
  variant = "primary",
}: OnboardingOptionCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-6 lg:p-8",
      )}
    >
      {recommended && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-success sm:right-6 sm:top-6 sm:px-3">
          <Sparkles size={12} aria-hidden="true" />
          Recommended
        </span>
      )}

      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10 lg:h-11 lg:w-11">
        <Icon size={20} aria-hidden="true" />
      </div>

      <h3 className="mt-3 text-lg font-semibold text-text sm:mt-4 sm:text-xl lg:text-2xl">
        {title}
      </h3>
      <p className="mt-1 text-xs text-textMuted sm:text-sm">{subtitle}</p>

      <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-2.5">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-xs text-text sm:text-sm"
          >
            <CheckCircle2
              size={16}
              className="shrink-0 text-success"
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-md bg-surfaceAlt px-3 py-2.5 text-xs text-textMuted sm:mt-5">
        {helperText}
      </p>

      <div className="mt-4 sm:mt-5">
        {variant === "primary" ? (
          <Link
            href={href}
            className={cn(
              buttonVariants({ variant: "primary", fullWidth: true }),
              "h-10 text-sm sm:h-11 sm:text-base",
            )}
          >
            {ctaLabel}
          </Link>
        ) : (
          <Link
            href={href}
            className="flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium text-text transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:text-base"
          >
            {ctaLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
