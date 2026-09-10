import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// PROWEB narxlash tuzatishi — bir martalik skript.
//
// Ikki bug tuzatiladi:
// 1) `duration` bazaga umuman yozilmagan edi (onboard-proweb.ts'dagi xato — COURSES
//    massivida bor edi, lekin create() chaqiruviga qo'shishni unutgan edim).
// 2] `price` platforma konvensiyasiga zid — boshqa markazlarni tekshirib ko'rsam,
//    "Narx" maydoni OYLIK to'lov summasi sifatida ko'rsatiladi (masalan "Frontend"
//    listing: price=880000, duration="7 oy", paymentType="Oylik" — umumiy narx
//    emas). Men Prowebga umumiy kurs narxini yozgan edim — bu ularni haqiqiyidan
//    4-6 baravar qimmat ko'rsatib qo'ygan.
//
// Yangi price = (docx'dagi jami narx, chegirma bo'lsa chegirmali jami) / davomiylik (oy).
// Barcha hisob-kitob docx (clients/proweb/darslik.docx) dagi asl raqamlardan olingan,
// hech narsa taxmin qilinmagan.
//
// Foydalanish:
//   npx tsx scripts/fix-proweb-pricing.ts          (DRY RUN)
//   npx tsx scripts/fix-proweb-pricing.ts --commit (haqiqiy yozadi)

const DRY_RUN = !process.argv.includes("--commit");

const FIXES: {
  slug: string;
  price: number; // oylik, so'mda
  duration: string;
  discount: string | null;
}[] = [
  { slug: "data-analyst-7eljh", price: 1_800_000, duration: "5 oy", discount: null },
  { slug: "grafik-va-web-dizayn-dh0l2", price: 1_550_000, duration: "6 oy", discount: "9% chegirma — oyiga 1.700.000 o'rniga 1.550.000 so'm" },
  { slug: "videomontaj-csr9x", price: 1_550_000, duration: "5 oy", discount: "3% chegirma — oyiga 1.600.000 o'rniga 1.550.000 so'm" },
  { slug: "mobilografiya-lcgwe", price: 1_700_000, duration: "2 oy", discount: null },
  { slug: "3d-dizayn-va-3d-modellashtirish-0yw4r", price: 1_700_000, duration: "5 oy", discount: null },
  { slug: "pro-smm-bdzff", price: 1_700_000, duration: "4 oy", discount: "3% chegirma — oyiga 1.750.000 o'rniga 1.700.000 so'm" },
  { slug: "ms-office-6jmfw", price: 1_300_000, duration: "2 oy", discount: "4% chegirma — oyiga 1.350.000 o'rniga 1.300.000 so'm" },
  { slug: "kompyuter-yigish-kui0e", price: 1_350_000, duration: "3 oy", discount: null },
  { slug: "it-kids-fr0bk", price: 1_150_000, duration: "3 oy", discount: null },
  { slug: "prompt-engineering-lyzba", price: 1_400_000, duration: "2 oy", discount: null },
];

async function main() {
  console.log(`=== PROWEB narx/davomiylik tuzatish ${DRY_RUN ? "(DRY RUN)" : "(COMMIT)"} ===\n`);

  for (const fix of FIXES) {
    const existing = await prisma.listing.findUnique({ where: { slug: fix.slug } });
    if (!existing) throw new Error(`Listing topilmadi: slug="${fix.slug}"`);

    console.log(`[${existing.title}]`);
    console.log(`  price:    ${existing.price.toLocaleString("uz-UZ")} -> ${fix.price.toLocaleString("uz-UZ")}`);
    console.log(`  duration: "${existing.duration ?? ""}" -> "${fix.duration}"`);
    console.log(`  paymentType: "${existing.paymentType ?? ""}" -> "Oylik"`);
    console.log(`  discount: ${JSON.stringify(existing.discount)} -> ${JSON.stringify(fix.discount)}`);

    if (!DRY_RUN) {
      await prisma.listing.update({
        where: { slug: fix.slug },
        data: {
          price: fix.price,
          duration: fix.duration,
          paymentType: "Oylik",
          discount: fix.discount,
        },
      });
      console.log("  ✓ yangilandi");
    }
    console.log();
  }

  console.log(DRY_RUN ? "DRY RUN tugadi — hech narsa yozilmadi." : "Tugadi — hammasi yangilandi.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
