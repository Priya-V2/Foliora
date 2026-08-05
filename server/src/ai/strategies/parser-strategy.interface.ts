import { GeminiGenerationResult } from '../providers/gemini.provider';

export interface ParserStrategyInput {
  fileBuffer: Buffer;
  mimeType: string;
  prompt: string;
  responseJsonSchema: unknown;
}

export interface ParserStrategyResult {
  generation: GeminiGenerationResult;
  // Only set by the Extracted-Text strategy - the plain text it pulled from
  // the document before sending it to Gemini. PDF-native never extracts
  // text separately, so this stays undefined there (Resume.extractedText is
  // only populated when we actually have extracted text to store).
  extractedText?: string;
}

// Strategies are interchangeable: ResumeParserService picks one (or runs
// both, in Benchmark Mode) without caring how the raw text made it to
// Gemini - inline file bytes vs. extracted text is an internal detail.
export interface ParserStrategy {
  readonly name: 'PDF_NATIVE' | 'EXTRACTED_TEXT';
  parse(input: ParserStrategyInput): Promise<ParserStrategyResult>;
}
