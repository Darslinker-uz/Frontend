-- AlterTable (keyingi transaction — enum pending/rejected allaqachon commit qilingan)
ALTER TABLE "boosts" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reject_reason" TEXT,
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "boosts_listing_id_idx" ON "boosts"("listing_id");
