import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'node:fs/promises';
import { PrismaService } from '../../database/prisma.service';
import {
  AiProvider,
  ParserStrategyType,
  Resume,
  ResumeParseRunStatus,
} from '../../generated/prisma';
import { GeminiProvider } from '../providers/gemini.provider';
import { RESUME_PROMPT_V3, RESUME_PROMPT_VERSION } from '../prompts/resume/v3';
import {
  PORTFOLIO_RESPONSE_JSON_SCHEMA,
  portfolioSchema,
} from '../schemas/portfolio.schema';
import { ExtractedTextStrategy } from '../strategies/extracted-text.strategy';
import { ParserStrategy } from '../strategies/parser-strategy.interface';
import { PdfStrategy } from '../strategies/pdf.strategy';
import { ParseResumeResult } from '../types/portfolio.types';
import { estimateCost } from '../utils/cost-estimator';
import { normalizePortfolioData } from '../utils/normalizer';

const CONFIG_STRATEGY_TO_PRISMA: Record<string, ParserStrategyType> = {
  pdf_native: ParserStrategyType.PDF_NATIVE,
  extracted_text: ParserStrategyType.EXTRACTED_TEXT,
};

interface StrategyRunOutcome {
  strategyType: ParserStrategyType;
  status: ResumeParseRunStatus;
  data: ReturnType<typeof normalizePortfolioData> | null;
  parseRunId: string;
  errorMessage?: string;
  extractedText?: string;
}

@Injectable()
export class ResumeParserService {
  private readonly logger = new Logger(ResumeParserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly gemini: GeminiProvider,
    private readonly pdfStrategy: PdfStrategy,
    private readonly extractedTextStrategy: ExtractedTextStrategy,
  ) {}

  async parseResume(resume: Resume): Promise<ParseResumeResult> {
    const primaryStrategyType = this.getConfiguredStrategyType();

    if (this.isBenchmarkModeActive()) {
      const [primaryOutcome, secondaryOutcome] = await this.runBenchmark(
        resume,
        primaryStrategyType,
      );
      this.logger.log(
        `Benchmark run for resume ${resume.id}: primary=${primaryOutcome.status} secondary=${secondaryOutcome.status}`,
      );
      return this.toParseResumeResult(primaryOutcome);
    }

    const strategy = this.resolveStrategy(primaryStrategyType);
    const outcome = await this.runStrategy(resume, strategy);
    return this.toParseResumeResult(outcome);
  }

  private async runBenchmark(
    resume: Resume,
    primaryStrategyType: ParserStrategyType,
  ): Promise<[StrategyRunOutcome, StrategyRunOutcome]> {
    const [pdfResult, textResult] = await Promise.allSettled([
      this.runStrategy(resume, this.pdfStrategy),
      this.runStrategy(resume, this.extractedTextStrategy),
    ]);

    const outcomes: Record<ParserStrategyType, StrategyRunOutcome> = {
      [ParserStrategyType.PDF_NATIVE]: this.settledToOutcome(
        pdfResult,
        ParserStrategyType.PDF_NATIVE,
      ),
      [ParserStrategyType.EXTRACTED_TEXT]: this.settledToOutcome(
        textResult,
        ParserStrategyType.EXTRACTED_TEXT,
      ),
    };

    const primary = outcomes[primaryStrategyType];
    const secondary =
      primaryStrategyType === ParserStrategyType.PDF_NATIVE
        ? outcomes[ParserStrategyType.EXTRACTED_TEXT]
        : outcomes[ParserStrategyType.PDF_NATIVE];

    return [primary, secondary];
  }

  private settledToOutcome(
    result: PromiseSettledResult<StrategyRunOutcome>,
    strategyType: ParserStrategyType,
  ): StrategyRunOutcome {
    if (result.status === 'fulfilled') return result.value;
    this.logger.error(
      `Benchmark strategy ${strategyType} rejected unexpectedly: ${result.reason}`,
    );
    return {
      strategyType,
      status: ResumeParseRunStatus.FAILED,
      data: null,
      parseRunId: '',
      errorMessage: 'Parsing failed unexpectedly.',
    };
  }

  private async runStrategy(
    resume: Resume,
    strategy: ParserStrategy,
  ): Promise<StrategyRunOutcome> {
    const strategyType =
      strategy.name === 'PDF_NATIVE'
        ? ParserStrategyType.PDF_NATIVE
        : ParserStrategyType.EXTRACTED_TEXT;

    const startedAt = Date.now();
    let rawText = '';
    let inputTokens: number | null = null;
    let outputTokens: number | null = null;
    let totalTokens: number | null = null;
    let extractedText: string | undefined;

    try {
      const fileBuffer = await readFile(resume.storagePath);
      const result = await strategy.parse({
        fileBuffer,
        mimeType: resume.fileType,
        prompt: RESUME_PROMPT_V3,
        responseJsonSchema: PORTFOLIO_RESPONSE_JSON_SCHEMA,
      });
      rawText = result.generation.text;
      inputTokens = result.generation.inputTokens;
      outputTokens = result.generation.outputTokens;
      totalTokens = result.generation.totalTokens;
      extractedText = result.extractedText;
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      const errorMessage = (error as Error).message;
      const parseRunId = await this.logParseRun({
        resumeId: resume.id,
        strategyType,
        status: ResumeParseRunStatus.FAILED,
        latencyMs,
        inputTokens,
        outputTokens,
        totalTokens,
        rawResponseJson: null,
        validationErrors: null,
        errorMessage,
      });
      this.logger.warn(
        `Resume parse failed (resume=${resume.id}, strategy=${strategyType}): ${errorMessage}`,
      );
      return {
        strategyType,
        status: ResumeParseRunStatus.FAILED,
        data: null,
        parseRunId,
        errorMessage,
      };
    }

    const latencyMs = Date.now() - startedAt;
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      const errorMessage = 'Gemini did not return valid JSON.';
      const parseRunId = await this.logParseRun({
        resumeId: resume.id,
        strategyType,
        status: ResumeParseRunStatus.FAILED,
        latencyMs,
        inputTokens,
        outputTokens,
        totalTokens,
        rawResponseJson: null,
        validationErrors: null,
        errorMessage,
      });
      return {
        strategyType,
        status: ResumeParseRunStatus.FAILED,
        data: null,
        parseRunId,
        errorMessage,
      };
    }

    const validation = portfolioSchema.safeParse(parsedJson);
    if (!validation.success) {
      const errorMessage = 'AI response failed structural validation.';
      const parseRunId = await this.logParseRun({
        resumeId: resume.id,
        strategyType,
        status: ResumeParseRunStatus.FAILED,
        latencyMs,
        inputTokens,
        outputTokens,
        totalTokens,
        rawResponseJson: parsedJson as object,
        validationErrors: validation.error.issues,
        errorMessage,
      });
      return {
        strategyType,
        status: ResumeParseRunStatus.FAILED,
        data: null,
        parseRunId,
        errorMessage,
      };
    }

    const normalized = normalizePortfolioData(validation.data);
    const parseRunId = await this.logParseRun({
      resumeId: resume.id,
      strategyType,
      status: ResumeParseRunStatus.SUCCESS,
      latencyMs,
      inputTokens,
      outputTokens,
      totalTokens,
      rawResponseJson: parsedJson as object,
      validationErrors: null,
      errorMessage: undefined,
    });

    return {
      strategyType,
      status: ResumeParseRunStatus.SUCCESS,
      data: normalized,
      parseRunId,
      extractedText,
    };
  }

  private async logParseRun(params: {
    resumeId: string;
    strategyType: ParserStrategyType;
    status: ResumeParseRunStatus;
    latencyMs: number;
    inputTokens: number | null;
    outputTokens: number | null;
    totalTokens: number | null;
    rawResponseJson: object | null;
    validationErrors: unknown;
    errorMessage?: string;
  }): Promise<string> {
    const model = this.gemini.getModel();
    const run = await this.prisma.resumeParseRun.create({
      data: {
        resumeId: params.resumeId,
        strategy: params.strategyType,
        provider: AiProvider.GEMINI,
        model,
        promptVersion: RESUME_PROMPT_VERSION,
        status: params.status,
        latencyMs: params.latencyMs,
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        totalTokens: params.totalTokens,
        estimatedCost: estimateCost(
          model,
          params.inputTokens,
          params.outputTokens,
        ),
        rawResponseJson: params.rawResponseJson ?? undefined,
        validationErrors: params.validationErrors
          ? params.validationErrors
          : undefined,
        errorMessage: params.errorMessage,
        environment: this.configService.getOrThrow<string>('ai.environment'),
      },
    });
    return run.id;
  }

  private toParseResumeResult(outcome: StrategyRunOutcome): ParseResumeResult {
    return {
      status: outcome.status,
      data: outcome.data,
      parseRunId: outcome.parseRunId,
      errorMessage: outcome.errorMessage,
      extractedText: outcome.extractedText,
    };
  }

  private getConfiguredStrategyType(): ParserStrategyType {
    const configured =
      this.configService.getOrThrow<string>('ai.parserStrategy');
    return (
      CONFIG_STRATEGY_TO_PRISMA[configured] ?? ParserStrategyType.PDF_NATIVE
    );
  }

  private resolveStrategy(strategyType: ParserStrategyType): ParserStrategy {
    return strategyType === ParserStrategyType.PDF_NATIVE
      ? this.pdfStrategy
      : this.extractedTextStrategy;
  }

  private isBenchmarkModeActive(): boolean {
    const benchmarkMode = this.configService.get<boolean>('ai.benchmarkMode');
    const environment = this.configService.get<string>('ai.environment');
    if (benchmarkMode && environment === 'production') {
      this.logger.warn(
        'AI_BENCHMARK_MODE is set but NODE_ENV is production - ignoring it.',
      );
      return false;
    }
    return Boolean(benchmarkMode);
  }
}
