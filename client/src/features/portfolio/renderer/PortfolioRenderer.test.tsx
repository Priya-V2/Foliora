import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import PortfolioRenderer from "./PortfolioRenderer";
import {
  __resetTemplateRegistryForTests,
  registerCardPreviewLoader,
  registerRendererLoader,
} from "../registry/template.registry";
import { buildPortfolioDataFixture } from "../types/__fixtures__/portfolio-data.fixture";
import type { CardPreviewDefinition, RendererDefinition } from "../types/template.types";

function buildFakeRendererDefinition(): RendererDefinition {
  return {
    templateId: "fake",
    templateVersion: "1.0.0",
    Renderer: ({ data }) => <div data-testid="full-renderer">{data.profile.name}</div>,
  };
}

function buildFakeCardPreviewDefinition(): CardPreviewDefinition {
  return {
    templateId: "fake",
    templateVersion: "1.0.0",
    CardPreview: () => <div data-testid="card-preview" />,
  };
}

afterEach(() => {
  cleanup();
  __resetTemplateRegistryForTests();
});

describe("PortfolioRenderer", () => {
  it("shows a loading state before the template resolves", () => {
    registerRendererLoader("fake", "1.0.0", () => new Promise(() => {}));

    render(
      <PortfolioRenderer
        templateId="fake"
        templateVersion="1.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the resolved template's Renderer with canonical PortfolioData once ready", async () => {
    registerRendererLoader("fake", "1.0.0", async () => buildFakeRendererDefinition());

    render(
      <PortfolioRenderer
        templateId="fake"
        templateVersion="1.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    await waitFor(() => expect(screen.getByTestId("full-renderer")).toBeInTheDocument());
    expect(screen.getByTestId("full-renderer")).toHaveTextContent("Ada Lovelace");
  });

  it("renders a controlled unavailable state instead of silently falling back to another template", async () => {
    render(
      <PortfolioRenderer
        templateId="missing"
        templateVersion="1.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    await waitFor(() => expect(screen.getByText(/unavailable/i)).toBeInTheDocument());
  });

  it("renders unavailable for a registered templateId with the wrong templateVersion", async () => {
    registerRendererLoader("fake", "1.0.0", async () => buildFakeRendererDefinition());

    render(
      <PortfolioRenderer
        templateId="fake"
        templateVersion="2.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    await waitFor(() => expect(screen.getByText(/unavailable/i)).toBeInTheDocument());
  });

  it("invokes only the Renderer loader, never the CardPreview loader", async () => {
    const rendererLoader = vi.fn(async () => buildFakeRendererDefinition());
    const cardPreviewLoader = vi.fn(async () => buildFakeCardPreviewDefinition());

    registerRendererLoader("fake", "1.0.0", rendererLoader);
    registerCardPreviewLoader("fake", "1.0.0", cardPreviewLoader);

    render(
      <PortfolioRenderer
        templateId="fake"
        templateVersion="1.0.0"
        data={buildPortfolioDataFixture()}
      />,
    );

    await waitFor(() => expect(screen.getByTestId("full-renderer")).toBeInTheDocument());
    expect(rendererLoader).toHaveBeenCalledTimes(1);
    expect(cardPreviewLoader).not.toHaveBeenCalled();
    expect(screen.queryByTestId("card-preview")).not.toBeInTheDocument();
  });
});
