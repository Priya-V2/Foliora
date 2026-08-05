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

const skillSchema = z.object({
  name: z.string(),
  category: z.nativeEnum(SkillCategory).catch(SkillCategory.OTHER),
  proficiency: z.number().int().min(0).max(100).optional(),
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

const socialLinkSchema = z.object({
  platform: z.string(),
  url: z.string(),
});

export const portfolioSchema = z.object({
  personalInfo: personalInfoSchema,
  skills: z.array(skillSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  education: z.array(educationSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  achievements: z.array(achievementSchema).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
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
