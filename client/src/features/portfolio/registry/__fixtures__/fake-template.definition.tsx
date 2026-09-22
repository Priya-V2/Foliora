// Test-only fixture standing in for a real template's lazy-loaded
// definition module (e.g. modern.definition.ts in a later phase). Not a
// preview of any real Foliora template design.

import type { TemplateProps, CardPreviewProps, TemplateDefinition } from "../../types/template.types";

function FakeRenderer({ data }: TemplateProps) {
  return <div data-testid="fake-renderer">{data.profile.name}</div>;
}

function FakeCardPreview({ data }: CardPreviewProps) {
  return <div data-testid="fake-card-preview">{data.profile.name}</div>;
}

const fakeTemplateDefinition: TemplateDefinition = {
  templateId: "fake",
  templateVersion: "1.0.0",
  Renderer: FakeRenderer,
  CardPreview: FakeCardPreview,
  exampleProfiles: [],
};

export default fakeTemplateDefinition;
