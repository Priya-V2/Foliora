import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import { AiService } from '../ai/ai.service';
import { NormalizedPortfolioData } from '../ai/types/portfolio.types';
import { PrismaService } from '../database/prisma.service';
import { Prisma, ResumeStatus, StorageProvider } from '../generated/prisma';
import { ResumeResponseDto } from './dto/resume-response.dto';
import {
  MappedPortfolioData,
  mapNormalizedDataToPortfolio,
} from './mappers/portfolio.mapper';
import { generateUniqueSlug } from './utils/slug.util';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async getResume(userId: string): Promise<ResumeResponseDto | null> {
    const resume = await this.prisma.resume.findFirst({
      where: { userId, deletedAt: null },
    });

    return resume ? new ResumeResponseDto(resume) : null;
  }

  // Every user has at most one Resume row (unique on userId); uploading again
  // always upserts that same row rather than creating a new one, which is
  // also what makes this safe to call after a soft delete (see deleteResume).
  async uploadResume(
    userId: string,
    file?: Express.Multer.File,
  ): Promise<ResumeResponseDto> {
    if (!file) {
      throw new BadRequestException('Please select a resume file to upload.');
    }

    const previous = await this.prisma.resume.findUnique({
      where: { userId },
    });

    const metadata = {
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      storageProvider: StorageProvider.LOCAL,
      storagePath: file.path,
      fileUrl: `/resumes/${file.filename}`,
    };

    const resume = await this.prisma.resume.upsert({
      where: { userId },
      create: { userId, ...metadata },
      update: { ...metadata, deletedAt: null },
    });

    if (previous && previous.storagePath !== file.path) {
      await this.removeStoredFile(previous.storagePath);
    }

    return new ResumeResponseDto(resume);
  }

  async deleteResume(userId: string): Promise<void> {
    const resume = await this.prisma.resume.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!resume) {
      throw new NotFoundException('No resume found to delete.');
    }

    // Soft delete only (see docs/database.md - Resume is a soft-delete
    // model). The stored file is intentionally left in place; purging it is
    // a future retention job, not part of this request.
    await this.prisma.resume.update({
      where: { userId },
      data: { deletedAt: new Date() },
    });
  }

  private async removeStoredFile(storagePath: string): Promise<void> {
    try {
      await unlink(storagePath);
    } catch (error) {
      this.logger.warn(
        `Failed to remove previous resume file at "${storagePath}": ${(error as Error).message}`,
      );
    }
  }

  // Drives the full pipeline: load resume -> AiService (strategy -> Gemini
  // -> validate -> normalize) -> map to Prisma shapes -> save inside a
  // transaction -> mark the Resume PARSED. Used by both POST /resume/parse
  // and POST /resume/retry - retrying is just calling this again, since the
  // save step already replaces any previously-saved Portfolio data.
  async parseResume(userId: string): Promise<ResumeResponseDto> {
    const resume = await this.prisma.resume.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!resume) {
      throw new NotFoundException('No resume found to parse.');
    }

    await this.prisma.resume.update({
      where: { userId },
      data: { status: ResumeStatus.PARSING },
    });

    const result = await this.aiService.parseResume(resume);

    if (result.status !== 'SUCCESS' || !result.data) {
      await this.prisma.resume.update({
        where: { userId },
        data: { status: ResumeStatus.FAILED },
      });
      throw new UnprocessableEntityException(
        'We could not process your resume. Please try again.',
      );
    }

    await this.savePortfolioData(userId, result.data);

    const updated = await this.prisma.resume.update({
      where: { userId },
      data: {
        status: ResumeStatus.PARSED,
        parsedAt: new Date(),
        extractedText: result.extractedText,
      },
    });

    return new ResumeResponseDto(updated);
  }

  private async buildPortfolioTitle(
    userId: string,
    data: NormalizedPortfolioData,
  ): Promise<string> {
    if (data.personalInfo.fullName) {
      return `${data.personalInfo.fullName}'s Portfolio`;
    }

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true },
    });
    return `${user.name}'s Portfolio`;
  }

  // Upsert semantics at the Portfolio level: a user has at most one
  // Portfolio (unique on userId, see schema.prisma). Re-parsing (retry, or
  // parsing again later) replaces the AI-generated child collections rather
  // than duplicating them - delete-then-recreate inside one transaction, so
  // a failure leaves the previous data intact instead of half-replaced.
  private async savePortfolioData(
    userId: string,
    data: NormalizedPortfolioData,
  ): Promise<void> {
    const mapped = mapNormalizedDataToPortfolio(data);

    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.portfolio.findUnique({ where: { userId } });

      let portfolioId: string;

      if (existing) {
        portfolioId = existing.id;
        await tx.personalInfo.upsert({
          where: { portfolioId },
          create: { ...mapped.personalInfo, portfolioId },
          update: mapped.personalInfo,
        });

        await Promise.all([
          tx.skill.deleteMany({ where: { portfolioId } }),
          tx.experience.deleteMany({ where: { portfolioId } }),
          tx.project.deleteMany({ where: { portfolioId } }),
          tx.education.deleteMany({ where: { portfolioId } }),
          tx.certification.deleteMany({ where: { portfolioId } }),
          tx.achievement.deleteMany({ where: { portfolioId } }),
          tx.socialLink.deleteMany({ where: { portfolioId } }),
        ]);
      } else {
        const title = await this.buildPortfolioTitle(userId, data);
        const slug = await generateUniqueSlug(tx, title);

        const portfolio = await tx.portfolio.create({
          data: {
            userId,
            title,
            slug,
            personalInfo: { create: mapped.personalInfo },
          },
        });
        portfolioId = portfolio.id;
      }

      await this.createPortfolioChildren(tx, portfolioId, mapped);
    });
  }

  private async createPortfolioChildren(
    tx: Prisma.TransactionClient,
    portfolioId: string,
    mapped: MappedPortfolioData,
  ): Promise<void> {
    await Promise.all([
      mapped.skills.length &&
        tx.skill.createMany({
          data: mapped.skills.map((item) => ({ ...item, portfolioId })),
        }),
      mapped.experiences.length &&
        tx.experience.createMany({
          data: mapped.experiences.map((item) => ({ ...item, portfolioId })),
        }),
      mapped.projects.length &&
        tx.project.createMany({
          data: mapped.projects.map((item) => ({ ...item, portfolioId })),
        }),
      mapped.educations.length &&
        tx.education.createMany({
          data: mapped.educations.map((item) => ({ ...item, portfolioId })),
        }),
      mapped.certifications.length &&
        tx.certification.createMany({
          data: mapped.certifications.map((item) => ({
            ...item,
            portfolioId,
          })),
        }),
      mapped.achievements.length &&
        tx.achievement.createMany({
          data: mapped.achievements.map((item) => ({ ...item, portfolioId })),
        }),
      mapped.socialLinks.length &&
        tx.socialLink.createMany({
          data: mapped.socialLinks.map((item) => ({ ...item, portfolioId })),
        }),
    ]);
  }
}
