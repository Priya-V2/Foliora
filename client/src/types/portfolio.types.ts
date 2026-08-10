// Mirrors server/src/portfolio/dto/*.dto.ts response shapes. Dates cross the
// wire as ISO strings (Axios/JSON does not deserialize to Date).

export type SkillCategory =
  | "FRONTEND"
  | "BACKEND"
  | "DATABASE"
  | "CLOUD"
  | "DEVOPS"
  | "MOBILE"
  | "TOOLS"
  | "LANGUAGE"
  | "OTHER";

export const SKILL_CATEGORY_OPTIONS: { value: SkillCategory; label: string }[] = [
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "DATABASE", label: "Database" },
  { value: "CLOUD", label: "Cloud" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "MOBILE", label: "Mobile" },
  { value: "TOOLS", label: "Tools" },
  { value: "LANGUAGE", label: "Language" },
  { value: "OTHER", label: "Other" },
];

export interface PersonalInfo {
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

export type UpdatePersonalInfoInput = Partial<PersonalInfo>;

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  description: string | null;
  technologies: string[];
  achievements: string[];
  startDate: string;
  endDate: string | null;
  current: boolean;
  displayOrder: number;
}

export type ExperienceInput = {
  company: string;
  role: string;
  location?: string;
  description?: string;
  technologies?: string[];
  achievements?: string[];
  startDate: string;
  endDate?: string;
  current?: boolean;
};

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  cgpa: number | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  displayOrder: number;
}

export type EducationInput = {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  cgpa?: number;
  startDate: string;
  endDate?: string;
  description?: string;
};

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number | null;
  displayOrder: number;
}

export type SkillInput = {
  name: string;
  category: SkillCategory;
  proficiency?: number;
};

export interface Project {
  id: string;
  title: string;
  description: string | null;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  displayOrder: number;
}

export type ProjectInput = {
  title: string;
  description?: string;
  techStack?: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
};

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  credentialId: string | null;
  credentialUrl: string | null;
  issueDate: string | null;
  logoUrl: string | null;
  displayOrder: number;
}

export type CertificationInput = {
  title: string;
  issuer: string;
  credentialId?: string;
  credentialUrl?: string;
  issueDate?: string;
  logoUrl?: string;
};

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  metric: string | null;
  achievedAt: string | null;
  displayOrder: number;
}

export type AchievementInput = {
  title: string;
  description?: string;
  metric?: string;
  achievedAt?: string;
};

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  displayOrder: number;
}

export type SocialLinkInput = {
  platform: string;
  url: string;
};

export interface Portfolio {
  id: string;
  title: string;
  personalInfo: PersonalInfo | null;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  socialLinks: SocialLink[];
}
