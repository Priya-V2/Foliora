import { BadRequestException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { extname, resolve } from 'node:path';
import { diskStorage } from 'multer';
import { AiModule } from '../ai/ai.module';
import { DatabaseModule } from '../database/database.module';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { isAllowedResumeMimeType } from './validators/resume-file.validator';

@Module({
  imports: [
    AiModule,
    DatabaseModule,
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uploadDir = resolve(
          process.cwd(),
          configService.getOrThrow<string>('resume.uploadDir'),
        );
        mkdirSync(uploadDir, { recursive: true });

        return {
          storage: diskStorage({
            destination: uploadDir,
            filename: (_req, file, callback) => {
              callback(null, `${randomUUID()}${extname(file.originalname)}`);
            },
          }),
          fileFilter: (_req, file, callback) => {
            if (!isAllowedResumeMimeType(file.mimetype)) {
              callback(
                new BadRequestException(
                  'Unsupported file type. Please upload a PDF, DOC, or DOCX file.',
                ),
                false,
              );
              return;
            }
            callback(null, true);
          },
          limits: {
            fileSize:
              configService.getOrThrow<number>('resume.maxFileSizeMb') *
              1024 *
              1024,
          },
        };
      },
    }),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
