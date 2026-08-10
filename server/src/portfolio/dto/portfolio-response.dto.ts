import { ApiProperty } from '@nestjs/swagger';
import {
  Achievement,
  Certification,
  Education,
  Experience,
  PersonalInfo,
  Portfolio,
  Project,
  Skill,
  SocialLink,
} from '../../generated/prisma';
import { AchievementResponseDto } from './achievement.dto';
import { CertificationResponseDto } from './certification.dto';
import { EducationResponseDto } from './education.dto';
import { ExperienceResponseDto } from './experience.dto';
import { PersonalInfoResponseDto } from './personal-info.dto';
import { ProjectResponseDto } from './project.dto';
import { SkillResponseDto } from './skill.dto';
import { SocialLinkResponseDto } from './social-link.dto';

type PortfolioWithRelations = Portfolio & {
  personalInfo: PersonalInfo | null;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  socialLinks: SocialLink[];
};

// The single read model for the Review Parsed Data screen: the Portfolio
// graph produced by the resume-parse pipeline (ResumeService.savePortfolioData),
// shaped for direct display/editing. Deliberately omits internal linkage and
// audit fields (portfolioId, createdAt/updatedAt, deletedAt, templateId,
// visibility, publishingStatus, ...) that this screen has no use for.
export class PortfolioResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true, type: PersonalInfoResponseDto })
  personalInfo: PersonalInfoResponseDto | null;

  @ApiProperty({ type: [ExperienceResponseDto] })
  experiences: ExperienceResponseDto[];

  @ApiProperty({ type: [EducationResponseDto] })
  educations: EducationResponseDto[];

  @ApiProperty({ type: [SkillResponseDto] })
  skills: SkillResponseDto[];

  @ApiProperty({ type: [ProjectResponseDto] })
  projects: ProjectResponseDto[];

  @ApiProperty({ type: [CertificationResponseDto] })
  certifications: CertificationResponseDto[];

  @ApiProperty({ type: [AchievementResponseDto] })
  achievements: AchievementResponseDto[];

  @ApiProperty({ type: [SocialLinkResponseDto] })
  socialLinks: SocialLinkResponseDto[];

  constructor(portfolio: PortfolioWithRelations) {
    this.id = portfolio.id;
    this.title = portfolio.title;
    this.personalInfo = portfolio.personalInfo
      ? new PersonalInfoResponseDto(portfolio.personalInfo)
      : null;
    this.experiences = portfolio.experiences.map(
      (item) => new ExperienceResponseDto(item),
    );
    this.educations = portfolio.educations.map(
      (item) => new EducationResponseDto(item),
    );
    this.skills = portfolio.skills.map((item) => new SkillResponseDto(item));
    this.projects = portfolio.projects.map(
      (item) => new ProjectResponseDto(item),
    );
    this.certifications = portfolio.certifications.map(
      (item) => new CertificationResponseDto(item),
    );
    this.achievements = portfolio.achievements.map(
      (item) => new AchievementResponseDto(item),
    );
    this.socialLinks = portfolio.socialLinks.map(
      (item) => new SocialLinkResponseDto(item),
    );
  }
}
