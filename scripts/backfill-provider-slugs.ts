import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { generateUniqueUserSlug } from "../src/lib/slug";

// Bir martalik backfill: slug=null bo'lgan provider'larga unikal slug beradi.
// Sabab: `slug` ustuni keyinroq (tutor-profiles migration) qo'shilgan, eski
// provider'lar onboarding slug logikasidan oldin yaratilgani uchun null qolgan.
// Natijada getActiveCenters/getActiveTutors (slug != null talab qiladi) ularni
// /oquv-markazlar va /repetitorlar ro'yxatlarida ko'rsatmas edi.
//
// Idempotent: faqat slug=null'larni yangilaydi, qayta ishga tushirish xavfsiz.
// Foydalanish:  npx tsx scripts/backfill-provider-slugs.ts          (haqiqiy)
//               npx tsx scripts/backfill-provider-slugs.ts --dry     (faqat ko'rsatadi)

async function main() {
  const dry = process.argv.includes("--dry");
  const providers = await prisma.user.findMany({
    where: { role: "provider", slug: null },
    select: { id: true, name: true, centerName: true, profileType: true },
    orderBy: { id: "asc" },
  });

  console.log(`slug=null provider: ${providers.length} ta${dry ? "  (DRY RUN — yozilmaydi)" : ""}`);

  let done = 0;
  for (const p of providers) {
    // CENTER → centerName, aks holda name (onboarding bilan bir xil mantiq)
    const base = (p.centerName?.trim() || p.name?.trim() || "").trim();
    const slug = await generateUniqueUserSlug(base || `provider-${p.id}`, p.id);
    if (dry) {
      console.log(`  [dry] #${p.id} ${JSON.stringify(base)} -> ${slug}`);
      continue;
    }
    await prisma.user.update({ where: { id: p.id }, data: { slug } });
    done++;
    console.log(`  ✓ #${p.id} -> ${slug}`);
  }
  console.log(dry ? "DRY RUN tugadi." : `Backfill tugadi: ${done} ta yangilandi.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
