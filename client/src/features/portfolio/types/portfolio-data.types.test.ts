import { describe, expect, it } from "vitest";
import type { PortfolioData, PortfolioSectionType } from "./portfolio-data.types";
import { buildPortfolioDataFixture } from "./__fixtures__/portfolio-data.fixture";

describe("PortfolioData contract", () => {
  it("compiles with only the required fields present", () => {
    const data: PortfolioData = {
      profile: { name: "Grace Hopper" },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      socialLinks: [],
      sections: [],
    };

    expect(data.profile.name).toBe("Grace Hopper");
    expect(data.about).toBeUndefined();
    expect(data.theme).toBeUndefined();
  });

  it("accepts the fixture helper as a valid canonical shape", () => {
    const data = buildPortfolioDataFixture();
    expect(data.profile.name).toBe("Ada Lovelace");
  });

  it("MVP section scope excludes custom/blogs/testimonials", () => {
    const mvpSections: PortfolioSectionType[] = [
      "about",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "achievements",
      "contact",
      "social",
    ];

    // @ts-expect-error "custom" is deferred and must not be part of the MVP contract
    const rejectedCustom: PortfolioSectionType = "custom";
    // @ts-expect-error "blogs" is deferred and must not be part of the MVP contract
    const rejectedBlogs: PortfolioSectionType = "blogs";

    expect(mvpSections).toHaveLength(9);
    expect([rejectedCustom, rejectedBlogs]).toBeDefined();
  });
});
