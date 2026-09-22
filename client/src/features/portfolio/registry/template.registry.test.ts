import { afterEach, describe, expect, it, vi } from "vitest";
import {
  __resetTemplateRegistryForTests,
  registerCardPreviewLoader,
  registerRendererLoader,
  resolveCardPreview,
  resolveRenderer,
} from "./template.registry";
import type { CardPreviewDefinition, RendererDefinition } from "../types/template.types";

function buildFakeCardPreviewDefinition(
  overrides: Partial<CardPreviewDefinition> = {},
): CardPreviewDefinition {
  return {
    templateId: "fake",
    templateVersion: "1.0.0",
    CardPreview: () => null,
    ...overrides,
  };
}

function buildFakeRendererDefinition(
  overrides: Partial<RendererDefinition> = {},
): RendererDefinition {
  return {
    templateId: "fake",
    templateVersion: "1.0.0",
    Renderer: () => null,
    ...overrides,
  };
}

afterEach(() => {
  __resetTemplateRegistryForTests();
  vi.restoreAllMocks();
});

describe("resolveCardPreview", () => {
  it("resolves a registered templateId + templateVersion pair", async () => {
    const definition = buildFakeCardPreviewDefinition();
    registerCardPreviewLoader("fake", "1.0.0", async () => definition);

    const resolved = await resolveCardPreview("fake", "1.0.0");

    expect(resolved).toBe(definition);
  });

  it("unwraps a dynamic-import-style { default } module", async () => {
    registerCardPreviewLoader("fake", "1.0.0", () =>
      import("./__fixtures__/fake-template.definition"),
    );

    const resolved = await resolveCardPreview("fake", "1.0.0");

    expect(resolved?.templateId).toBe("fake");
    expect(resolved?.CardPreview).toBeDefined();
  });

  it("returns null for a completely unregistered templateId", async () => {
    const resolved = await resolveCardPreview("does-not-exist", "1.0.0");
    expect(resolved).toBeNull();
  });

  it("resolves strictly by templateId AND templateVersion — a known id with an unknown version returns null, never a substitute version", async () => {
    registerCardPreviewLoader("fake", "1.0.0", async () => buildFakeCardPreviewDefinition());

    const resolved = await resolveCardPreview("fake", "2.0.0");

    expect(resolved).toBeNull();
  });

  it("returns null (no silent fallback) when a loader resolves to a mismatched definition", async () => {
    registerCardPreviewLoader("fake", "1.0.0", async () =>
      buildFakeCardPreviewDefinition({ templateId: "other", templateVersion: "9.9.9" }),
    );

    const resolved = await resolveCardPreview("fake", "1.0.0");

    expect(resolved).toBeNull();
  });

  it("rejects registration of a non-SemVer templateVersion", () => {
    expect(() =>
      registerCardPreviewLoader("fake", "1", async () => buildFakeCardPreviewDefinition()),
    ).toThrow();
  });
});

describe("resolveRenderer", () => {
  it("resolves a registered templateId + templateVersion pair", async () => {
    const definition = buildFakeRendererDefinition();
    registerRendererLoader("fake", "1.0.0", async () => definition);

    const resolved = await resolveRenderer("fake", "1.0.0");

    expect(resolved).toBe(definition);
  });

  it("unwraps a dynamic-import-style { default } module", async () => {
    registerRendererLoader("fake", "1.0.0", () =>
      import("./__fixtures__/fake-template.definition"),
    );

    const resolved = await resolveRenderer("fake", "1.0.0");

    expect(resolved?.templateId).toBe("fake");
    expect(resolved?.Renderer).toBeDefined();
  });

  it("returns null for a completely unregistered templateId", async () => {
    const resolved = await resolveRenderer("does-not-exist", "1.0.0");
    expect(resolved).toBeNull();
  });

  it("resolves strictly by templateId AND templateVersion — a known id with an unknown version returns null, never a substitute version", async () => {
    registerRendererLoader("fake", "1.0.0", async () => buildFakeRendererDefinition());

    const resolved = await resolveRenderer("fake", "2.0.0");

    expect(resolved).toBeNull();
  });

  it("returns null (no silent fallback) when a loader resolves to a mismatched definition", async () => {
    registerRendererLoader("fake", "1.0.0", async () =>
      buildFakeRendererDefinition({ templateId: "other", templateVersion: "9.9.9" }),
    );

    const resolved = await resolveRenderer("fake", "1.0.0");

    expect(resolved).toBeNull();
  });

  it("rejects registration of a non-SemVer templateVersion", () => {
    expect(() =>
      registerRendererLoader("fake", "1", async () => buildFakeRendererDefinition()),
    ).toThrow();
  });
});

describe("loader separation", () => {
  it("resolving a CardPreview invokes only the CardPreview loader, never the Renderer loader", async () => {
    const cardPreviewLoader = vi.fn(async () => buildFakeCardPreviewDefinition());
    const rendererLoader = vi.fn(async () => buildFakeRendererDefinition());

    registerCardPreviewLoader("fake", "1.0.0", cardPreviewLoader);
    registerRendererLoader("fake", "1.0.0", rendererLoader);

    await resolveCardPreview("fake", "1.0.0");

    expect(cardPreviewLoader).toHaveBeenCalledTimes(1);
    expect(rendererLoader).not.toHaveBeenCalled();
  });

  it("resolving a Renderer invokes only the Renderer loader, never the CardPreview loader", async () => {
    const cardPreviewLoader = vi.fn(async () => buildFakeCardPreviewDefinition());
    const rendererLoader = vi.fn(async () => buildFakeRendererDefinition());

    registerCardPreviewLoader("fake", "1.0.0", cardPreviewLoader);
    registerRendererLoader("fake", "1.0.0", rendererLoader);

    await resolveRenderer("fake", "1.0.0");

    expect(rendererLoader).toHaveBeenCalledTimes(1);
    expect(cardPreviewLoader).not.toHaveBeenCalled();
  });

  it("registering only a CardPreview loader leaves Renderer resolution unavailable, and vice versa", async () => {
    registerCardPreviewLoader("fake", "1.0.0", async () => buildFakeCardPreviewDefinition());

    expect(await resolveCardPreview("fake", "1.0.0")).not.toBeNull();
    expect(await resolveRenderer("fake", "1.0.0")).toBeNull();
  });
});

describe("lazy loading boundary", () => {
  it("does not invoke any loader until the matching resolve function is called for that exact pair", async () => {
    const loaderA = vi.fn(async () => buildFakeCardPreviewDefinition({ templateId: "a" }));
    const loaderB = vi.fn(async () => buildFakeCardPreviewDefinition({ templateId: "b" }));

    registerCardPreviewLoader("a", "1.0.0", loaderA);
    registerCardPreviewLoader("b", "1.0.0", loaderB);

    // Registration alone must not have triggered loading.
    expect(loaderA).not.toHaveBeenCalled();
    expect(loaderB).not.toHaveBeenCalled();

    await resolveCardPreview("a", "1.0.0");

    expect(loaderA).toHaveBeenCalledTimes(1);
    expect(loaderB).not.toHaveBeenCalled();
  });
});
