-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "sessionCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
