import type { ComponentType } from "react";
import type { ExampleProfile, PortfolioData } from "./portfolio-data.types";

// templateId + templateVersion is the stable identity of a template
// implementation. templateVersion MUST be SemVer ("1.0.0"), never a bare
// number ("1") — a portfolio persists both fields so it keeps rendering
// against the exact version it was built/published with (see
// docs/portfolio_architecture.md §6, docs/database.md).
export interface TemplateIdentity {
  templateId: string;
  templateVersion: string;
}

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

export function isValidTemplateVersion(templateVersion: string): boolean {
  return SEMVER_PATTERN.test(templateVersion);
}

export interface TemplateProps {
  data: PortfolioData;
}

export interface CardPreviewProps {
  data: PortfolioData;
}

// Conceptual catalog shape described in docs/portfolio_contracts.md §20.
// Nothing resolves this whole shape as a single lazy unit at runtime — see
// RendererDefinition/CardPreviewDefinition below, which are resolved
// independently through their own registry loader (template.registry.ts) so
// that reaching a CardPreview never pulls in the full Renderer bundle.
export interface TemplateDefinition extends TemplateIdentity {
  Renderer: ComponentType<TemplateProps>;
  CardPreview: ComponentType<CardPreviewProps>;
  exampleProfiles: ExampleProfile[];
}

// Resolved independently via registerRendererLoader/resolveRenderer. Carries
// its own templateId/templateVersion so the registry can guard against a
// misregistered loader resolving to a mismatched identity.
export interface RendererDefinition extends TemplateIdentity {
  Renderer: ComponentType<TemplateProps>;
}

// Resolved independently via registerCardPreviewLoader/resolveCardPreview.
// Deliberately does not carry a Renderer — a module that only needs the
// card preview must never pull the full template bundle in with it.
export interface CardPreviewDefinition extends TemplateIdentity {
  CardPreview: ComponentType<CardPreviewProps>;
}

export interface PortfolioRendererProps extends TemplateIdentity {
  data: PortfolioData;
}
