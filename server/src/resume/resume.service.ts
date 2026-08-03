import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import { PrismaService } from '../database/prisma.service';
import { StorageProvider } from '../generated/prisma';
import { ResumeResponseDto } from './dto/resume-response.dto';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(private readonly prisma: PrismaService) {}

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
}
