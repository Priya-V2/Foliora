// PortfolioDataAdapter — the ONLY boundary allowed to convert
// application/API-shaped data into the canonical PortfolioData contract.
// Templates and the renderer never see the shapes converted here.
//
// Today the only wired-up source is the existing `Portfolio` API shape
// (see client/src/types/portfolio.types.ts, itself a mirror of
// server/src/portfolio DTOs). It already matches PortfolioData closely, so
// the transformation below is a thin field-by-field mapping rather than a
// deep normalization pass. `theme`, section configuration, the resume
// reference, and profile highlights are not part of that API response yet
// (docs/database.md "Known Gap" — no persisted PortfolioSection/theme
// wiring in this phase; see docs/portfolio_contracts.md §5 for the resume/
// highlights gaps), so they are accepted as optional adapter inputs with
// safe MVP defaults until a later phase feeds real values through.
//
// Extend this adapter (not individual templates) when a new data source —
// onboarding state, editor state, published-portfolio records — needs to
// become PortfolioData.

import type {
  Achievement,
  Certification,
  Education,
  Experience,
  PersonalInfo,
  Portfolio,
  Project,
  Skill,
  SocialLink,
} from "@/types/portfolio.types";
import type {
  AboutData,
  AchievementData,
  CertificationData,
  EducationData,
  ExperienceData,
  PortfolioData,
  PortfolioSectionConfig,
  PortfolioSectionType,
  PortfolioTheme,
  ProfileAvailabilityTag,
  ProfileData,
  ProfileHighlight,
  ProjectData,
  SkillData,
  SkillLevel,
  SocialLinkData,
} from "../types/portfolio-data.types";

function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

function byDisplayOrder<T extends { displayOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

// `PersonalInfo.availability` is currently a single free-text scalar column
// (server/prisma/schema.prisma `PersonalInfo.availability String?`), not a
// user-managed collection. The canonical contract models availability as an
// ordered `ProfileAvailabilityTag[]` so a user can eventually hold several
// independent statements ("Open to Relocate", "Freelance Opportunities
// Welcome", ...). Until that is backed by real multi-row persistence (a
// Phase 3 concern — see docs/portfolio_contracts.md §5), this performs a
// lossless 1:1 wrap of the existing scalar into a single-element array. It
// does not lose information, but it is not a substitute for multi-tag
// input: a user cannot create a second tag through this data source today.
function adaptAvailabilityTags(
  personalInfo: PersonalInfo | null,
): ProfileAvailabilityTag[] | undefined {
  const availability = personalInfo?.availability;
  if (!availability) return undefined;
  return [{ id: "availability-0", value: availability }];
}

function adaptProfile(portfolio: Portfolio, options: AdaptPortfolioOptions): ProfileData {
  const personalInfo = portfolio.personalInfo;

  return {
    name: personalInfo?.fullName ?? portfolio.title,
    headline: nullToUndefined(personalInfo?.headline),
    // Hero description — deliberately NOT mapped into AboutData.content.
    // See docs/portfolio_contracts.md §5/§6 for the distinction.
    bio: nullToUndefined(personalInfo?.bio),
    location: nullToUndefined(personalInfo?.location),
    email: nullToUndefined(personalInfo?.email),
    phone: nullToUndefined(personalInfo?.phone),
    website: nullToUndefined(personalInfo?.website),
    // Neither the resume reference nor profile highlights are exposed on
    // the `Portfolio` API shape yet (see AdaptPortfolioOptions below) — the
    // caller supplies them, matching the existing `theme`/`sections`
    // pattern for data not yet wired through the source object.
    resumeUrl: options.resumeUrl,
    highlights: options.highlights,
    availabilityTags: adaptAvailabilityTags(personalInfo),
  };
}

// There is currently no independent About-section content source in the
// backend/onboarding data model — `PersonalInfo` has no field distinct from
// `bio` (the Hero description) that represents About content. `about`
// therefore adapts to `undefined` until such a field exists; this is a
// documented content gap (see docs/portfolio_contracts.md §6), not a bug to
// paper over by reusing `bio`.
function adaptAbout(): AboutData | undefined {
  return undefined;
}

function adaptExperience(experience: Experience): ExperienceData {
  return {
    id: experience.id,
    company: experience.company,
    role: experience.role,
    location: nullToUndefined(experience.location),
    startDate: experience.startDate,
    endDate: nullToUndefined(experience.endDate),
    isCurrent: experience.current,
    description: nullToUndefined(experience.description),
    // Source field is `achievements` (per-role bullet points); canonical
    // contract names it `highlights` to stay distinct from AchievementData.
    highlights: experience.achievements.length > 0 ? experience.achievements : undefined,
  };
}

function adaptEducation(education: Education): EducationData {
  return {
    id: education.id,
    institution: education.institution,
    degree: education.degree,
    fieldOfStudy: nullToUndefined(education.fieldOfStudy),
    startDate: education.startDate,
    endDate: nullToUndefined(education.endDate),
    description: nullToUndefined(education.description),
  };
}

// The app's 1-5 proficiency scale is lossily bucketed into the canonical
// 4-value SkillLevel. Adjust here (not in templates) if the mapping needs
// to change.
function adaptSkillLevel(proficiency: number | null): SkillLevel | undefined {
  if (proficiency == null) return undefined;
  if (proficiency <= 2) return "beginner";
  if (proficiency === 3) return "intermediate";
  if (proficiency === 4) return "advanced";
  return "expert";
}

function adaptSkill(skill: Skill): SkillData {
  return {
    id: skill.id,
    name: skill.name,
    category: skill.category,
    level: adaptSkillLevel(skill.proficiency),
  };
}

function adaptProject(project: Project): ProjectData {
  return {
    id: project.id,
    name: project.title,
    description: nullToUndefined(project.description),
    imageUrl: nullToUndefined(project.imageUrl),
    technologies: project.techStack.length > 0 ? project.techStack : undefined,
    liveUrl: nullToUndefined(project.demoUrl),
    repositoryUrl: nullToUndefined(project.githubUrl),
  };
}

function adaptCertification(certification: Certification): CertificationData {
  return {
    id: certification.id,
    title: certification.title,
    issuer: certification.issuer,
    credentialId: nullToUndefined(certification.credentialId),
    credentialUrl: nullToUndefined(certification.credentialUrl),
    issueDate: nullToUndefined(certification.issueDate),
    logoUrl: nullToUndefined(certification.logoUrl),
  };
}

function adaptAchievement(achievement: Achievement): AchievementData {
  return {
    id: achievement.id,
    title: achievement.title,
    description: nullToUndefined(achievement.description),
    metric: nullToUndefined(achievement.metric),
    achievedAt: nullToUndefined(achievement.achievedAt),
  };
}

function adaptSocialLink(socialLink: SocialLink): SocialLinkData {
  return {
    id: socialLink.id,
    platform: socialLink.platform,
    url: socialLink.url,
    // SocialLinkData.label is intentionally left undefined: the source
    // SocialLink model/API shape (client/src/types/portfolio.types.ts) has
    // no equivalent field to map from.
  };
}

const DEFAULT_SECTION_ORDER: PortfolioSectionType[] = [
  "about",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "achievements",
  "social",
  "contact",
];

// Used until section configuration is actually persisted and returned by
// the API (docs/database.md "Migration Prerequisite"): every MVP section
// enabled, in the standard order.
function buildDefaultSections(): PortfolioSectionConfig[] {
  return DEFAULT_SECTION_ORDER.map((type, index) => ({
    type,
    enabled: true,
    displayOrder: index,
  }));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Normalizes the raw `Portfolio.theme` Json? column into PortfolioTheme.
// Unknown/malformed keys are dropped rather than passed through, so raw
// database JSON never leaks into a template unvalidated.
export function normalizePortfolioTheme(raw: unknown): PortfolioTheme | undefined {
  if (!isPlainObject(raw)) return undefined;

  const theme: PortfolioTheme = {};
  if (typeof raw.accentColor === "string") theme.accentColor = raw.accentColor;
  if (typeof raw.fontFamily === "string") theme.fontFamily = raw.fontFamily;
  if (typeof raw.backgroundColor === "string") theme.backgroundColor = raw.backgroundColor;
  if (typeof raw.textColor === "string") theme.textColor = raw.textColor;

  return Object.keys(theme).length > 0 ? theme : undefined;
}

export interface AdaptPortfolioOptions {
  /** Raw `Portfolio.theme` Json value. Normalized via normalizePortfolioTheme. */
  theme?: unknown;
  /** Overrides the default MVP section configuration when real section data is available. */
  sections?: PortfolioSectionConfig[];
  /**
   * Resume reference produced by the existing resume upload/storage
   * infrastructure (`Resume.fileUrl`, keyed by userId — see
   * server/prisma/schema.prisma). Not currently joined into the `Portfolio`
   * API response, so the caller resolves and passes it explicitly, same as
   * `theme`/`sections` above.
   */
  resumeUrl?: string;
  /**
   * User-defined profile highlights (e.g. "3.5Y EXP", "42 REPOS"). Not yet
   * persisted anywhere in the backend data model — see the Phase 3 gap
   * noted in docs/portfolio_contracts.md §5. Accepted here so callers with
   * an interim/local source can still populate the canonical contract.
   */
  highlights?: ProfileHighlight[];
}

export function adaptPortfolioToPortfolioData(
  portfolio: Portfolio,
  options: AdaptPortfolioOptions = {},
): PortfolioData {
  return {
    profile: adaptProfile(portfolio, options),
    about: adaptAbout(),
    experience: byDisplayOrder(portfolio.experiences).map(adaptExperience),
    education: byDisplayOrder(portfolio.educations).map(adaptEducation),
    skills: byDisplayOrder(portfolio.skills).map(adaptSkill),
    projects: byDisplayOrder(portfolio.projects).map(adaptProject),
    certifications: byDisplayOrder(portfolio.certifications).map(adaptCertification),
    achievements: byDisplayOrder(portfolio.achievements).map(adaptAchievement),
    socialLinks: byDisplayOrder(portfolio.socialLinks).map(adaptSocialLink),
    sections: options.sections ?? buildDefaultSections(),
    theme: normalizePortfolioTheme(options.theme),
  };
}
