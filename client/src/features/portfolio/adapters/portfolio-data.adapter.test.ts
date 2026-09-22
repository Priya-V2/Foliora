import { describe, expect, it } from "vitest";
import type { Portfolio } from "@/types/portfolio.types";
import { adaptPortfolioToPortfolioData, normalizePortfolioTheme } from "./portfolio-data.adapter";

function buildPortfolioFixture(overrides: Partial<Portfolio> = {}): Portfolio {
  return {
    id: "portfolio-1",
    title: "Ada's Portfolio",
    personalInfo: {
      fullName: "Ada Lovelace",
      role: "Software Engineer",
      headline: "Building analytical engines",
      bio: "I write software.",
      location: "London",
      email: "ada@example.com",
      phone: "+44 123",
      website: "https://ada.dev",
      availability: null,
      yearsOfExperience: 5,
    },
    experiences: [],
    educations: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    socialLinks: [],
    ...overrides,
  };
}

describe("adaptPortfolioToPortfolioData", () => {
  it("maps profile fields from personalInfo, including bio as the Hero description", () => {
    const data = adaptPortfolioToPortfolioData(buildPortfolioFixture());

    expect(data.profile).toEqual({
      name: "Ada Lovelace",
      headline: "Building analytical engines",
      bio: "I write software.",
      location: "London",
      email: "ada@example.com",
      phone: "+44 123",
      website: "https://ada.dev",
    });
  });

  it("does NOT map personalInfo.bio into about.content (bio is the Hero description, not About)", () => {
    const data = adaptPortfolioToPortfolioData(
      buildPortfolioFixture({
        personalInfo: {
          fullName: "Ada Lovelace",
          role: "Software Engineer",
          headline: "Building analytical engines",
          bio: "I build scalable digital products.",
          location: "London",
          email: "ada@example.com",
          phone: "+44 123",
          website: "https://ada.dev",
          availability: null,
          yearsOfExperience: 5,
        },
      }),
    );

    expect(data.profile.bio).toBe("I build scalable digital products.");
    expect(data.about).toBeUndefined();
  });

  it("falls back to the portfolio title when personalInfo/fullName is missing", () => {
    const data = adaptPortfolioToPortfolioData(
      buildPortfolioFixture({ personalInfo: null }),
    );

    expect(data.profile.name).toBe("Ada's Portfolio");
    expect(data.profile.bio).toBeUndefined();
    expect(data.about).toBeUndefined();
  });

  it("wraps the existing scalar availability field into a single availabilityTags entry", () => {
    const data = adaptPortfolioToPortfolioData(
      buildPortfolioFixture({
        personalInfo: {
          fullName: "Ada Lovelace",
          role: "Software Engineer",
          headline: "Building analytical engines",
          bio: "I write software.",
          location: "London",
          email: "ada@example.com",
          phone: "+44 123",
          website: "https://ada.dev",
          availability: "Open to opportunities",
          yearsOfExperience: 5,
        },
      }),
    );

    expect(data.profile.availabilityTags).toEqual([
      { id: "availability-0", value: "Open to opportunities" },
    ]);
  });

  it("omits availabilityTags when the source availability scalar is null/empty", () => {
    const data = adaptPortfolioToPortfolioData(buildPortfolioFixture());
    expect(data.profile.availabilityTags).toBeUndefined();
  });

  it("passes through caller-supplied resumeUrl and highlights (not present on the Portfolio API shape)", () => {
    const highlights = [
      { id: "h-1", value: "3.5Y EXP" },
      { id: "h-2", value: "18 SHIPPED" },
      { id: "h-3", value: "42 REPOS" },
    ];

    const data = adaptPortfolioToPortfolioData(buildPortfolioFixture(), {
      resumeUrl: "https://cdn.foliora.dev/resumes/ada.pdf",
      highlights,
    });

    expect(data.profile.resumeUrl).toBe("https://cdn.foliora.dev/resumes/ada.pdf");
    expect(data.profile.highlights).toEqual(highlights);
  });

  it("leaves resumeUrl and highlights undefined when not supplied", () => {
    const data = adaptPortfolioToPortfolioData(buildPortfolioFixture());

    expect(data.profile.resumeUrl).toBeUndefined();
    expect(data.profile.highlights).toBeUndefined();
  });

  it("sorts child collections by displayOrder and drops non-canonical fields", () => {
    const data = adaptPortfolioToPortfolioData(
      buildPortfolioFixture({
        experiences: [
          {
            id: "exp-2",
            company: "Second",
            role: "Engineer",
            location: null,
            description: null,
            technologies: ["react"],
            achievements: [],
            startDate: "2022-01-01",
            endDate: null,
            current: true,
            displayOrder: 1,
          },
          {
            id: "exp-1",
            company: "First",
            role: "Junior Engineer",
            location: "Remote",
            description: "Did things",
            technologies: [],
            achievements: [],
            startDate: "2020-01-01",
            endDate: "2021-12-31",
            current: false,
            displayOrder: 0,
          },
        ],
      }),
    );

    expect(data.experience.map((e) => e.id)).toEqual(["exp-1", "exp-2"]);
    expect(data.experience[1]).toEqual({
      id: "exp-2",
      company: "Second",
      role: "Engineer",
      startDate: "2022-01-01",
      isCurrent: true,
    });
    expect(data.experience[1]).not.toHaveProperty("technologies");
  });

  it("maps Experience.achievements to ExperienceData.highlights", () => {
    const data = adaptPortfolioToPortfolioData(
      buildPortfolioFixture({
        experiences: [
          {
            id: "exp-1",
            company: "Acme",
            role: "Engineer",
            location: null,
            description: null,
            technologies: [],
            achievements: ["Led migration to X", "Shipped Y, improving Z by 40%"],
            startDate: "2020-01-01",
            endDate: null,
            current: true,
            displayOrder: 0,
          },
        ],
      }),
    );

    expect(data.experience[0].highlights).toEqual([
      "Led migration to X",
      "Shipped Y, improving Z by 40%",
    ]);
  });

  it("omits highlights when Experience.achievements is empty", () => {
    const data = adaptPortfolioToPortfolioData(
      buildPortfolioFixture({
        experiences: [
          {
            id: "exp-1",
            company: "Acme",
            role: "Engineer",
            location: null,
            description: null,
            technologies: [],
            achievements: [],
            startDate: "2020-01-01",
            endDate: null,
            current: true,
            displayOrder: 0,
          },
        ],
      }),
    );

    expect(data.experience[0].highlights).toBeUndefined();
  });

  it("buckets 1-5 proficiency into the 4-value SkillLevel", () => {
    const data = adaptPortfolioToPortfolioData(
      buildPortfolioFixture({
        skills: [
          { id: "s1", name: "A", category: "FRONTEND", proficiency: 1, displayOrder: 0 },
          { id: "s2", name: "B", category: "FRONTEND", proficiency: 3, displayOrder: 1 },
          { id: "s3", name: "C", category: "FRONTEND", proficiency: 4, displayOrder: 2 },
          { id: "s4", name: "D", category: "FRONTEND", proficiency: 5, displayOrder: 3 },
          { id: "s5", name: "E", category: "FRONTEND", proficiency: null, displayOrder: 4 },
        ],
      }),
    );

    expect(data.skills.map((s) => s.level)).toEqual([
      "beginner",
      "intermediate",
      "advanced",
      "expert",
      undefined,
    ]);
  });

  it("defaults to every MVP section enabled, in the standard order, when none are provided", () => {
    const data = adaptPortfolioToPortfolioData(buildPortfolioFixture());

    expect(data.sections.every((section) => section.enabled)).toBe(true);
    expect(data.sections.map((s) => s.type)).toEqual([
      "about",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "achievements",
      "social",
      "contact",
    ]);
  });

  it("uses caller-provided sections instead of the default when given", () => {
    const customSections = [{ type: "about" as const, enabled: false, displayOrder: 0 }];
    const data = adaptPortfolioToPortfolioData(buildPortfolioFixture(), {
      sections: customSections,
    });

    expect(data.sections).toBe(customSections);
  });

  it("maps SocialLink fields and leaves label undefined (source model has no equivalent field)", () => {
    const data = adaptPortfolioToPortfolioData(
      buildPortfolioFixture({
        socialLinks: [
          { id: "sl-1", platform: "github", url: "https://github.com/ada", displayOrder: 0 },
        ],
      }),
    );

    expect(data.socialLinks[0]).toEqual({
      id: "sl-1",
      platform: "github",
      url: "https://github.com/ada",
    });
    expect(data.socialLinks[0].label).toBeUndefined();
  });
});

describe("normalizePortfolioTheme", () => {
  it("returns undefined for null/non-object/empty input", () => {
    expect(normalizePortfolioTheme(null)).toBeUndefined();
    expect(normalizePortfolioTheme("not-an-object")).toBeUndefined();
    expect(normalizePortfolioTheme({})).toBeUndefined();
    expect(normalizePortfolioTheme({ unknownField: "x" })).toBeUndefined();
  });

  it("keeps only recognized string fields", () => {
    expect(
      normalizePortfolioTheme({
        accentColor: "#123456",
        fontFamily: 42,
        extra: true,
      }),
    ).toEqual({ accentColor: "#123456" });
  });
});
