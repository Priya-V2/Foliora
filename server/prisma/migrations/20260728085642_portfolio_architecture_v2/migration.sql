-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'ABOUT', 'PROJECTS', 'EXPERIENCE', 'SKILLS', 'EDUCATION', 'CERTIFICATIONS', 'ACHIEVEMENTS', 'BLOGS', 'TESTIMONIALS', 'CONTACT', 'SOCIAL_LINKS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PublishingStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DomainVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED');

-- CreateEnum
CREATE TYPE "SslStatus" AS ENUM ('PENDING', 'ACTIVE', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'BOT', 'OTHER');

-- DropIndex
DROP INDEX "achievements_portfolioId_idx";
DROP INDEX "blogs_portfolioId_idx";
DROP INDEX "certifications_deletedAt_idx";
DROP INDEX "certifications_portfolioId_idx";
DROP INDEX "educations_deletedAt_idx";
DROP INDEX "educations_portfolioId_idx";
DROP INDEX "experiences_deletedAt_idx";
DROP INDEX "experiences_portfolioId_idx";
DROP INDEX "projects_deletedAt_idx";
DROP INDEX "projects_portfolioId_idx";
DROP INDEX "skills_deletedAt_idx";
DROP INDEX "skills_portfolioId_idx";
DROP INDEX "social_links_deletedAt_idx";
DROP INDEX "social_links_portfolioId_idx";
DROP INDEX "testimonials_portfolioId_idx";

-- AlterTable: soft-delete consistency (see schema review)
ALTER TABLE "achievements" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "blogs" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "testimonials" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "resumes" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- AlterTable: rename (not drop+recreate) to preserve any existing encrypted tokens
ALTER TABLE "github_connections" RENAME COLUMN "accessToken" TO "accessTokenEncrypted";
ALTER TABLE "github_connections" ADD COLUMN "lastSyncedAt" TIMESTAMP(3);

-- AlterTable: publishing system
ALTER TABLE "portfolios"
  ADD COLUMN "publishingStatus" "PublishingStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "publishedAt" TIMESTAMP(3),
  ADD COLUMN "lastPublishedAt" TIMESTAMP(3),
  ADD COLUMN "lastDraftSavedAt" TIMESTAMP(3),
  ADD COLUMN "scheduledPublishAt" TIMESTAMP(3);

-- DataMigration: backfill publishingStatus/publishedAt from the boolean being replaced,
-- so portfolios that were already published don't silently revert to DRAFT.
UPDATE "portfolios"
SET "publishingStatus" = 'PUBLISHED',
    "publishedAt" = COALESCE("publishedAt", "updatedAt"),
    "lastPublishedAt" = COALESCE("lastPublishedAt", "updatedAt")
WHERE "published" = true;

ALTER TABLE "portfolios" DROP COLUMN "published";

-- AlterTable: GitHub import provenance
ALTER TABLE "projects" ADD COLUMN "sourceRepositoryId" TEXT;

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedByTokenId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "previewImage" TEXT,
    "thumbnail" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(10,2),
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_sections" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "customTitle" TEXT,
    "configuration" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_domains" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "subdomain" TEXT,
    "verificationStatus" "DomainVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verificationToken" TEXT NOT NULL,
    "sslStatus" "SslStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "dnsInstructions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "custom_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_views" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "visitorId" TEXT,
    "country" TEXT,
    "device" "DeviceType" NOT NULL DEFAULT 'OTHER',
    "browser" TEXT,
    "os" TEXT,
    "referrer" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_hashedToken_key" ON "refresh_tokens"("hashedToken");
CREATE UNIQUE INDEX "refresh_tokens_replacedByTokenId_key" ON "refresh_tokens"("replacedByTokenId");
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

CREATE UNIQUE INDEX "templates_slug_key" ON "templates"("slug");
CREATE INDEX "templates_category_idx" ON "templates"("category");
CREATE INDEX "templates_isActive_idx" ON "templates"("isActive");
CREATE INDEX "templates_isFeatured_idx" ON "templates"("isFeatured");

CREATE INDEX "portfolio_sections_portfolioId_displayOrder_idx" ON "portfolio_sections"("portfolioId", "displayOrder");

CREATE UNIQUE INDEX "custom_domains_domain_key" ON "custom_domains"("domain");
CREATE UNIQUE INDEX "custom_domains_verificationToken_key" ON "custom_domains"("verificationToken");
CREATE INDEX "custom_domains_portfolioId_idx" ON "custom_domains"("portfolioId");
CREATE INDEX "custom_domains_verificationStatus_idx" ON "custom_domains"("verificationStatus");
CREATE INDEX "custom_domains_deletedAt_idx" ON "custom_domains"("deletedAt");

CREATE INDEX "portfolio_views_portfolioId_viewedAt_idx" ON "portfolio_views"("portfolioId", "viewedAt");
CREATE INDEX "portfolio_views_portfolioId_sessionId_idx" ON "portfolio_views"("portfolioId", "sessionId");
CREATE INDEX "portfolio_views_portfolioId_visitorId_idx" ON "portfolio_views"("portfolioId", "visitorId");

CREATE INDEX "achievements_portfolioId_deletedAt_displayOrder_idx" ON "achievements"("portfolioId", "deletedAt", "displayOrder");
CREATE INDEX "blogs_portfolioId_deletedAt_displayOrder_idx" ON "blogs"("portfolioId", "deletedAt", "displayOrder");
CREATE INDEX "certifications_portfolioId_deletedAt_displayOrder_idx" ON "certifications"("portfolioId", "deletedAt", "displayOrder");
CREATE INDEX "educations_portfolioId_deletedAt_displayOrder_idx" ON "educations"("portfolioId", "deletedAt", "displayOrder");
CREATE INDEX "experiences_portfolioId_deletedAt_displayOrder_idx" ON "experiences"("portfolioId", "deletedAt", "displayOrder");
CREATE INDEX "portfolios_templateId_idx" ON "portfolios"("templateId");
CREATE INDEX "portfolios_publishingStatus_visibility_idx" ON "portfolios"("publishingStatus", "visibility");
CREATE INDEX "projects_portfolioId_deletedAt_displayOrder_idx" ON "projects"("portfolioId", "deletedAt", "displayOrder");
CREATE INDEX "projects_sourceRepositoryId_idx" ON "projects"("sourceRepositoryId");
CREATE INDEX "skills_portfolioId_deletedAt_displayOrder_idx" ON "skills"("portfolioId", "deletedAt", "displayOrder");
CREATE INDEX "social_links_portfolioId_deletedAt_displayOrder_idx" ON "social_links"("portfolioId", "deletedAt", "displayOrder");
CREATE INDEX "testimonials_portfolioId_deletedAt_displayOrder_idx" ON "testimonials"("portfolioId", "deletedAt", "displayOrder");

-- DataMigration: the existing seed portfolio stores templateId = 'minimal' as a bare
-- string (the exact anti-pattern this migration fixes). Backfill a matching catalog
-- row with that id so the new foreign key below can be added without breaking it or
-- silently nulling out the reference.
INSERT INTO "templates" ("id", "name", "slug", "category", "tags", "updatedAt")
VALUES ('minimal', 'Minimal', 'minimal', 'minimal', ARRAY[]::TEXT[], CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_replacedByTokenId_fkey" FOREIGN KEY ("replacedByTokenId") REFERENCES "refresh_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "portfolio_sections" ADD CONSTRAINT "portfolio_sections_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "projects" ADD CONSTRAINT "projects_sourceRepositoryId_fkey" FOREIGN KEY ("sourceRepositoryId") REFERENCES "github_repositories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "custom_domains" ADD CONSTRAINT "custom_domains_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "portfolio_views" ADD CONSTRAINT "portfolio_views_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
