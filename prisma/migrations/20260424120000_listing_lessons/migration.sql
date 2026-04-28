-- AlterTable
ALTER TABLE "listings" ADD COLUMN "lessons" TEXT[] DEFAULT ARRAY[]::TEXT[];
