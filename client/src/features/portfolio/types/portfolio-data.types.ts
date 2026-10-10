// Canonical portfolio rendering contract. This is the ONLY shape templates
// may consume — never Prisma models, backend DTOs, API response shapes,
// Redux state, or onboarding-specific objects. See docs/portfolio_contracts.md
// (source of truth) — do not add fields here without updating that document.

// A single user-defined profile highlight (e.g. "3.5Y EXP", "42 REPOS").
// `value` is arbitrary user-entered text with no semantic meaning to the
// contract itself — templates decide how (and whether) to present it. Not
// derived from experience/projects/GitHub data; not a system-computed stat.
export interface ProfileHighlight {
  id: string;
  value: string;
}

// A single user-defined availability statement (e.g. "Open to Relocate",
// "Freelance Opportunities Welcome"). `value` is arbitrary user-entered
// text — there is deliberately no fixed vocabulary/enum. Templates decide
// how (and whether) to present it.
export interface ProfileAvailabilityTag {
  id: string;
  value: string;
}

export interface ProfileData {
  name: string;
  headline?: string;
  // Hero description. Distinct from `AboutData.content` (the About section)
  // — see docs/portfolio_contracts.md §5 for the full rationale. Never map
  // one into the other.
  bio?: string;
  location?: string;
  profileImageUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  // Optional reference to the user's stored resume, produced by the
  // existing resume upload/storage infrastructure. Templates render this as
  // a link/CTA; they must never query resume storage themselves.
  resumeUrl?: string;
  // User-controlled, ordered collection of profile highlights. Optional
  // portfolio content, not section presentation configuration — never move
  // this into PortfolioSectionConfig.configuration.
  highlights?: ProfileHighlight[];
  // User-controlled, ordered collection of availability statements.
  // Optional portfolio content, not section presentation configuration —
  // never move this into PortfolioSectionConfig.configuration.
  availabilityTags?: ProfileAvailabilityTag[];
}

export interface AboutData {
  // Markdown, not plain text — lets the editor offer bold/italic/paragraph
  // breaks without a rich-text document schema. Sanitize on render.
  content: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string; //Markdown, sanitize on render
  highlights?: string[];
}

export interface EducationData {
  id: string;
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string; //Markdown, sanitize on render
}

export interface SkillData {
  id: string;
  name: string;
  category?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string; //Markdown, sanitize on render
  imageUrl?: string;
  technologies?: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExpertiseData {
  id: string;
  title: string;
  description: string; // Markdown, sanitize on render
  skills?: string[];
}

export interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  credentialId?: string;
  credentialUrl?: string;
  issueDate?: string;
  logoUrl?: string;
}

export interface AchievementData {
  id: string;
  title: string;
  description?: string; //Markdown, sanitize on render
  metric?: string;
  achievedAt?: string;
}

export interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

// MVP scope only. "custom", "blogs", and "testimonials" are intentionally
// excluded from the v1 rendering contract (docs/portfolio_contracts.md §14, §25)
// even though the database SectionType enum defines them.
export type PortfolioSectionType =
  | "about"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "expertise"
  | "certifications"
  | "achievements"
  | "contact"
  | "social";

export interface PortfolioSectionConfig {
  type: PortfolioSectionType;
  enabled: boolean;
  displayOrder: number;
  customTitle?: string;
  configuration?: Record<string, unknown>;
}

// Portfolio-level visual configuration. Distinct from Foliora's application
// (dark/light/system) theme — never reuse app-shell theme state here, and
// never pass raw database theme JSON through to a template unadapted.
export interface PortfolioTheme {
  accentColor?: string;
  fontFamily?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface PortfolioData {
  profile: ProfileData;

  about?: AboutData;

  experience: ExperienceData[];
  education: EducationData[];
  skills: SkillData[];
  projects: ProjectData[];
  expertise?: ExpertiseData[]; // A specific section of work, capability, service, or specialization the user wants to highlight
  certifications: CertificationData[];
  achievements: AchievementData[];

  socialLinks: SocialLinkData[];

  sections: PortfolioSectionConfig[];

  theme?: PortfolioTheme;
}

// Demonstration data only — never a real user or published record. Uses the
// exact same PortfolioData contract as user/published data so templates
// cannot tell the two apart. Suggested profession categories for MVP:
// "software-engineer", "product-designer", "marketing-professional".
export interface ExampleProfile {
  id: string;
  label: string;
  profession: string;
  data: PortfolioData;
}
