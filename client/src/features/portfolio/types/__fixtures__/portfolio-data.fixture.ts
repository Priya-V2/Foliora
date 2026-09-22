import type { PortfolioData } from "../portfolio-data.types";

export function buildPortfolioDataFixture(overrides: Partial<PortfolioData> = {}): PortfolioData {
  return {
    profile: { name: "Ada Lovelace", headline: "Software Engineer" },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    socialLinks: [],
    sections: [],
    ...overrides,
  };
}
