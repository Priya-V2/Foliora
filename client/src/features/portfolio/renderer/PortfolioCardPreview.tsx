"use client";

// Lightweight card-preview rendering entry point, deliberately separate
// from PortfolioRenderer (docs/portfolio_architecture.md §11,
// docs/portfolio_contracts.md §19). Used by onboarding template cards and
// dashboard portfolio cards, which must stay cheap and must not pull in a
// full template bundle just to show a compact preview.

import { useTemplateResolution } from "./useTemplateResolution";
import {
  TemplateErrorState,
  TemplateLoadingState,
  TemplateUnavailableState,
} from "./RendererStates";
import { resolveCardPreview } from "../registry/template.registry";
import type { PortfolioRendererProps } from "../types/template.types";

export default function PortfolioCardPreview({
  templateId,
  templateVersion,
  data,
}: PortfolioRendererProps) {
  const resolution = useTemplateResolution({ templateId, templateVersion }, resolveCardPreview);

  switch (resolution.status) {
    case "loading":
      return <TemplateLoadingState compact />;
    case "unavailable":
      return (
        <TemplateUnavailableState
          templateId={templateId}
          templateVersion={templateVersion}
          compact
        />
      );
    case "error":
      return <TemplateErrorState error={resolution.error} compact />;
    case "ready": {
      const { CardPreview } = resolution.definition;
      return <CardPreview data={data} />;
    }
  }
}
