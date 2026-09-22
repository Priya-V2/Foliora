"use client";

// Shared async resolution state machine behind both PortfolioRenderer and
// PortfolioCardPreview. Centralizing the loading/error state handling here
// means it is implemented exactly once (docs/template_rules.md §16: "Do not
// implement resolution independently in multiple features") — but which
// registry function actually gets called is passed in by the caller, so
// PortfolioRenderer and PortfolioCardPreview each wire this hook to exactly
// one of resolveRenderer/resolveCardPreview and never the other.

import { useEffect, useState } from "react";
import type { TemplateIdentity } from "../types/template.types";

export type TemplateResolutionState<TDefinition> =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "error"; error: unknown }
  | { status: "ready"; definition: TDefinition };

type ResolutionOutcome<TDefinition> = Exclude<
  TemplateResolutionState<TDefinition>,
  { status: "loading" }
>;

// Only the settled outcome is stored, tagged with the identity it was
// resolved for. "loading" is derived at render time by comparing that
// stored identity to the current props, rather than being written
// synchronously at the top of the effect — an effect should only call
// setState from its async callbacks, not its body (react-hooks/set-state-in-effect).
interface ResolutionResult<TDefinition> extends TemplateIdentity {
  outcome: ResolutionOutcome<TDefinition>;
}

export function useTemplateResolution<TDefinition>(
  { templateId, templateVersion }: TemplateIdentity,
  resolve: (templateId: string, templateVersion: string) => Promise<TDefinition | null>,
): TemplateResolutionState<TDefinition> {
  const [result, setResult] = useState<ResolutionResult<TDefinition> | null>(null);

  useEffect(() => {
    let cancelled = false;

    resolve(templateId, templateVersion)
      .then((definition) => {
        if (cancelled) return;
        setResult({
          templateId,
          templateVersion,
          outcome: definition ? { status: "ready", definition } : { status: "unavailable" },
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setResult({ templateId, templateVersion, outcome: { status: "error", error } });
      });

    return () => {
      cancelled = true;
    };
  }, [templateId, templateVersion, resolve]);

  const isStale =
    !result || result.templateId !== templateId || result.templateVersion !== templateVersion;

  return isStale ? { status: "loading" } : result.outcome;
}
