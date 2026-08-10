import { z } from 'zod';
import { SkillCategory } from '../../generated/prisma';

// Single source of truth for what Gemini extracts from a resume. This same
// schema drives two things: (1) PORTFOLIO_RESPONSE_JSON_SCHEMA below, which
// is sent to Gemini as responseJsonSchema so the model output is
// schema-constrained (see GeminiProvider), and (2) structural validation of
// the raw response in ResumeParserService, so there is only ever one shape
// to keep in sync with the Prisma fields it mirrors (PersonalInfo/Skill/
// Experience/Project/Education/Certification/Achievement/SocialLink).
//
// Fields the AI is never asked to produce (e.g. PersonalInfo.yearsOfExperience,
// Experience.current) are computed downstream in utils/normalizer.ts from the
// facts extracted here - see normalizer.ts for the derivation rules.
//
// Every field the resume may legitimately omit is `.optional()` rather than
// defaulted, so the model can leave it out of the response instead of
// spending output tokens on "" / [] placeholders. utils/normalizer.ts is
// responsible for turning "absent" into the concrete default each field
// needs before persistence.
//
// As of v3 (RESUME_PROMPT_V3), "skills" and "socialLinks" are grouped
// objects rather than arrays of {name/platform, ...} records - this avoids
// repeating the "category"/"platform" key for every single entry, which was
// a meaningful share of output tokens. utils/normalizer.ts flattens both
// back into the same NormalizedSkill[]/NormalizedSocialLink[] shapes the
// resume mapper already expects, so nothing downstream of the AI module
// changes. Skill.proficiency is no longer requested from the AI (the
// grouped shape has no room for a per-skill scalar) and is always
// normalized to null - see the trade-off note in normalizer.ts.

const optionalText = z.string().optional();

const personalInfoSchema = z.object({
  fullName: optionalText,
  role: optionalText,
  headline: optionalText,
  bio: optionalText,
  location: optionalText,
  email: optionalText,
  phone: optionalText,
  website: optionalText,
  availability: optionalText,
});

// Grouped skill categories: object keys instead of a repeated "category"
// field per entry. Keys mirror the SkillCategory enum, lowercased.
export const SKILL_CATEGORY_KEYS = [
  'frontend',
  'backend',
  'database',
  'cloud',
  'devops',
  'mobile',
  'tools',
  'language',
  'other',
] as const;

export type SkillCategoryKey = (typeof SKILL_CATEGORY_KEYS)[number];

export const SKILL_CATEGORY_KEY_TO_ENUM: Record<
  SkillCategoryKey,
  SkillCategory
> = {
  frontend: SkillCategory.FRONTEND,
  backend: SkillCategory.BACKEND,
  database: SkillCategory.DATABASE,
  cloud: SkillCategory.CLOUD,
  devops: SkillCategory.DEVOPS,
  mobile: SkillCategory.MOBILE,
  tools: SkillCategory.TOOLS,
  language: SkillCategory.LANGUAGE,
  other: SkillCategory.OTHER,
};

const skillNameListSchema = z.array(z.string());

const groupedSkillsSchema = z.object({
  frontend: skillNameListSchema.optional(),
  backend: skillNameListSchema.optional(),
  database: skillNameListSchema.optional(),
  cloud: skillNameListSchema.optional(),
  devops: skillNameListSchema.optional(),
  mobile: skillNameListSchema.optional(),
  tools: skillNameListSchema.optional(),
  language: skillNameListSchema.optional(),
  other: skillNameListSchema.optional(),
});

const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: optionalText,
  description: optionalText,
  technologies: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  // "current" is intentionally not part of this schema - an experience
  // entry is derived as ongoing when it has a startDate but no endDate;
  // see normalizeExperience in utils/normalizer.ts.
  startDate: optionalText,
  endDate: optionalText,
});

const projectSchema = z.object({
  title: z.string(),
  description: optionalText,
  techStack: z.array(z.string()).optional(),
  githubUrl: optionalText,
  demoUrl: optionalText,
  imageUrl: optionalText,
});

const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: optionalText,
  cgpa: z.number().optional(),
  startDate: optionalText,
  endDate: optionalText,
  description: optionalText,
});

const certificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  credentialId: optionalText,
  credentialUrl: optionalText,
  issueDate: optionalText,
  logoUrl: optionalText,
});

const achievementSchema = z.object({
  title: z.string(),
  description: optionalText,
  metric: optionalText,
  achievedAt: optionalText,
});

// Grouped social links: a single object keyed by platform instead of an
// array of {platform, url} records.
export const SOCIAL_PLATFORM_KEYS = [
  'github',
  'linkedin',
  'portfolio',
  'twitter',
  'leetcode',
  'hackerrank',
  'codeforces',
  'codechef',
] as const;

export type SocialPlatformKey = (typeof SOCIAL_PLATFORM_KEYS)[number];

// Display label persisted to SocialLink.platform (a free-text column) for
// each grouped key - keeps stored records human-readable.
export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatformKey, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  portfolio: 'Portfolio',
  twitter: 'Twitter',
  leetcode: 'LeetCode',
  hackerrank: 'HackerRank',
  codeforces: 'Codeforces',
  codechef: 'CodeChef',
};

const groupedSocialLinksSchema = z.object({
  github: optionalText,
  linkedin: optionalText,
  portfolio: optionalText,
  twitter: optionalText,
  leetcode: optionalText,
  hackerrank: optionalText,
  codeforces: optionalText,
  codechef: optionalText,
});

export const portfolioSchema = z.object({
  personalInfo: personalInfoSchema,
  skills: groupedSkillsSchema.optional(),
  experience: z.array(experienceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  education: z.array(educationSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  achievements: z.array(achievementSchema).optional(),
  socialLinks: groupedSocialLinksSchema.optional(),
});

export type PortfolioParseData = z.infer<typeof portfolioSchema>;

// Gemini's responseJsonSchema only supports a subset of JSON Schema keywords
// ($id, $defs, $ref, $anchor, type, format, title, description, enum,
// items, prefixItems, minItems, maxItems, minimum, maximum, anyOf, oneOf,
// properties, additionalProperties, required, propertyOrdering). zod emits
// two keywords outside that set - the top-level "$schema" meta field, and
// "default" wherever a `.catch()` (e.g. skillSchema.category) is used - so
// both are stripped recursively rather than sent and rejected by the API.
const UNSUPPORTED_JSON_SCHEMA_KEYWORDS = new Set(['$schema', 'default']);

function stripUnsupportedKeywords(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(stripUnsupportedKeywords);
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node as Record<string, unknown>)
        .filter(([key]) => !UNSUPPORTED_JSON_SCHEMA_KEYWORDS.has(key))
        .map(([key, value]) => [key, stripUnsupportedKeywords(value)]),
    );
  }
  return node;
}

export const PORTFOLIO_RESPONSE_JSON_SCHEMA = stripUnsupportedKeywords(
  z.toJSONSchema(portfolioSchema),
) as Record<string, unknown>;
