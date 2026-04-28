-- Add 'blog' to ArticleType enum + author/readTime fields to articles

-- AlterEnum
ALTER TYPE "ArticleType" ADD VALUE 'blog';

-- AlterTable
ALTER TABLE "articles"
  ADD COLUMN "author" TEXT,
  ADD COLUMN "read_time" TEXT;
