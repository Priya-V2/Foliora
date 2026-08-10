import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Portfolio } from '../generated/prisma';
import {
  AchievementResponseDto,
  CreateAchievementDto,
  UpdateAchievementDto,
} from './dto/achievement.dto';
import {
  CertificationResponseDto,
  CreateCertificationDto,
  UpdateCertificationDto,
} from './dto/certification.dto';
import {
  CreateEducationDto,
  EducationResponseDto,
  UpdateEducationDto,
} from './dto/education.dto';
import {
  CreateExperienceDto,
  ExperienceResponseDto,
  UpdateExperienceDto,
} from './dto/experience.dto';
import {
  PersonalInfoResponseDto,
  UpdatePersonalInfoDto,
} from './dto/personal-info.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import {
  CreateProjectDto,
  ProjectResponseDto,
  UpdateProjectDto,
} from './dto/project.dto';
import {
  CreateSkillDto,
  SkillResponseDto,
  UpdateSkillDto,
} from './dto/skill.dto';
import {
  CreateSocialLinkDto,
  SocialLinkResponseDto,
  UpdateSocialLinkDto,
} from './dto/social-link.dto';

const PORTFOLIO_INCLUDE = {
  personalInfo: true,
  experiences: {
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' as const },
  },
  educations: {
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' as const },
  },
  skills: {
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' as const },
  },
  projects: {
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' as const },
  },
  certifications: {
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' as const },
  },
  achievements: {
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' as const },
  },
  socialLinks: {
    where: { deletedAt: null },
    orderBy: { displayOrder: 'asc' as const },
  },
};

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async getPortfolio(userId: string): Promise<PortfolioResponseDto | null> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
      include: PORTFOLIO_INCLUDE,
    });

    return portfolio ? new PortfolioResponseDto(portfolio) : null;
  }

  private async findOwnedPortfolio(userId: string): Promise<Portfolio> {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });

    if (!portfolio) {
      throw new NotFoundException(
        'Portfolio not found. Please upload and parse a resume first.',
      );
    }

    return portfolio;
  }

  // ---------------------------------------------------------------------
  // Personal Info (1:1 singleton, PATCH-only)
  // ---------------------------------------------------------------------

  async updatePersonalInfo(
    userId: string,
    dto: UpdatePersonalInfoDto,
  ): Promise<PersonalInfoResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);

    const personalInfo = await this.prisma.personalInfo.upsert({
      where: { portfolioId: portfolio.id },
      create: { portfolioId: portfolio.id, ...dto },
      update: dto,
    });

    return new PersonalInfoResponseDto(personalInfo);
  }

  // ---------------------------------------------------------------------
  // Experience
  // ---------------------------------------------------------------------

  async createExperience(
    userId: string,
    dto: CreateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    const displayOrder = await this.prisma.experience.count({
      where: { portfolioId: portfolio.id, deletedAt: null },
    });

    const experience = await this.prisma.experience.create({
      data: {
        portfolioId: portfolio.id,
        company: dto.company,
        role: dto.role,
        location: dto.location,
        description: dto.description,
        technologies: dto.technologies ?? [],
        achievements: dto.achievements ?? [],
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        current: dto.current ?? false,
        displayOrder,
      },
    });

    return new ExperienceResponseDto(experience);
  }

  async updateExperience(
    userId: string,
    id: string,
    dto: UpdateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.experience.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Experience',
    );

    const experience = await this.prisma.experience.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });

    return new ExperienceResponseDto(experience);
  }

  async deleteExperience(userId: string, id: string): Promise<void> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.experience.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Experience',
    );

    await this.prisma.experience.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ---------------------------------------------------------------------
  // Education
  // ---------------------------------------------------------------------

  async createEducation(
    userId: string,
    dto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    const displayOrder = await this.prisma.education.count({
      where: { portfolioId: portfolio.id, deletedAt: null },
    });

    const education = await this.prisma.education.create({
      data: {
        portfolioId: portfolio.id,
        institution: dto.institution,
        degree: dto.degree,
        fieldOfStudy: dto.fieldOfStudy,
        cgpa: dto.cgpa,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        description: dto.description,
        displayOrder,
      },
    });

    return new EducationResponseDto(education);
  }

  async updateEducation(
    userId: string,
    id: string,
    dto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.education.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Education',
    );

    const education = await this.prisma.education.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });

    return new EducationResponseDto(education);
  }

  async deleteEducation(userId: string, id: string): Promise<void> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.education.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Education',
    );

    await this.prisma.education.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ---------------------------------------------------------------------
  // Skill
  // ---------------------------------------------------------------------

  async createSkill(
    userId: string,
    dto: CreateSkillDto,
  ): Promise<SkillResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    const displayOrder = await this.prisma.skill.count({
      where: { portfolioId: portfolio.id, deletedAt: null },
    });

    const skill = await this.prisma.skill.create({
      data: {
        portfolioId: portfolio.id,
        name: dto.name,
        category: dto.category,
        proficiency: dto.proficiency,
        displayOrder,
      },
    });

    return new SkillResponseDto(skill);
  }

  async updateSkill(
    userId: string,
    id: string,
    dto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.skill.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Skill',
    );

    const skill = await this.prisma.skill.update({ where: { id }, data: dto });

    return new SkillResponseDto(skill);
  }

  async deleteSkill(userId: string, id: string): Promise<void> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.skill.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Skill',
    );

    await this.prisma.skill.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ---------------------------------------------------------------------
  // Project
  // ---------------------------------------------------------------------

  async createProject(
    userId: string,
    dto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    const displayOrder = await this.prisma.project.count({
      where: { portfolioId: portfolio.id, deletedAt: null },
    });

    const project = await this.prisma.project.create({
      data: {
        portfolioId: portfolio.id,
        title: dto.title,
        description: dto.description,
        techStack: dto.techStack ?? [],
        githubUrl: dto.githubUrl,
        demoUrl: dto.demoUrl,
        imageUrl: dto.imageUrl,
        featured: dto.featured ?? false,
        displayOrder,
      },
    });

    return new ProjectResponseDto(project);
  }

  async updateProject(
    userId: string,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.project.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Project',
    );

    const project = await this.prisma.project.update({
      where: { id },
      data: dto,
    });

    return new ProjectResponseDto(project);
  }

  async deleteProject(userId: string, id: string): Promise<void> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.project.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Project',
    );

    await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ---------------------------------------------------------------------
  // Certification
  // ---------------------------------------------------------------------

  async createCertification(
    userId: string,
    dto: CreateCertificationDto,
  ): Promise<CertificationResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    const displayOrder = await this.prisma.certification.count({
      where: { portfolioId: portfolio.id, deletedAt: null },
    });

    const certification = await this.prisma.certification.create({
      data: {
        portfolioId: portfolio.id,
        title: dto.title,
        issuer: dto.issuer,
        credentialId: dto.credentialId,
        credentialUrl: dto.credentialUrl,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        logoUrl: dto.logoUrl,
        displayOrder,
      },
    });

    return new CertificationResponseDto(certification);
  }

  async updateCertification(
    userId: string,
    id: string,
    dto: UpdateCertificationDto,
  ): Promise<CertificationResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.certification.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Certification',
    );

    const certification = await this.prisma.certification.update({
      where: { id },
      data: {
        ...dto,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
      },
    });

    return new CertificationResponseDto(certification);
  }

  async deleteCertification(userId: string, id: string): Promise<void> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.certification.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Certification',
    );

    await this.prisma.certification.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ---------------------------------------------------------------------
  // Achievement
  // ---------------------------------------------------------------------

  async createAchievement(
    userId: string,
    dto: CreateAchievementDto,
  ): Promise<AchievementResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    const displayOrder = await this.prisma.achievement.count({
      where: { portfolioId: portfolio.id, deletedAt: null },
    });

    const achievement = await this.prisma.achievement.create({
      data: {
        portfolioId: portfolio.id,
        title: dto.title,
        description: dto.description,
        metric: dto.metric,
        achievedAt: dto.achievedAt ? new Date(dto.achievedAt) : undefined,
        displayOrder,
      },
    });

    return new AchievementResponseDto(achievement);
  }

  async updateAchievement(
    userId: string,
    id: string,
    dto: UpdateAchievementDto,
  ): Promise<AchievementResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.achievement.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Achievement',
    );

    const achievement = await this.prisma.achievement.update({
      where: { id },
      data: {
        ...dto,
        achievedAt: dto.achievedAt ? new Date(dto.achievedAt) : undefined,
      },
    });

    return new AchievementResponseDto(achievement);
  }

  async deleteAchievement(userId: string, id: string): Promise<void> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.achievement.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Achievement',
    );

    await this.prisma.achievement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ---------------------------------------------------------------------
  // Social Link
  // ---------------------------------------------------------------------

  async createSocialLink(
    userId: string,
    dto: CreateSocialLinkDto,
  ): Promise<SocialLinkResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    const displayOrder = await this.prisma.socialLink.count({
      where: { portfolioId: portfolio.id, deletedAt: null },
    });

    const socialLink = await this.prisma.socialLink.create({
      data: {
        portfolioId: portfolio.id,
        platform: dto.platform,
        url: dto.url,
        displayOrder,
      },
    });

    return new SocialLinkResponseDto(socialLink);
  }

  async updateSocialLink(
    userId: string,
    id: string,
    dto: UpdateSocialLinkDto,
  ): Promise<SocialLinkResponseDto> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.socialLink.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Social link',
    );

    const socialLink = await this.prisma.socialLink.update({
      where: { id },
      data: dto,
    });

    return new SocialLinkResponseDto(socialLink);
  }

  async deleteSocialLink(userId: string, id: string): Promise<void> {
    const portfolio = await this.findOwnedPortfolio(userId);
    await this.assertExists(
      this.prisma.socialLink.findFirst({
        where: { id, portfolioId: portfolio.id, deletedAt: null },
      }),
      'Social link',
    );

    await this.prisma.socialLink.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Ownership guard shared by every section's update/delete path: confirms
  // the record exists and belongs to the caller's own Portfolio before any
  // mutation runs, without needing a generic Prisma delegate abstraction.
  private async assertExists<T>(
    lookup: Promise<T | null>,
    label: string,
  ): Promise<T> {
    const record = await lookup;

    if (!record) {
      throw new NotFoundException(`${label} not found.`);
    }

    return record;
  }
}
