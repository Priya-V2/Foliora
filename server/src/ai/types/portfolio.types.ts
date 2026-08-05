import { SkillCategory } from '../../generated/prisma';

// Post-normalization shape (utils/normalizer.ts): strings trimmed/sanitized,
// dates parsed to Date | null, URLs normalized, skills deduped. This is what
// crosses the AI module's public boundary (AiService.parseResume) - the
// resume module's mapper turns this into Prisma nested-write input, never
// the raw AI output.

export interface NormalizedPersonalInfo {
  fullName: string | null;
  role: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  availability: string | null;
  yearsOfExperience: number | null;
}

export interface NormalizedSkill {
  name: string;
  category: SkillCategory;
  proficiency: number | null;
}

export interface NormalizedExperience {
  company: string;
  role: string;
  location: string | null;
  description: string | null;
  technologies: string[];
  achievements: string[];
  startDate: Date | null;
  endDate: Date | null;
  current: boolean;
}

export interface NormalizedProject {
  title: string;
  description: string | null;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
}

export interface NormalizedEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  cgpa: number | null;
  startDate: Date | null;
  endDate: Date | null;
  description: string | null;
}

export interface NormalizedCertification {
  title: string;
  issuer: string;
  credentialId: string | null;
  credentialUrl: string | null;
  issueDate: Date | null;
  logoUrl: string | null;
}

export interface NormalizedAchievement {
  title: string;
  description: string | null;
  metric: string | null;
  achievedAt: Date | null;
}

export interface NormalizedSocialLink {
  platform: string;
  url: string;
}

export interface NormalizedPortfolioData {
  personalInfo: NormalizedPersonalInfo;
  skills: NormalizedSkill[];
  experience: NormalizedExperience[];
  projects: NormalizedProject[];
  education: NormalizedEducation[];
  certifications: NormalizedCertification[];
  achievements: NormalizedAchievement[];
  socialLinks: NormalizedSocialLink[];
}

export interface ParseResumeResult {
  status: 'SUCCESS' | 'FAILED';
  data: NormalizedPortfolioData | null;
  parseRunId: string;
  errorMessage?: string;
  // Only set when the Extracted-Text strategy produced it; see
  // ParserStrategyResult.extractedText.
  extractedText?: string;
}
