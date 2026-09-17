import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { generateUniqueUserSlug, slugify } from "../src/lib/slug";

// ABCO-AKADEMIYA hamkorlik onboarding — bir martalik skript.
// Ma'lumotlar https://www.abco-akademiya.uz/uz saytidan olingan (docx berilmagan).
//
// MUHIM — narx hali noma'lum (Abco javob bermayapti). Shuning uchun:
// - price = 1 (aniq placeholder — 0 "Bepul" deb chiqib ketardi, bu yolg'on bo'lardi)
// - discount maydoniga ko'rinadigan ogohlantirish yozilgan
// - status HAR DOIM "pending" — narx to'g'irlanmasdan tasdiqlanmasin
//
// Xavfsizlik: pending bo'lgani uchun hech narsa saytda ko'rinmaydi. Narx kelgach:
//   1) /admode/listings/[id]/edit da price'ni yangilang, discount'dagi ogohlantirishni tozalang
//   2) keyin tasdiqlang (approve)
//
// Foydalanish:
//   npx tsx scripts/onboard-abco.ts          (DRY RUN)
//   npx tsx scripts/onboard-abco.ts --commit (haqiqiy yozadi)

const DRY_RUN = !process.argv.includes("--commit");
const PRICE_PLACEHOLDER = 1;
const PRICE_WARNING = "⚠️ NARX VAQTINCHA QO'YILGAN (Abco hali javob bermagan) — TASDIQLASHDAN OLDIN NARXNI TO'G'IRLANG";

const CENTER = {
  centerName: "ABCO Akademiya",
  name: "ABCO Akademiya",
  phone: "+998 78 113 48 00",
  telegram: "abcoouz",
  website: "https://www.abco-akademiya.uz",
  region: "Toshkent shahri",
  district: "Chilonzor",
  location: "Bunyodkor shoh ko'chasi, 7G",
  bio: [
    "ABCO Akademiya — Toshkentda buxgalteriya va xalqaro moliyaviy hisobot standartlari (MSFO, ACCA) bo'yicha ta'lim beruvchi markaz.",
    "Markaz milliy buxgalteriya asoslaridan tortib, ACCA (Association of Chartered Certified Accountants) xalqaro tashkilotining F1-F9 darajalarigacha, shuningdek DipIFR xalqaro diplomiga tayyorlov kurslarini taklif etadi.",
    "4 yillik akademik dastur 9-11-sinf o'quvchilari va yosh moliya mutaxassislari uchun mo'ljallangan — milliy standartlardan boshlab, ACCA xalqaro darajasigacha olib boradi. Kurslarning katta qismi maxsus onlayn platforma orqali ham olib boriladi.",
    "Bitiruvchilarga ishga joylashishda yordam beriladi, ba'zi kurslar rasmiy diplom yoki ACCA xalqaro sertifikati bilan yakunlanadi.",
  ].join("\n\n"),
};

interface CourseInput {
  title: string;
  categorySlug: string;
  duration: string;
  format: "offline" | "online" | "hybrid";
  description: string;
  lessons: string[];
  languages: string[];
  certificate: boolean;
  imageUrl: string | null;
}

const COURSES: CourseInput[] = [
  {
    title: "Milliy Buxgalteriya kursi (Sertifikat, 6 oy)",
    categorySlug: "buxgalteriya-moliya",
    duration: "6 oy",
    format: "hybrid",
    description:
      "Fundamental nazariyadan 1C dasturi va soliq hisobotigacha — to'liq amaliy buxgalteriya kursi. Boshlang'ich buxgalterlar, IP va MChJ egalari uchun mo'ljallangan. Kurs yakunida sertifikat beriladi.",
    lessons: [
      "Fundamental bosqich: buxgalteriya asoslari, hisoblar rejasi, asosiy vositalar, tovar-moddiy zaxiralar, mehnat haqi, debitor va tranzit hisoblar",
      "1C dasturi bosqichi: korxona ma'lumotlari, bank operatsiyalari, aktivlarni boshqarish, xizmat xaridlari, ishlab chiqarish o'tkazmalari, korporativ operatsiyalar, zaxira hisobotlari",
      "Soliq bosqichi: biznesni ro'yxatdan o'tkazish, jismoniy shaxslar daromad solig'i, ijtimoiy soliq, resurs solig'lari, QQS hisoboti, foyda solig'i, moliyaviy hisobotlar",
    ],
    languages: ["uz", "ru"],
    certificate: true,
    imageUrl: "/uploads/abco-milliy-buxgalteriya.png",
  },
  {
    title: "Milliy Buxgalteriya kursi (Diplom, 10 oy)",
    categorySlug: "buxgalteriya-moliya",
    duration: "10 oy",
    format: "hybrid",
    description:
      "6 oylik sertifikat dasturining kengaytirilgan varianti — qo'shimcha chuqurlashtirilgan amaliyot bilan. Kurs yakunida rasmiy DIPLOM beriladi va bitiruvchilarga ishga joylashtirishda yordam ko'rsatiladi. Boshlang'ich buxgalterlar, IP va MChJ egalari uchun mo'ljallangan.",
    lessons: [
      "Fundamental bosqich: buxgalteriya asoslari, hisoblar rejasi, asosiy vositalar, tovar-moddiy zaxiralar, mehnat haqi, debitor va tranzit hisoblar",
      "1C dasturi bosqichi: korxona ma'lumotlari, bank operatsiyalari, aktivlarni boshqarish, xizmat xaridlari, ishlab chiqarish o'tkazmalari, korporativ operatsiyalar, zaxira hisobotlari",
      "Soliq bosqichi: biznesni ro'yxatdan o'tkazish, jismoniy shaxslar daromad solig'i, ijtimoiy soliq, resurs solig'lari, QQS hisoboti, foyda solig'i, moliyaviy hisobotlar",
    ],
    languages: ["uz", "ru"],
    certificate: true,
    imageUrl: "/uploads/abco-milliy-buxgalteriya.png",
  },
  {
    title: "Akademik Ta'lim (4 yillik)",
    categorySlug: "buxgalteriya-moliya",
    duration: "4 yil",
    format: "hybrid",
    description:
      "9-11-sinf o'quvchilari va buxgalteriya/moliya sohasidagi yosh mutaxassislar uchun 4 yillik to'liq akademik dastur — milliy standartlardan ACCA xalqaro darajasigacha. 1-yil (10 oy): milliy buxgalteriya asoslari, 1C dasturi, soliqlar va amaliyot. 2-4-yillar: ACCA paperlari (F1-F9), har biri 3 oydan. 1-yil yakunida rasmiy diplom va O'zbekistonda ishga joylashtirish yordami, keyingi yillarda har bir ACCA paperi bo'yicha xalqaro sertifikat beriladi.",
    lessons: [
      "1-yil (10 oy): Milliy buxgalteriya — fundamental (4 oy), 1C dasturi (2 oy), soliqlar va elektron hisobotlar (3 oy), amaliyot (1 oy)",
      "2-4-yillar: ACCA paperlari (F1-F9), har biri 3 oydan",
    ],
    languages: ["uz", "ru", "en"],
    certificate: true,
    imageUrl: "/uploads/abco-akademik-talim.png",
  },
  {
    title: "MSFO kurslari",
    categorySlug: "buxgalteriya-moliya",
    duration: "3 oy",
    format: "online",
    description:
      "Xalqaro Moliyaviy Hisobot Standartlarini (MSFO) rus tilida amaliy o'rganing. Milliy standartlarni bilgan va xalqaro darajaga o'tmoqchi bo'lgan buxgalterlar uchun. Kurs yakunida MSFO tamoyillarini tushunib, xalqaro standartlarda hisobot tuza olasiz.",
    lessons: [],
    languages: ["ru"],
    certificate: false,
    imageUrl: "/uploads/abco-msfo.png",
  },
  {
    title: "DipIFR kurslari",
    categorySlug: "buxgalteriya-moliya",
    duration: "4 oy",
    format: "online",
    description:
      "ACCA tashkilotining xalqaro DipIFR diplomiga tayyorlov kursi (rus tilida). MSFO asoslarini bilgan, xalqaro diplom olishni maqsad qilgan mutaxassislar uchun. Kurs yakunida DipIFR imtihoniga to'liq tayyor bo'lasiz, bitiruvchilar hamkor kompaniyalarda ishga joylashish imkoniyatiga ega bo'ladi.",
    lessons: [],
    languages: ["ru"],
    certificate: true,
    imageUrl: "/uploads/abco-dipifr.png",
  },
  {
    title: "ACCA kurslari (F1-F9)",
    categorySlug: "buxgalteriya-moliya",
    duration: "3 oy (har bir paper)",
    format: "hybrid",
    description:
      "ACCA (Association of Chartered Certified Accountants) xalqaro tashkilotining F1-F9 darajalaridagi kurslari — ingliz tilida (F9 paperi rus tilida ham mavjud). Har bir paper 3 oy davom etadi va yakunida ACCA tashkilotining rasmiy sertifikati beriladi. Mavzular: Business Technology, Management Accounting, Financial Accounting, Corporate Law, Performance Management, Taxation, Financial Reporting, Audit & Assurance, Financial Management.",
    lessons: [
      "F1-F3: Business Technology, Management Accounting, Financial Accounting",
      "F4-F6: Corporate Law, Performance Management, Taxation",
      "F7-F9: Financial Reporting, Audit & Assurance, Financial Management",
    ],
    languages: ["en", "ru"],
    certificate: true,
    imageUrl: "/uploads/abco-acca.png",
  },
];

async function main() {
  console.log(`=== ABCO AKADEMIYA onboarding ${DRY_RUN ? "(DRY RUN — yozilmaydi)" : "(COMMIT — haqiqiy yozadi)"} ===\n`);

  const slugs = [...new Set(COURSES.map(c => c.categorySlug))];
  const categories = await prisma.category.findMany({
    where: { slug: { in: slugs } },
    include: { group: { select: { name: true } } },
  });
  const catBySlug = new Map(categories.map(c => [c.slug, c]));
  for (const s of slugs) {
    if (!catBySlug.has(s)) throw new Error(`Category topilmadi: slug="${s}"`);
  }

  let provider = await prisma.user.findFirst({
    where: { OR: [{ phone: CENTER.phone }, { centerName: CENTER.centerName }] },
  });

  if (provider) {
    console.log(`Provider mavjud: #${provider.id} ${provider.centerName}`);
  } else {
    const slug = await generateUniqueUserSlug(CENTER.centerName);
    console.log(`Yangi provider yaratiladi: ${CENTER.centerName} (slug: ${slug})`);
    if (!DRY_RUN) {
      provider = await prisma.user.create({
        data: {
          name: CENTER.name,
          centerName: CENTER.centerName,
          profileType: "CENTER",
          slug,
          bio: CENTER.bio,
          phone: CENTER.phone,
          passwordHash: "",
          role: "provider",
          onboardingCompleted: false,
        },
      });
      console.log(`  ✓ Provider #${provider.id}`);
    }
  }

  for (const course of COURSES) {
    const cat = catBySlug.get(course.categorySlug)!;
    const slug = `${slugify(course.title)}-${Math.random().toString(36).slice(2, 7)}`;

    console.log(`\n[${course.title}]`);
    console.log(`  categoryId: ${cat.id} (${cat.name} / ${cat.group.name})`);
    console.log(`  format: ${course.format}  |  davomiylik: ${course.duration}`);
    console.log(`  narx: ${PRICE_PLACEHOLDER} (PLACEHOLDER — hali noma'lum)`);
    console.log(`  status: pending`);

    if (!DRY_RUN) {
      if (!provider) throw new Error("Provider yaratilmagan");
      await prisma.listing.create({
        data: {
          userId: provider.id,
          categoryId: cat.id,
          listingType: "COURSE",
          title: course.title,
          slug,
          description: course.description,
          price: PRICE_PLACEHOLDER,
          format: course.format,
          location: CENTER.location,
          region: CENTER.region,
          district: CENTER.district,
          language: course.languages[0] ?? "uz",
          languages: course.languages,
          certificate: course.certificate,
          demoLesson: false,
          discount: PRICE_WARNING,
          duration: course.duration,
          lessons: course.lessons,
          imageUrl: course.imageUrl,
          paymentType: "Oylik",
          phone: CENTER.phone,
          phoneShown: true,
          telegram: CENTER.telegram,
          website: CENTER.website,
          status: "pending",
          statusChangedAt: new Date(),
        },
      });
      console.log(`  ✓ Listing yaratildi (slug: ${slug})`);
    }
  }

  console.log(`\n=== Tugadi: ${COURSES.length} ta kurs${DRY_RUN ? " (DRY RUN)" : " yaratildi, hammasi pending, narx PLACEHOLDER"} ===`);
  if (DRY_RUN) {
    console.log("Haqiqiy yozish: npx tsx scripts/onboard-abco.ts --commit");
  } else {
    console.log("MUHIM: narx kelgach har birini /admode/listings/[id]/edit da yangilang, keyin tasdiqlang.");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
