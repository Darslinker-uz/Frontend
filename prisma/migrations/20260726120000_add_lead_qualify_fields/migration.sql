-- Ariza yuborishdan oldingi ixtiyoriy kvalifikatsiya javoblari.
-- Faqat yangi ustunlar qo'shiladi; mavjud ustunlar va ma'lumotlarga tegilmaydi.
-- Eski qatorlarda start_timing/budget = NULL, preferred_times = '{}'.
ALTER TABLE "leads" ADD COLUMN "start_timing" TEXT;
ALTER TABLE "leads" ADD COLUMN "preferred_times" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "leads" ADD COLUMN "budget" TEXT;
