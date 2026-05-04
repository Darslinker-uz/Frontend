-- Filial darajasida ixtiyoriy narx — agar NULL bo'lsa asosiy Listing.price ishlatiladi.
-- Mavjud filiallar narxsiz qoladi, eski narx mexanizmi tegmaydi.
ALTER TABLE "listing_locations"
  ADD COLUMN "price" INTEGER;
