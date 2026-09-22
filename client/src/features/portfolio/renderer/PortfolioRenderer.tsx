"use client";

// The single shared full-portfolio rendering entry point
// (docs/portfolio_architecture.md §5). Resolves templateId + templateVersion
// through the TemplateRegistry and renders the matching template's
// Renderer with canonical PortfolioData.
//
// Deliberately does NOT contain: template-specific UI, template selection
// logic, API/database calls, auth logic, editor logic, or publish logic.

import { useTemplateResolution } from "./useTemplateResolution";
import {
  TemplateErrorState,
  TemplateLoadingState,
  TemplateUnavailableState,
} from "./RendererStates";
import { resolveRenderer } from "../registry/template.registry";
import type { PortfolioRendererProps } from "../types/template.types";

export default function PortfolioRenderer({
  templateId,
  templateVersion,
  data,
}: PortfolioRendererProps) {
  const resolution = useTemplateResolution({ templateId, templateVersion }, resolveRenderer);

  switch (resolution.status) {
    case "loading":
      return <TemplateLoadingState />;
    case "unavailable":
      return (
        <TemplateUnavailableState
          templateId={templateId}
          templateVersion={templateVersion}
        />
      );
    case "error":
      return <TemplateErrorState error={resolution.error} />;
    case "ready": {
      const { Renderer } = resolution.definition;
      return <Renderer data={data} />;
    }
  }
}
