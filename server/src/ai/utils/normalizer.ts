import {
  PortfolioParseData,
  SKILL_CATEGORY_KEY_TO_ENUM,
  SKILL_CATEGORY_KEYS,
  SOCIAL_PLATFORM_KEYS,
  SOCIAL_PLATFORM_LABELS,
} from '../schemas/portfolio.schema';
import {
  NormalizedAchievement,
  NormalizedCertification,
  NormalizedEducation,
  NormalizedExperience,
  NormalizedPersonalInfo,
  NormalizedPortfolioData,
  NormalizedProject,
  NormalizedSkill,
  NormalizedSocialLink,
} from '../types/portfolio.types';

const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

// Strips control characters and collapses runs of whitespace. Returns null
// for blank/absent input so downstream mapping can decide between null and
// omitting the field, rather than persisting empty strings.
function sanitizeString(value: string | undefined): string | null {
  if (!value) return null;
  const printableOnly = Array.from(value)
    .filter((char) => {
      const code = char.codePointAt(0) ?? 0;
      return code >= 32 && code !== 127;
    })
    .join('');
  const cleaned = printableOnly.trim().replace(/\s+/g, ' ');
  return cleaned.length > 0 ? cleaned : null;
}

// Handles the date formats the prompt asks for: "YYYY-MM-DD", "YYYY-MM",
// "YYYY", and "Month YYYY" (e.g. "Jan 2020" / "January 2020"). No date
// library is added for this - the format space is small and fixed by the
// prompt we control. Returns null for absent/"present"/"current"/
// unparseable input.
function normalizeDate(value: string | undefined): Date | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (lower === 'present' || lower === 'current' || lower === 'ongoing') {
    return null;
  }

  const isoMatch = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(trimmed);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const date = new Date(
      Number(year),
      month ? Number(month) - 1 : 0,
      day ? Number(day) : 1,
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const monthYearMatch = /^([a-zA-Z]+)\.?\s+(\d{4})$/.exec(trimmed);
  if (monthYearMatch) {
    const [, monthName, year] = monthYearMatch;
    const monthIndex = MONTH_NAMES.findIndex((name) =>
      name.startsWith(monthName.toLowerCase()),
    );
    if (monthIndex !== -1) {
      const date = new Date(Number(year), monthIndex, 1);
      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function dedupeSkills(skills: NormalizedSkill[]): NormalizedSkill[] {
  const seen = new Set<string>();
  const result: NormalizedSkill[] = [];
  for (const skill of skills) {
    if (!skill.name) continue;
    const key = skill.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(skill);
  }
  return result;
}

// PersonalInfo.yearsOfExperience is not asked of the AI (it's a fact our
// backend can derive) - it's the summed duration of every experience entry
// with a known start date, ongoing roles counted through today. Overlapping
// roles are not deduplicated, so concurrent jobs/internships will inflate
// the total; this is a best-effort estimate, not payroll-grade math.
function computeYearsOfExperience(
  experience: NormalizedExperience[],
): number | null {
  let totalMs = 0;
  let hasDatedEntry = false;

  for (const item of experience) {
    if (!item.startDate) continue;
    const end = item.endDate ?? new Date();
    totalMs += Math.max(0, end.getTime() - item.startDate.getTime());
    hasDatedEntry = true;
  }

  return hasDatedEntry ? Math.round(totalMs / MS_PER_YEAR) : null;
}

function normalizePersonalInfo(
  data: PortfolioParseData['personalInfo'],
  yearsOfExperience: number | null,
): NormalizedPersonalInfo {
  return {
    fullName: sanitizeString(data.fullName),
    role: sanitizeString(data.role),
    headline: sanitizeString(data.headline),
    bio: sanitizeString(data.bio),
    location: sanitizeString(data.location),
    email: sanitizeString(data.email),
    phone: sanitizeString(data.phone),
    website: normalizeUrl(data.website),
    availability: sanitizeString(data.availability),
    yearsOfExperience,
  };
}

function normalizeExperience(
  items: PortfolioParseData['experience'],
): NormalizedExperience[] {
  return (items ?? []).map((item) => {
    const startDate = normalizeDate(item.startDate);
    const endDate = normalizeDate(item.endDate);
    return {
      company: sanitizeString(item.company) ?? '',
      role: sanitizeString(item.role) ?? '',
      location: sanitizeString(item.location),
      description: sanitizeString(item.description),
      technologies: (item.technologies ?? [])
        .map((t) => t.trim())
        .filter(Boolean),
      achievements: (item.achievements ?? [])
        .map((a) => a.trim())
        .filter(Boolean),
      startDate,
      endDate,
      // Derived, not extracted: a role with a start date and no end date is
      // ongoing. See the schema comment on experienceSchema for why "current"
      // is not part of what we ask the AI to return.
      current: startDate !== null && endDate === null,
    };
  });
}

function normalizeProjects(
  items: PortfolioParseData['projects'],
): NormalizedProject[] {
  return (items ?? []).map((item) => ({
    title: sanitizeString(item.title) ?? '',
    description: sanitizeString(item.description),
    techStack: (item.techStack ?? []).map((t) => t.trim()).filter(Boolean),
    githubUrl: normalizeUrl(item.githubUrl),
    demoUrl: normalizeUrl(item.demoUrl),
    imageUrl: normalizeUrl(item.imageUrl),
  }));
}

function normalizeEducation(
  items: PortfolioParseData['education'],
): NormalizedEducation[] {
  return (items ?? []).map((item) => ({
    institution: sanitizeString(item.institution) ?? '',
    degree: sanitizeString(item.degree) ?? '',
    fieldOfStudy: sanitizeString(item.fieldOfStudy),
    cgpa: item.cgpa ?? null,
    startDate: normalizeDate(item.startDate),
    endDate: normalizeDate(item.endDate),
    description: sanitizeString(item.description),
  }));
}

function normalizeCertifications(
  items: PortfolioParseData['certifications'],
): NormalizedCertification[] {
  return (items ?? []).map((item) => ({
    title: sanitizeString(item.title) ?? '',
    issuer: sanitizeString(item.issuer) ?? '',
    credentialId: sanitizeString(item.credentialId),
    credentialUrl: normalizeUrl(item.credentialUrl),
    issueDate: normalizeDate(item.issueDate),
    logoUrl: normalizeUrl(item.logoUrl),
  }));
}

function normalizeAchievements(
  items: PortfolioParseData['achievements'],
): NormalizedAchievement[] {
  return (items ?? []).map((item) => ({
    title: sanitizeString(item.title) ?? '',
    description: sanitizeString(item.description),
    metric: sanitizeString(item.metric),
    achievedAt: normalizeDate(item.achievedAt),
  }));
}

// Flattens the grouped {frontend: [...], backend: [...], ...} shape (v3
// prompt) back into the flat NormalizedSkill[] the resume mapper expects.
// Proficiency is never asked of the AI in the grouped shape, so it is
// always null here - see the trade-off note in schemas/portfolio.schema.ts.
function flattenGroupedSkills(
  grouped: PortfolioParseData['skills'],
): NormalizedSkill[] {
  if (!grouped) return [];
  const skills: NormalizedSkill[] = [];
  for (const key of SKILL_CATEGORY_KEYS) {
    for (const name of grouped[key] ?? []) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      skills.push({
        name: sanitizeString(trimmed) ?? trimmed,
        category: SKILL_CATEGORY_KEY_TO_ENUM[key],
        proficiency: null,
      });
    }
  }
  return skills;
}

// Flattens the grouped {github: "...", linkedin: "...", ...} shape (v3
// prompt) back into the flat NormalizedSocialLink[] the resume mapper
// expects.
function flattenGroupedSocialLinks(
  grouped: PortfolioParseData['socialLinks'],
): NormalizedSocialLink[] {
  if (!grouped) return [];
  const links: NormalizedSocialLink[] = [];
  for (const key of SOCIAL_PLATFORM_KEYS) {
    const url = normalizeUrl(grouped[key]);
    if (!url) continue;
    links.push({ platform: SOCIAL_PLATFORM_LABELS[key], url });
  }
  return links;
}

export function normalizePortfolioData(
  data: PortfolioParseData,
): NormalizedPortfolioData {
  const skills = flattenGroupedSkills(data.skills);
  const experience = normalizeExperience(data.experience);

  return {
    personalInfo: normalizePersonalInfo(
      data.personalInfo,
      computeYearsOfExperience(experience),
    ),
    skills: dedupeSkills(skills),
    experience,
    projects: normalizeProjects(data.projects),
    education: normalizeEducation(data.education),
    certifications: normalizeCertifications(data.certifications),
    achievements: normalizeAchievements(data.achievements),
    socialLinks: flattenGroupedSocialLinks(data.socialLinks),
  };
}
