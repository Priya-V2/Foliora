/*
  Warnings:

  - Added the required column `fileSize` to the `resumes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `resumes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePath` to the `resumes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('LOCAL', 'CLOUDINARY');

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL,
ADD COLUMN     "storagePath" TEXT NOT NULL,
ADD COLUMN     "storageProvider" "StorageProvider" NOT NULL DEFAULT 'LOCAL';
