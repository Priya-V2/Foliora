import { Injectable } from '@nestjs/common';
import { GeminiProvider } from '../providers/gemini.provider';
import { extractTextFromFile } from '../utils/text-extractor';
import {
  ParserStrategy,
  ParserStrategyInput,
  ParserStrategyResult,
} from './parser-strategy.interface';

// Extracts plain text first (utils/text-extractor.ts), then sends
// text + prompt to Gemini - no file upload involved.
@Injectable()
export class ExtractedTextStrategy implements ParserStrategy {
  readonly name = 'EXTRACTED_TEXT' as const;

  constructor(private readonly gemini: GeminiProvider) {}

  async parse(input: ParserStrategyInput): Promise<ParserStrategyResult> {
    const extractedText = await extractTextFromFile(
      input.fileBuffer,
      input.mimeType,
    );
    const generation = await this.gemini.generateFromText(
      extractedText,
      input.prompt,
      input.responseJsonSchema,
    );
    return { generation, extractedText };
  }
}
