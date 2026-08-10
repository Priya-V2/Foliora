import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { CurrentUserData } from '../auth/types/current-user.interface';
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
import { PortfolioService } from './portfolio.service';

@ApiTags('portfolio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  getPortfolio(
    @CurrentUser() user: CurrentUserData,
  ): Promise<PortfolioResponseDto | null> {
    return this.portfolioService.getPortfolio(user.id);
  }

  @Patch('personal-info')
  updatePersonalInfo(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdatePersonalInfoDto,
  ): Promise<PersonalInfoResponseDto> {
    return this.portfolioService.updatePersonalInfo(user.id, dto);
  }

  @Post('experiences')
  createExperience(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    return this.portfolioService.createExperience(user.id, dto);
  }

  @Patch('experiences/:id')
  updateExperience(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    return this.portfolioService.updateExperience(user.id, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('experiences/:id')
  async deleteExperience(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<void> {
    await this.portfolioService.deleteExperience(user.id, id);
  }

  @Post('educations')
  createEducation(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.portfolioService.createEducation(user.id, dto);
  }

  @Patch('educations/:id')
  updateEducation(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.portfolioService.updateEducation(user.id, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('educations/:id')
  async deleteEducation(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<void> {
    await this.portfolioService.deleteEducation(user.id, id);
  }

  @Post('skills')
  createSkill(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.portfolioService.createSkill(user.id, dto);
  }

  @Patch('skills/:id')
  updateSkill(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.portfolioService.updateSkill(user.id, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('skills/:id')
  async deleteSkill(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<void> {
    await this.portfolioService.deleteSkill(user.id, id);
  }

  @Post('projects')
  createProject(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.portfolioService.createProject(user.id, dto);
  }

  @Patch('projects/:id')
  updateProject(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.portfolioService.updateProject(user.id, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('projects/:id')
  async deleteProject(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<void> {
    await this.portfolioService.deleteProject(user.id, id);
  }

  @Post('certifications')
  createCertification(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateCertificationDto,
  ): Promise<CertificationResponseDto> {
    return this.portfolioService.createCertification(user.id, dto);
  }

  @Patch('certifications/:id')
  updateCertification(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateCertificationDto,
  ): Promise<CertificationResponseDto> {
    return this.portfolioService.updateCertification(user.id, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('certifications/:id')
  async deleteCertification(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<void> {
    await this.portfolioService.deleteCertification(user.id, id);
  }

  @Post('achievements')
  createAchievement(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateAchievementDto,
  ): Promise<AchievementResponseDto> {
    return this.portfolioService.createAchievement(user.id, dto);
  }

  @Patch('achievements/:id')
  updateAchievement(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateAchievementDto,
  ): Promise<AchievementResponseDto> {
    return this.portfolioService.updateAchievement(user.id, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('achievements/:id')
  async deleteAchievement(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<void> {
    await this.portfolioService.deleteAchievement(user.id, id);
  }

  @Post('social-links')
  createSocialLink(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateSocialLinkDto,
  ): Promise<SocialLinkResponseDto> {
    return this.portfolioService.createSocialLink(user.id, dto);
  }

  @Patch('social-links/:id')
  updateSocialLink(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateSocialLinkDto,
  ): Promise<SocialLinkResponseDto> {
    return this.portfolioService.updateSocialLink(user.id, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('social-links/:id')
  async deleteSocialLink(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ): Promise<void> {
    await this.portfolioService.deleteSocialLink(user.id, id);
  }
}
