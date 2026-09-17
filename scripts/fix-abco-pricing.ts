import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// ABCO narx/davomiylik tuzatishi — bir martalik skript.
//
// 1) `duration` bazaga yozilmagan edi — onboard-abco.ts'da (xuddi Proweb'dagi
//    xato kabi) create() chaqiruviga qo'shishni unutgan edim.
// 2) Foydalanuvchi Abco'dan haqiqiy narxlarni oldi (2026-09-17):
//    - ACCA: 5.500.000 / 1 paper / 3 oy -> oylik 1.833.000 (yaxlitlangan)
//    - DipIFR: 18.900.000 / kurs uchun. Foydalanuvchi "3 oy" dedi, lekin saytda
//      "4 oy" yozilgan edi. 18.9mln/3=6.300.000 (aniq son), 18.9mln/4=4.725.000
//      (unchalik aniq emas) — 3 oy versiyasi ustunroq, shuning uchun duration
//      ham 3 oyga tuzatildi.
//    - MSFO: 8.900.000 / 2 oylik kurs uchun (saytda "3 oy" yozilgan edi,
//      8.9mln/2=4.450.000 aniq, 8.9mln/3=2.966.666 aniq emas — 2 oy ustunroq,
//      duration ham 2 oyga tuzatildi).
//    - Akademik Ta'lim: to'g'ridan-to'g'ri oylik narx berilgan — 2.500.000/oy
//      (yillik to'lasa 19.000.000 — bu discount maydonida eslatiladi).
//    - Milliy Buxgalteriya (ikkala variant — Sertifikat va Diplom): foydalanuvchi
//      tasdiqladi — ikkalasi ham oyiga 2.000.000 so'mdan minimal.
//
// Foydalanish:
//   npx tsx scripts/fix-abco-pricing.ts          (DRY RUN)
//   npx tsx scripts/fix-abco-pricing.ts --commit (haqiqiy yozadi)

const DRY_RUN = !process.argv.includes("--commit");

const FIXES: {
  slug: string;
  price: number;
  duration: string;
  discount: string | null;
}[] = [
  { slug: "milliy-buxgalteriya-kursi-sertifikat-6-oy-83z8n", price: 2_000_000, duration: "6 oy", discount: null },
  { slug: "milliy-buxgalteriya-kursi-diplom-10-oy-4ih2g", price: 2_000_000, duration: "10 oy", discount: null },
  { slug: "akademik-talim-4-yillik-b9jsv", price: 2_500_000, duration: "4 yil", discount: "Yillik to'lasangiz 19.000.000 so'm (chegirma bilan)" },
  { slug: "msfo-kurslari-55zrq", price: 4_450_000, duration: "2 oy", discount: null },
  { slug: "dipifr-kurslari-tyw76", price: 6_300_000, duration: "3 oy", discount: null },
  { slug: "acca-kurslari-f1-f9-43ghj", price: 1_833_000, duration: "3 oy (har bir paper)", discount: null },
];

async function main() {
  console.log(`=== ABCO narx/davomiylik tuzatish ${DRY_RUN ? "(DRY RUN)" : "(COMMIT)"} ===\n`);

  for (const fix of FIXES) {
    const existing = await prisma.listing.findUnique({ where: { slug: fix.slug } });
    if (!existing) throw new Error(`Listing topilmadi: slug="${fix.slug}"`);

    console.log(`[${existing.title}]`);
    console.log(`  price:    ${existing.price.toLocaleString("uz-UZ")} -> ${fix.price.toLocaleString("uz-UZ")}`);
    console.log(`  duration: "${existing.duration ?? ""}" -> "${fix.duration}"`);
    console.log(`  discount: ${JSON.stringify(existing.discount)} -> ${JSON.stringify(fix.discount)}`);

    if (!DRY_RUN) {
      await prisma.listing.update({
        where: { slug: fix.slug },
        data: { price: fix.price, duration: fix.duration, discount: fix.discount },
      });
      console.log("  ✓ yangilandi");
    }
    console.log();
  }

  console.log(DRY_RUN ? "DRY RUN tugadi." : "Tugadi — hammasi yangilandi. Status hamon 'pending' — /admode/listings da ko'rib tasdiqlang.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
