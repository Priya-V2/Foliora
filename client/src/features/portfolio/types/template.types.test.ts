import { describe, expect, it } from "vitest";
import { isValidTemplateVersion, type TemplateIdentity } from "./template.types";

describe("TemplateIdentity contract", () => {
  it("requires templateVersion to be a string", () => {
    const identity: TemplateIdentity = { templateId: "modern", templateVersion: "1.0.0" };

    expect(typeof identity.templateVersion).toBe("string");

    // @ts-expect-error templateVersion must be a string, never a bare number
    const invalid: TemplateIdentity = { templateId: "modern", templateVersion: 1 };
    expect(invalid).toBeDefined();
  });

  it.each(["1.0.0", "0.1.0", "12.34.56"])("accepts SemVer version %s", (version) => {
    expect(isValidTemplateVersion(version)).toBe(true);
  });

  it.each(["1", "v1", "1.0", "1.0.0-beta", ""])("rejects non-SemVer version %s", (version) => {
    expect(isValidTemplateVersion(version)).toBe(false);
  });
});
