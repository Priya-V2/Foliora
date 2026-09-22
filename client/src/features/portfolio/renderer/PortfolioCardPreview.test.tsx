import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import PortfolioCardPreview from "./PortfolioCardPreview";
import {
  __resetTemplateRegistryForTests,
  registerCardPreviewLoader,
  registerRendererLoader,
} from "../registry/template.registry";
import { buildPortfolioDataFixture } from "../types/__fixtures__/portfolio-data.fixture";
import type { CardPreviewDefinition, RendererDefinition } from "../types/template.types";

function buildFakeCardPreviewDefinition(): CardPreviewDefinition {
  return {
    templateId: "fake",
    templateVersion: "1.0.0",
    CardPreview: ({ data }) => <div data-testid="card-preview">{data.profile.name}</div>,
  };
}

function buildFakeRendererDefinition(): RendererDefinition {
  return {
    templateId: "fake",
    templateVersion: "1.0.0",
    Renderer: () => <div data-testid="full-renderer" />,
  };
}

afterEach(() => {
  cleanup();
  __resetTemplateRegistryForTests();
});

describe("PortfolioCardPreview", () => {
  it("renders the template's CardPreview, not its full Renderer", async () => {
    registerCardPreviewLoader("fake", "1.0.0", async () => buildFakeCardPreviewDefinition());

    render(
      <PortfolioCardPreview
        templateId="fake"
        templateVersion="1.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    await waitFor(() => expect(screen.getByTestId("card-preview")).toBeInTheDocument());
    expect(screen.queryByTestId("full-renderer")).not.toBeInTheDocument();
  });

  it("shows a compact unavailable state instead of falling back to another template", async () => {
    render(
      <PortfolioCardPreview
        templateId="missing"
        templateVersion="1.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    await waitFor(() => expect(screen.getByText(/unavailable/i)).toBeInTheDocument());
  });

  it("shows a compact unavailable state for a registered templateId with the wrong templateVersion", async () => {
    registerCardPreviewLoader("fake", "1.0.0", async () => buildFakeCardPreviewDefinition());

    render(
      <PortfolioCardPreview
        templateId="fake"
        templateVersion="2.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    await waitFor(() => expect(screen.getByText(/unavailable/i)).toBeInTheDocument());
  });

  it("invokes only the CardPreview loader, never the Renderer loader", async () => {
    const cardPreviewLoader = vi.fn(async () => buildFakeCardPreviewDefinition());
    const rendererLoader = vi.fn(async () => buildFakeRendererDefinition());

    registerCardPreviewLoader("fake", "1.0.0", cardPreviewLoader);
    registerRendererLoader("fake", "1.0.0", rendererLoader);

    render(
      <PortfolioCardPreview
        templateId="fake"
        templateVersion="1.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    await waitFor(() => expect(screen.getByTestId("card-preview")).toBeInTheDocument());
    expect(cardPreviewLoader).toHaveBeenCalledTimes(1);
    expect(rendererLoader).not.toHaveBeenCalled();
    expect(screen.queryByTestId("full-renderer")).not.toBeInTheDocument();
  });
});
