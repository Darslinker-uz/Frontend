-- AlterTable
ALTER TABLE "listings" ADD COLUMN "level" TEXT;
ALTER TABLE "listings" ADD COLUMN "student_limit" INTEGER;
ALTER TABLE "listings" ADD COLUMN "schedule" TEXT;
ALTER TABLE "listings" ADD COLUMN "certificate" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "listings" ADD COLUMN "demo_lesson" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "listings" ADD COLUMN "discount" TEXT;
ALTER TABLE "listings" ADD COLUMN "teacher_name" TEXT;
ALTER TABLE "listings" ADD COLUMN "teacher_experience" TEXT;
ALTER TABLE "listings" ADD COLUMN "payment_type" TEXT;
