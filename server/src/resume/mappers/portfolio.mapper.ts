import { NormalizedPortfolioData } from '../../ai/types/portfolio.types';
import { Prisma } from '../../generated/prisma';

// Converts AI-normalized data into Prisma nested-write shapes. This is
// where the AI module's output stops being "AI concerns" and becomes
// "Portfolio domain concerns" - the ai/ module never imports Prisma models
// beyond the enums it needs for validation.
export interface MappedPortfolioData {
  personalInfo: Prisma.PersonalInfoCreateWithoutPortfolioInput;
  skills: Prisma.SkillCreateWithoutPortfolioInput[];
  experiences: Prisma.ExperienceCreateWithoutPortfolioInput[];
  projects: Prisma.ProjectCreateWithoutPortfolioInput[];
  educations: Prisma.EducationCreateWithoutPortfolioInput[];
  certifications: Prisma.CertificationCreateWithoutPortfolioInput[];
  achievements: Prisma.AchievementCreateWithoutPortfolioInput[];
  socialLinks: Prisma.SocialLinkCreateWithoutPortfolioInput[];
}

export function mapNormalizedDataToPortfolio(
  data: NormalizedPortfolioData,
): MappedPortfolioData {
  return {
    personalInfo: {
      fullName: data.personalInfo.fullName ?? undefined,
      role: data.personalInfo.role ?? undefined,
      headline: data.personalInfo.headline ?? undefined,
      bio: data.personalInfo.bio ?? undefined,
      location: data.personalInfo.location ?? undefined,
      email: data.personalInfo.email ?? undefined,
      phone: data.personalInfo.phone ?? undefined,
      website: data.personalInfo.website ?? undefined,
      availability: data.personalInfo.availability ?? undefined,
      yearsOfExperience: data.personalInfo.yearsOfExperience ?? undefined,
    },

    skills: data.skills.map((skill, index) => ({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency ?? undefined,
      displayOrder: index,
    })),

    // Experience.startDate is a required (non-null) column - an entry the
    // resume didn't clearly state a start date for is dropped rather than
    // saved with a fabricated date (see prompt: "never hallucinate").
    experiences: data.experience
      .filter((item) => item.startDate !== null)
      .map((item, index) => ({
        company: item.company,
        role: item.role,
        location: item.location ?? undefined,
        description: item.description ?? undefined,
        technologies: item.technologies,
        achievements: item.achievements,
        startDate: item.startDate as Date,
        endDate: item.endDate ?? undefined,
        current: item.current,
        displayOrder: index,
      })),

    projects: data.projects.map((item, index) => ({
      title: item.title,
      description: item.description ?? undefined,
      techStack: item.techStack,
      githubUrl: item.githubUrl ?? undefined,
      demoUrl: item.demoUrl ?? undefined,
      imageUrl: item.imageUrl ?? undefined,
      displayOrder: index,
    })),

    // Education.startDate is also required - same drop-rather-than-fabricate
    // rule as Experience above.
    educations: data.education
      .filter((item) => item.startDate !== null)
      .map((item, index) => ({
        institution: item.institution,
        degree: item.degree,
        fieldOfStudy: item.fieldOfStudy ?? undefined,
        cgpa: item.cgpa ?? undefined,
        startDate: item.startDate as Date,
        endDate: item.endDate ?? undefined,
        description: item.description ?? undefined,
        displayOrder: index,
      })),

    certifications: data.certifications.map((item, index) => ({
      title: item.title,
      issuer: item.issuer,
      credentialId: item.credentialId ?? undefined,
      credentialUrl: item.credentialUrl ?? undefined,
      issueDate: item.issueDate ?? undefined,
      logoUrl: item.logoUrl ?? undefined,
      displayOrder: index,
    })),

    achievements: data.achievements.map((item, index) => ({
      title: item.title,
      description: item.description ?? undefined,
      metric: item.metric ?? undefined,
      achievedAt: item.achievedAt ?? undefined,
      displayOrder: index,
    })),

    socialLinks: data.socialLinks.map((item, index) => ({
      platform: item.platform,
      url: item.url,
      displayOrder: index,
    })),
  };
}
