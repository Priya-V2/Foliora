// Version-aware template registry. This is the ONLY place templateId +
// templateVersion resolve to an implementation — features must never
// branch on templateId themselves (docs/template_rules.md §6).
//
// CardPreview and the full Renderer are resolved through two structurally
// independent loader maps/functions. This is deliberate, not incidental:
// PortfolioCardPreview must be able to reach a lightweight card module
// without ever pulling the full template bundle in along with it. A single
// shared "resolve the definition, then pick a field off it" path cannot
// guarantee that separation, so there is no combined loader/resolver here.
//
// Resolution is asynchronous because full template implementations are
// lazy-loaded (docs/portfolio_architecture.md §21, an MVP requirement, not
// an optimization): importing this module must never pull in every
// registered template's code, only the loader functions.
//
// Phase 1 ships no built-in template registrations — Modern/Minimal/
// Creative are added in later phases by calling both loader registration
// functions from that template's own (separate) card/renderer modules, e.g.:
//
//   registerCardPreviewLoader("modern", "1.0.0", () => import("../templates/modern/modern.card"));
//   registerRendererLoader("modern", "1.0.0", () => import("../templates/modern/modern.renderer"));
//
// modern.card.ts must never import modern.renderer.ts (or vice versa) — see
// docs/portfolio_architecture.md and template_rules.md for the module
// boundary this registry assumes.

import {
  isValidTemplateVersion,
  type CardPreviewDefinition,
  type RendererDefinition,
} from "../types/template.types";

// an obj with 3 fields, templateId, templateVersion, cardPreview (a react component which must accept
// portfolioData as props) - RendererModule is similar but for the RendererModule
type CardPreviewModule =
  { default: CardPreviewDefinition } | CardPreviewDefinition;
type RendererModule = { default: RendererDefinition } | RendererDefinition;

// a type definiton that describes the shape of a function that returns a promise that resolves
// to a CardPreviewModule - RendererModule is similar but for the RendererModule
type CardPreviewLoader = () => Promise<CardPreviewModule>;
type RendererLoader = () => Promise<RendererModule>;

function isModuleWrapper<T extends object>(
  mod: { default: T } | T,
): mod is { default: T } {
  return "default" in mod;
}

function makeKey(templateId: string, templateVersion: string): string {
  return `${templateId}@${templateVersion}`;
}

const cardPreviewLoaders = new Map<string, CardPreviewLoader>();
const rendererLoaders = new Map<string, RendererLoader>();

function assertValidTemplateVersion(
  templateId: string,
  templateVersion: string,
): void {
  if (!isValidTemplateVersion(templateVersion)) {
    throw new Error(
      `Invalid templateVersion "${templateVersion}" for template "${templateId}": must be SemVer (MAJOR.MINOR.PATCH).`,
    );
  }
}

/**
 * Registers a lazy loader for one templateId + templateVersion's CardPreview.
 * Call this once per template/version, from that template's own card
 * module — never from a central eager import list, and never from the same
 * module that also registers the Renderer loader.
 */
export function registerCardPreviewLoader(
  templateId: string,
  templateVersion: string,
  loader: CardPreviewLoader,
): void {
  assertValidTemplateVersion(templateId, templateVersion);
  cardPreviewLoaders.set(makeKey(templateId, templateVersion), loader);
}

/**
 * Registers a lazy loader for one templateId + templateVersion's full
 * Renderer. Call this once per template/version, from that template's own
 * renderer module — never from a central eager import list, and never from
 * the same module that also registers the CardPreview loader.
 */
export function registerRendererLoader(
  templateId: string,
  templateVersion: string,
  loader: RendererLoader,
): void {
  assertValidTemplateVersion(templateId, templateVersion);
  rendererLoaders.set(makeKey(templateId, templateVersion), loader);
}

/** Test-only escape hatch: clears all registered loaders (both maps). */
export function __resetTemplateRegistryForTests(): void {
  cardPreviewLoaders.clear();
  rendererLoaders.clear();
}

/**
 * Resolves templateId + templateVersion to its CardPreviewDefinition. Never
 * invokes the Renderer loader. Returns null (never a substitute
 * template/version) when the pair is not registered, so callers must render
 * a controlled "unavailable" state rather than silently falling back
 * (docs/portfolio_contracts.md §23).
 */
export async function resolveCardPreview(
  templateId: string,
  templateVersion: string,
): Promise<CardPreviewDefinition | null> {
  const loader = cardPreviewLoaders.get(makeKey(templateId, templateVersion));
  if (!loader) return null;

  const loaded = await loader();
  const definition = isModuleWrapper(loaded) ? loaded.default : loaded;

  // Guards against a misconfigured loader resolving to a mismatched
  // definition — resolution must never silently hand back a different
  // template/version than the one requested.
  if (
    definition.templateId !== templateId ||
    definition.templateVersion !== templateVersion
  ) {
    return null;
  }

  return definition;
}

/**
 * Resolves templateId + templateVersion to its RendererDefinition. Never
 * invokes the CardPreview loader. Returns null (never a substitute
 * template/version) when the pair is not registered, so callers must render
 * a controlled "unavailable" state rather than silently falling back
 * (docs/portfolio_contracts.md §23).
 */
export async function resolveRenderer(
  templateId: string,
  templateVersion: string,
): Promise<RendererDefinition | null> {
  const loader = rendererLoaders.get(makeKey(templateId, templateVersion));
  if (!loader) return null;

  const loaded = await loader();
  const definition = isModuleWrapper(loaded) ? loaded.default : loaded;

  // Guards against a misconfigured loader resolving to a mismatched
  // definition — resolution must never silently hand back a different
  // template/version than the one requested.
  if (
    definition.templateId !== templateId ||
    definition.templateVersion !== templateVersion
  ) {
    return null;
  }

  return definition;
}
