-- CreateEnum
CREATE TYPE "AiProvider" AS ENUM ('GEMINI');

-- CreateEnum
CREATE TYPE "ParserStrategyType" AS ENUM ('PDF_NATIVE', 'EXTRACTED_TEXT');

-- CreateEnum
CREATE TYPE "ResumeParseRunStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "resume_parse_runs" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "strategy" "ParserStrategyType" NOT NULL,
    "provider" "AiProvider" NOT NULL DEFAULT 'GEMINI',
    "model" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "status" "ResumeParseRunStatus" NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "totalTokens" INTEGER,
    "estimatedCost" DECIMAL(10,6),
    "rawResponseJson" JSONB,
    "validationErrors" JSONB,
    "errorMessage" TEXT,
    "environment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_parse_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resume_parse_runs_resumeId_idx" ON "resume_parse_runs"("resumeId");

-- AddForeignKey
ALTER TABLE "resume_parse_runs" ADD CONSTRAINT "resume_parse_runs_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
