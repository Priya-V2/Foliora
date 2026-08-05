import { Injectable } from '@nestjs/common';
import { Resume } from '../generated/prisma';
import { ResumeParserService } from './services/resume-parser.service';
import { ParseResumeResult } from './types/portfolio.types';

// Public facade of the AI module. The Resume module (and anything else that
// ever needs AI parsing) talks to this service only - it never imports
// GeminiProvider, strategies, or prompts directly, which is what keeps the
// AI module provider-agnostic and swappable.
@Injectable()
export class AiService {
  constructor(private readonly resumeParserService: ResumeParserService) {}

  parseResume(resume: Resume): Promise<ParseResumeResult> {
    return this.resumeParserService.parseResume(resume);
  }
}
