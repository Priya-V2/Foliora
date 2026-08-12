-- AlterTable
ALTER TABLE "github_repositories" ADD COLUMN     "githubCreatedAt" TIMESTAMP(3),
ADD COLUMN     "githubUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "homepage" TEXT,
ADD COLUMN     "languages" JSONB,
ADD COLUMN     "openIssues" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pushedAt" TIMESTAMP(3),
ADD COLUMN     "techStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "watchers" INTEGER NOT NULL DEFAULT 0;
