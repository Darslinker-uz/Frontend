-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BoostStatus" ADD VALUE 'pending';
ALTER TYPE "BoostStatus" ADD VALUE 'rejected';

-- AlterTable
ALTER TABLE "boosts" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reject_reason" TEXT,
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "boosts_listing_id_idx" ON "boosts"("listing_id");
