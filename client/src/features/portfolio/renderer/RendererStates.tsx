// Generic, reusable loading/unavailable/error states shared by
// PortfolioRenderer and PortfolioCardPreview while template resolution is
// pending or has failed. Deliberately free of any template-specific visual
// design (docs/portfolio_architecture.md §5: the renderer "must not contain
// template-specific layout or styling").

import { AlertTriangle, FileQuestion } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

interface StateProps {
  compact?: boolean;
}

export function TemplateLoadingState({ compact = false }: StateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3",
        compact ? "aspect-video p-4" : "min-h-[60vh] p-10",
      )}
    >
      <span className="sr-only">Loading portfolio template…</span>
      {compact ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <Spinner size={28} className="text-textMuted" />
      )}
    </div>
  );
}

interface UnavailableStateProps extends StateProps {
  templateId: string;
  templateVersion: string;
}

export function TemplateUnavailableState({
  templateId,
  templateVersion,
  compact = false,
}: UnavailableStateProps) {
  if (compact) {
    return (
      <div
        role="status"
        className="flex aspect-video w-full items-center justify-center rounded-md bg-surfaceAlt p-4 text-center text-xs text-textMuted"
      >
        Template unavailable
      </div>
    );
  }

  return (
    <div role="status" className="flex min-h-[60vh] w-full items-center justify-center">
      <EmptyState
        icon={FileQuestion}
        title="This portfolio template is unavailable"
        description="The requested template could not be found. This portfolio cannot be rendered right now."
      />
      {process.env.NODE_ENV !== "production" && (
        <p className="sr-only">
          {`Unresolved template: ${templateId}@${templateVersion}`}
        </p>
      )}
    </div>
  );
}

interface ErrorStateProps extends StateProps {
  error: unknown;
}

export function TemplateErrorState({ error, compact = false }: ErrorStateProps) {
  const devMessage =
    process.env.NODE_ENV !== "production"
      ? error instanceof Error
        ? error.message
        : String(error)
      : null;

  if (compact) {
    return (
      <div
        role="alert"
        className="flex aspect-video w-full items-center justify-center rounded-md bg-surfaceAlt p-4 text-center text-xs text-textMuted"
      >
        Preview failed to load
      </div>
    );
  }

  return (
    <div role="alert" className="flex min-h-[60vh] w-full items-center justify-center">
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong loading this portfolio"
        description={
          devMessage ?? "Please try again. If the problem continues, contact support."
        }
      />
    </div>
  );
}
