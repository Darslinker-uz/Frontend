-- Bir boost bron paytida ko'p Boost yozuvi yaratilsa (band kun aralash bo'lganda),
-- hammasini birga belgilash uchun bundleId. Admin bittasini tasdiqlasa, hammasi tasdiqlanadi.
ALTER TABLE "boosts"
  ADD COLUMN "bundle_id" TEXT;

CREATE INDEX "boosts_bundle_id_idx" ON "boosts"("bundle_id");
CREATE INDEX "boosts_type_status_startDate_endDate_idx"
  ON "boosts"("type", "status", "start_date", "end_date");
