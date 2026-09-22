import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Lightweight, dependency-free structural check (no dependency-cruiser/
// Madge needed): reads the source text directly so a future refactor can't
// quietly reintroduce a shared module that pulls the full Renderer into the
// CardPreview path, or vice versa (docs/portfolio_architecture.md §11).
function readSource(fileName: string): string {
  return readFileSync(join(__dirname, fileName), "utf8");
}

describe("CardPreview / Renderer module boundary", () => {
  it("PortfolioCardPreview.tsx only resolves via resolveCardPreview, never resolveRenderer", () => {
    const source = readSource("PortfolioCardPreview.tsx");

    expect(source).toMatch(/resolveCardPreview/);
    expect(source).not.toMatch(/resolveRenderer\b/);
    expect(source).not.toMatch(/registerRendererLoader/);
  });

  it("PortfolioRenderer.tsx only resolves via resolveRenderer, never resolveCardPreview", () => {
    const source = readSource("PortfolioRenderer.tsx");

    expect(source).toMatch(/resolveRenderer/);
    expect(source).not.toMatch(/resolveCardPreview\b/);
    expect(source).not.toMatch(/registerCardPreviewLoader/);
  });
});
