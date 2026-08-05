import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

export interface GeminiGenerationResult {
  text: string;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
}

// The placeholder value shipped in .env.example - if this is still set at
// boot, the deploy is misconfigured and must fail fast rather than error on
// the first parse request.
const PLACEHOLDER_API_KEY = 'replace-with-your-gemini-api-key';

// Thin wrapper around the official Gemini SDK. This is the ONLY file in the
// codebase allowed to import from '@google/genai' - every other consumer
// (strategies, ResumeParserService) talks to this provider, never the SDK
// directly, which is what keeps the AI module provider-agnostic.
@Injectable()
export class GeminiProvider implements OnModuleInit {
  private readonly logger = new Logger(GeminiProvider.name);
  private client!: GoogleGenAI;
  private model!: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const apiKey = this.configService.get<string>('ai.gemini.apiKey');
    if (!apiKey || apiKey === PLACEHOLDER_API_KEY) {
      throw new Error(
        'GEMINI_API_KEY is not configured. Set a real Gemini API key before starting the server.',
      );
    }

    this.model = this.configService.getOrThrow<string>('ai.gemini.model');
    this.client = new GoogleGenAI({ apiKey });
    this.logger.log(`Gemini provider ready (model: ${this.model})`);
  }

  getModel(): string {
    return this.model;
  }

  async generateFromFile(
    fileBuffer: Buffer,
    mimeType: string,
    prompt: string,
    responseJsonSchema: unknown,
  ): Promise<GeminiGenerationResult> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: fileBuffer.toString('base64') } },
            { text: prompt },
          ],
        },
      ],
      config: { responseMimeType: 'application/json', responseJsonSchema },
    });

    console.log(JSON.stringify(response.usageMetadata, null, 2));

    return this.toResult(response);
  }

  async generateFromText(
    extractedText: string,
    prompt: string,
    responseJsonSchema: unknown,
  ): Promise<GeminiGenerationResult> {
    const response = await this.client.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [{ text: `${prompt}\n\nResume text:\n${extractedText}` }],
        },
      ],
      config: { responseMimeType: 'application/json', responseJsonSchema },
    });

    return this.toResult(response);
  }

  private toResult(response: {
    text?: string;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
    };
  }): GeminiGenerationResult {
    return {
      text: response.text ?? '',
      inputTokens: response.usageMetadata?.promptTokenCount ?? null,
      outputTokens: response.usageMetadata?.candidatesTokenCount ?? null,
      totalTokens: response.usageMetadata?.totalTokenCount ?? null,
    };
  }
}
