import { Injectable } from '@nestjs/common';
import { GeminiProvider } from '../providers/gemini.provider';
import {
  ParserStrategy,
  ParserStrategyInput,
  ParserStrategyResult,
} from './parser-strategy.interface';

// Sends the uploaded file directly to Gemini's multimodal input, native
// mimetype, no conversion (per spec: PDF/DOC/DOCX are all forwarded as-is).
@Injectable()
export class PdfStrategy implements ParserStrategy {
  readonly name = 'PDF_NATIVE' as const;

  constructor(private readonly gemini: GeminiProvider) {}

  async parse(input: ParserStrategyInput): Promise<ParserStrategyResult> {
    const generation = await this.gemini.generateFromFile(
      input.fileBuffer,
      input.mimeType,
      input.prompt,
      input.responseJsonSchema,
    );
    return { generation };
  }
}
