import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AiService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';
import { ResumeParserService } from './services/resume-parser.service';
import { ExtractedTextStrategy } from './strategies/extracted-text.strategy';
import { PdfStrategy } from './strategies/pdf.strategy';

@Module({
  imports: [DatabaseModule],
  providers: [
    AiService,
    ResumeParserService,
    GeminiProvider,
    PdfStrategy,
    ExtractedTextStrategy,
  ],
  exports: [AiService],
})
export class AiModule {}
