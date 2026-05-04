-- Listing rasmga qora qatlam shiddatini boshqarish (0-50)
-- Mavjud e'lonlar default 15 ga o'tadi (avvalgi hardcoded bg-black/15 bilan teng — vizual o'zgarmaydi)
ALTER TABLE "listings"
  ADD COLUMN "image_darkness" INTEGER NOT NULL DEFAULT 15;
