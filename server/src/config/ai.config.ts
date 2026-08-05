import { registerAs } from '@nestjs/config';

// Centralized AI/resume-parsing configuration, mirroring the pattern in
// auth.config.ts / resume.config.ts. Gemini is the only provider today, but
// the `ai` namespace (not `gemini`) keeps this module provider-agnostic if a
// second provider is ever added.
export default registerAs('ai', () => ({
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
  },
  parserStrategy: (process.env.AI_PARSER_STRATEGY ?? 'pdf_native') as
    'pdf_native' | 'extracted_text',
  // Runs both parsing strategies and logs a ResumeParseRun for each so they
  // can be compared. Dev/test only - ResumeParserService force-disables this
  // in production regardless of the env var.
  benchmarkMode: process.env.AI_BENCHMARK_MODE === 'true',
  promptVersion: 'v2',
  environment: process.env.NODE_ENV ?? 'development',
}));
