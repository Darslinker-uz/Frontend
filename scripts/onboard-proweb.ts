import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { generateUniqueUserSlug } from "../src/lib/slug";
import { slugify } from "../src/lib/slug";

// PROWEB hamkorlik onboarding — bir martalik skript.
// clients/proweb/darslik.docx dagi ma'lumotlarga aynan mos (taxmin qilinmagan).
//
// Xavfsizlik: har doim status="pending" bilan yaratiladi (assistant rolidagi
// admin xatti-harakatini takrorlaydi) — hech narsa super admin tasdiqlamaguncha
// jonli saytda ko'rinmaydi (/admode/listings -> pending -> approve).
//
// Foydalanish:
//   npx tsx scripts/onboard-proweb.ts          (DRY RUN — faqat ko'rsatadi, yozmaydi)
//   npx tsx scripts/onboard-proweb.ts --commit (haqiqiy yozadi)

const DRY_RUN = !process.argv.includes("--commit");

// docx item 8 — barcha kurslarda bir xil 3 ta filial ko'rsatilgan
const BRANCHES = [
  {
    region: "Toshkent shahri",
    district: "Chilonzor", // docx'da aniq ko'rsatilgan ("Chilonzor metro bekati")
    address: "Bunyodkor xiyoboni, Chilonzor metro bekati, 41-uy",
  },
  {
    region: "Toshkent shahri",
    district: "Mirobod", // TAXMINIY — docx'da tuman ko'rsatilmagan, faqat ko'cha nomi bor. Prowebdan tasdiqlash so'rang.
    address: "Oybek ko'chasi, 16",
  },
  {
    region: "Toshkent shahri",
    district: "Mirobod", // TAXMINIY — yuqoridagi kabi
    address: "Oybek ko'chasi, 10",
  },
];

const CENTER = {
  centerName: "PROWEB",
  name: "PROWEB",
  phone: "+998 71 203 60 60",
  email: "info@proweb.uz",
  telegram: "@prowebcommunity",
  bio: [
    "PROWEB — 2010-yildan buyon faoliyat yuritayotgan o'quv markazi. Markaz Digital va IT sohalarida ta'lim beradi va shu vaqt ichida 10 ta yo'nalish bo'yicha 20 000 dan ortiq talabani o'qitgan.",
    "Kurslar dasturi nazariya bilan bir qatorda amaliyotga (dastur bo'yicha 80% amaliyot) katta e'tibor beradi — bu kasbni to'liq o'zlashtirish uchun mo'ljallangan. Barcha mashg'ulotlar zamonaviy texnologiyalar bilan jihozlangan xonalarda o'tkaziladi.",
    "PROWEB o'quvchilariga o'qishni tugatgandan so'ng ish topishda ham yordam beradi. Markaz Toshkent shahrida 3 ta filialda (Chilonzor va Oybek ko'chasidagi ikkita manzil) faoliyat yuritadi.",
    "Yo'nalishlar: Data Analyst, Grafik va Web-dizayn, Videomontaj, Mobilografiya, 3D dizayn va 3D modellashtirish, PRO SMM, MS Office, Kompyuter yig'ish, IT Kids (bolalar uchun) va Prompt Engineering.",
  ].join("\n\n"),
};

interface CourseInput {
  title: string;
  categorySlug: string; // production'dagi category.slug — id emas, slug orqali topiladi
  price: number;
  discount: string | null;
  duration: string;
  format: "offline" | "online" | "hybrid";
  description: string;
  lessons: string[]; // "Dars rejasi" — docx'da bo'lmasa bo'sh massiv (fabricate qilinmagan)
  schedule: string;
  languages: string[];
  level: string;
  studentLimit: number;
  teacherName: string | null;
  teacherExperience: string | null;
  branchIndex: number; // BRANCHES[] dagi asosiy manzil (docx item 7)
  imageUrl: string | null; // /uploads/... — oldindan serverga (/var/darslinker/uploads/) ko'chirilgan bo'lishi kerak
}

const COURSES: CourseInput[] = [
  {
    title: "Data Analyst",
    categorySlug: "data-science",
    price: 9_000_000,
    discount: null,
    duration: "5 oy",
    format: "hybrid",
    description:
      "Kurs davomida siz ma'lumotlarni tahlil qilish, grafik va dashboardlar yaratishni o'rganasiz. Dasturlar: Python, Power BI, Excel, ma'lumotlar bazalari bilan ishlash. Kurs yakunida siz ma'lumotlar tahlili bo'yicha ko'nikmalarga ega bo'lasiz.",
    lessons: [
      "Python asosiy qismiga kirish",
      "Ma'lumotlarni vizualizatsiya qilish",
      "SQL va Power BI'ga kirish",
      "Power BI'da asosiy vizualizatsiyalar",
      "Data Engineering asoslari",
    ],
    schedule: "Chorshanba - Shanba: 15:00 / 17:00 / 19:30",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 16,
    teacherName: "Turg'unaliyev Saddam Sheraliyevich",
    teacherExperience: "1 yil",
    branchIndex: 1,
    imageUrl: "/uploads/proweb-data-analyst.jpg",
  },
  {
    title: "Grafik va Web-dizayn",
    // TAXMINIY — production'da alohida "Grafik dizayn" yo'q, yagona dizayn
    // categoriyasi "UI/UX dizayn" ga cho'zilmoqda (foydalanuvchi tasdiqladi: variant 2).
    categorySlug: "ui-ux",
    price: 10_200_000,
    discount: "9% chegirma — 9.300.000 so'm",
    duration: "6 oy",
    format: "hybrid",
    description:
      "Kurs davomida siz grafik va web-dizayn yo'nalishlarini o'rganib, saytlar, mobil ilovalar va reklama materiallari dizaynini yaratishni o'zlashtirasiz. Dasturlar: Figma, Photoshop, Illustrator, CorelDRAW. Kurs yakunida dizayner sifatida ishlash va brend vizuallarini yaratish ko'nikmalariga ega bo'lasiz.",
    lessons: [
      "Figma dasturini o'zlashtirish, Web-dizayn asoslari",
      "UI/UX, ilovalar dizayni",
      "Photoshop dasturini o'rganish",
      "Illustrator dasturini o'rganish",
      "Corel Draw bilan ishlash asoslari",
      "Individual proyekt yaratish",
    ],
    schedule: "Seshanba - Payshanba: 17:00 / 19:30",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 13,
    teacherName: "Orifjonov Islombek Dilshodbek o'g'li",
    teacherExperience: "6 yil",
    branchIndex: 1,
    imageUrl: "/uploads/proweb-grafik-va-web-dizayn.jpg",
  },
  {
    title: "Videomontaj",
    // TAXMINIY — production'da video/montaj categoriyasi yo'q, "UI/UX dizayn"
    // (yagona dizayn categoriyasi) ga cho'zilmoqda (foydalanuvchi tasdiqladi: variant 2).
    categorySlug: "ui-ux",
    price: 8_000_000,
    discount: "3% chegirma — 7.750.000 so'm",
    duration: "5 oy",
    format: "hybrid",
    description:
      "Kurs davomida siz videolarni montaj qilish va motion grafika yaratishni o'rganasiz. Dasturlar: Adobe Premiere Pro, Adobe After Effects. Kurs yakunida videomontaj va motion grafika sohasida ishlash ko'nikmalariga ega bo'lasiz.",
    lessons: [
      "Modul 1 (1-oy): Video montaj",
      "Modul 2 (2-5 oy): Motion Design va animatsiya",
    ],
    schedule: "Chorshanba - Shanba: 15:00 / 19:30",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 12,
    teacherName: "Qaxramonov Mironshoh Sherali o'g'li",
    teacherExperience: "4 yil",
    branchIndex: 1,
    imageUrl: "/uploads/proweb-videomontaj.jpg",
  },
  {
    title: "Mobilografiya",
    // TAXMINIY — production'da fotografiya categoriyasi yo'q, "UI/UX dizayn"
    // (yagona dizayn categoriyasi) ga cho'zilmoqda (foydalanuvchi tasdiqladi: variant 2).
    categorySlug: "ui-ux",
    price: 3_400_000,
    discount: null,
    duration: "2 oy",
    format: "offline",
    description:
      "Kurs davomida siz smartfon orqali chiroyli va dinamik videolar suratga olishni o'rganasiz. O'zlashtirasiz: video olish va montaj texnikalari, yorug'lik va ssenariy bilan ishlash, Reels va qisqa videolar yaratish. Kurs yakunida ijtimoiy tarmoqlar uchun kontent yaratish ko'nikmalariga ega bo'lasiz.",
    lessons: [
      "Modul 1 (1-oy): Mobilografiya bo'yicha asosiy bilimlar",
      "Modul 2 (2-oy): Professional ko'nikmalar",
    ],
    schedule: "Seshanba - Payshanba: 15:00 / 17:00 / 19:30",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 15,
    teacherName: "Mutalov Abdurashid Abduvoris o'g'li",
    teacherExperience: "4 yil",
    branchIndex: 2,
    imageUrl: "/uploads/proweb-mobilografiya.jpg",
  },
  {
    title: "3D dizayn va 3D modellashtirish",
    // TAXMINIY — production'da 3D dizayn categoriyasi yo'q, "UI/UX dizayn"
    // (yagona dizayn categoriyasi) ga cho'zilmoqda (foydalanuvchi tasdiqladi: variant 2).
    categorySlug: "ui-ux",
    price: 8_500_000,
    discount: null,
    duration: "5 oy",
    format: "hybrid",
    description:
      "Kurs davomida siz interyer va eksteryer dizayneri kasbini o'zlashtirasiz — 3D modellar va vizualizatsiyalar yaratishni o'rganasiz. O'rganasiz: 3Ds Max, AutoCAD, Corona Render, Lumion. Kurs yakunida xonalar, binolar va landshaft uchun 3D vizualizatsiya yaratib, mijozlarga taqdimot qila olasiz.",
    lessons: [
      "Modul 1 (1-oy): AutoCAD dasturini o'rganish",
      "Modul 2-3 (2-oy): Modellashtirish asoslari",
      "Modul 3-4 (3-oy): Materiallar va yoritish, interyer",
      "Modul 4-5 (4-oy): Interyer, eksteryer",
    ],
    schedule: "Yakshanba: 10:00 / 14:00 / 18:00",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 13,
    teacherName: "Akramov Azamat Shuxratovich",
    teacherExperience: "16 yil",
    branchIndex: 1,
    imageUrl: "/uploads/proweb-3d-dizayn-va-3d-modellashtirish.jpg",
  },
  {
    title: "PRO SMM",
    categorySlug: "smm",
    price: 7_000_000,
    discount: "3% chegirma — 6.800.000 so'm",
    duration: "4 oy",
    format: "hybrid",
    description:
      "PRO SMM kursida siz ijtimoiy tarmoqlarni yuritishni o'zlashtirasiz. O'rganasiz: kopirayting va kontent yaratish, targetli reklama, neyrosetlar bilan ishlash, mobilografiya (trendli suratga olish). Kurs dasturi O'zbekiston Marketing Assotsiatsiyasi tomonidan tasdiqlangan. Kurs yakunida SMM mutaxassisi-mobilograf kasbini egallaysiz.",
    lessons: [
      "Modul 1 (1-oy): Kirish — SMM va kontent-menejment",
      "Modul 2 (2-oy): Target qilingan reklama",
      "Modul 3 (3-oy): Telegram, community va vizual",
      "Modul 4 (4-oy): Mobilografiya, predmetli suratga olish va loyiha himoyasi",
    ],
    schedule: "Seshanba - Payshanba: 15:00 / 17:00 / 19:30",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 13,
    teacherName: "Yo'ldoshev Abdullox",
    teacherExperience: "6 yil",
    branchIndex: 2,
    imageUrl: "/uploads/proweb-pro-smm.jpg",
  },
  {
    // "Kompyuter savodxonligi" (IT va Dasturlash) — aniq mos categoriya.
    title: "MS Office",
    categorySlug: "kompyuter-savodxonligi",
    price: 2_700_000,
    discount: "4% chegirma — 2.600.000 so'm",
    duration: "2 oy",
    format: "hybrid",
    description:
      "MS Office kursida siz noldan ofis dasturlari bilan ishonchli ishlashni o'rganasiz. O'rganasiz: Excel (jadvallar, formulalar, diagrammalar, hisobotlar), Word (hujjatlar bilan ishlash), PowerPoint (taqdimotlar), Google Jadvallar. Kurs yakunida ofis dasturlari bilan ishonchli ishlay olasiz.",
    lessons: [
      "Modul 1 (1-oy): Excel",
      "Modul 2 (2-oy): Excel (chuqurlashtirilgan)",
      "Qo'shimcha material: Google Jadvallar, PowerPoint, Word",
    ],
    schedule: "Chorshanba - Shanba: 15:00 / 17:00 / 19:30",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 13,
    teacherName: "Akramov Azamat Shuxratovich",
    teacherExperience: "16 yil",
    branchIndex: 2,
    imageUrl: "/uploads/proweb-ms-office.jpg",
  },
  {
    // TAXMINIY — production'da alohida hardware/tizim categoriyasi yo'q,
    // "Kompyuter savodxonligi" ga cho'zilmoqda (MS Office bilan bir xil categoriya bo'lib qoladi).
    title: "Kompyuter yig'ish",
    categorySlug: "kompyuter-savodxonligi",
    price: 4_050_000,
    discount: null,
    duration: "3 oy",
    format: "offline",
    description:
      "Kichik tizim administratori kursida siz noldan kompyuter va tarmoqlarni sozlashni o'zlashtirasiz. O'rganasiz: kompyuter yig'ish va komponentlarni tanlash, Windows va drayverlarni o'rnatish, nosozliklarni aniqlash va bartaraf etish, Wi-Fi va lokal tarmoqlarni sozlash, tarmoq uskunalari bilan ishlash. Kurs yakunida tizim administratori sohasida boshlash uchun kerakli ko'nikmalarga ega bo'lasiz.",
    lessons: [
      "Modul 1 (1-oy): Kompyuter va noutbuklarning tuzilishi",
      "Modul 2 (2-oy): Dasturiy ta'minot va operatsion tizimlar",
      "Modul 3-4 (3-oy): Chop etish texnologiyalari, tarmoq texnologiyalari asoslari",
    ],
    schedule: "Yakshanba: 10:00 / 14:00 / 18:00",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 13,
    teacherName: "Abdullayev Samandarho'dja Alisherovich",
    teacherExperience: "3 yil",
    branchIndex: 0,
    imageUrl: "/uploads/proweb-kompyuter-yigish.jpg",
  },
  {
    // TAXMINIY — production'da "bolalar uchun" categoriyasi yo'q,
    // "Web-Dasturlash" ga cho'zilmoqda ("bolalar uchun" degan tasnif yo'qoladi).
    title: "IT Kids",
    categorySlug: "web-dasturlash",
    price: 3_450_000,
    discount: null,
    duration: "3 oy",
    format: "offline",
    description:
      "IT Kids kursi — 10 yoshdan 13 yoshgacha bo'lgan bolalar uchun. Kurs davomida farzandingiz dizayn yaratish va o'z loyihalarini bezashni o'rganadi, dasturlash asoslarini o'rganib saytlar yaratadi, Roblox'da o'yin va loyihalar ishlab chiqadi, o'z g'oyalarini taqdim qilish va loyihalar ustida ishlashni o'rganadi. Kurs kreativ fikrlash, mantiq va zamonaviy texnologiyalarga qiziqishni rivojlantirishga yordam beradi.",
    lessons: [
      "Modul 1 (1-oy): Web-dizayn",
      "Modul 2 (2-3 oy): Web-saytlar yaratish",
    ],
    schedule: "Yakshanba: 10:00 / 14:00 / 18:00",
    languages: ["uz", "ru"],
    level: "O'rta",
    studentLimit: 13,
    teacherName: null, // docx'da o'qituvchi nomi ko'rsatilmagan — fabricate qilinmadi
    teacherExperience: null,
    branchIndex: 2,
    imageUrl: "/uploads/proweb-it-kids.jpg",
  },
  {
    title: "Prompt Engineering",
    // TAXMINIY — production'da AI/prompt engineering categoriyasi yo'q,
    // "Data Science" ga cho'zilmoqda (foydalanuvchi tasdiqladi: variant 2).
    categorySlug: "data-science",
    price: 2_800_000,
    discount: null,
    duration: "2 oy",
    format: "hybrid",
    description:
      "Prompt Engineering kursida siz noldan sun'iy intellektda ishlashni o'rganasiz. Dasturlar: ChatGPT, Gemini, Claude, AI agent va avtomatlashtirish asoslari. Kurs yakunida AI vositalarini professional darajada o'rganasiz.",
    lessons: [], // docx'da "Dars rejasi" bo'sh qoldirilgan — fabricate qilinmadi
    schedule: "Chorshanba - Shanba: 15:00 / 19:30",
    languages: ["uz"], // docx'da faqat "O'zbek" ko'rsatilgan (boshqalarida "O'zbek/rus")
    level: "O'rta",
    studentLimit: 13,
    teacherName: "Egamberdiyev Sardor Qodirjonovich",
    teacherExperience: "5 yil",
    branchIndex: 0,
    imageUrl: null, // docx papkasida bu kurs uchun rasm topilmadi — keyin qo'shiladi
  },
];

async function main() {
  console.log(`=== PROWEB onboarding ${DRY_RUN ? "(DRY RUN — yozilmaydi)" : "(COMMIT — haqiqiy yozadi)"} ===\n`);

  // 1) Barcha categoriyalarni slug orqali topamiz (id emas — muhitlar orasida id mos kelmasligi mumkin)
  const slugs = [...new Set(COURSES.map(c => c.categorySlug))];
  const categories = await prisma.category.findMany({
    where: { slug: { in: slugs } },
    include: { group: { select: { name: true } } },
  });
  const catBySlug = new Map(categories.map(c => [c.slug, c]));
  for (const s of slugs) {
    if (!catBySlug.has(s)) throw new Error(`Category topilmadi: slug="${s}" — bu muhitda yo'q, tekshiring.`);
  }

  console.log("Categoriya moslashuvi:");
  for (const c of COURSES) {
    const cat = catBySlug.get(c.categorySlug)!;
    console.log(`  ${c.title.padEnd(28)} -> ${cat.name} (${cat.group.name})`);
  }
  console.log();

  // 2) Provider (PROWEB) — mavjud bo'lsa topamiz, bo'lmasa yaratamiz
  let provider = await prisma.user.findFirst({
    where: { OR: [{ phone: CENTER.phone }, { centerName: CENTER.centerName }] },
  });

  if (provider) {
    console.log(`Provider mavjud: #${provider.id} ${provider.centerName} (${provider.phone})`);
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
          email: CENTER.email,
          passwordHash: "", // Proweb o'zi onboarding orqali (telefon/bot) hisobni faollashtiradi
          role: "provider",
          onboardingCompleted: false,
        },
      });
      console.log(`  ✓ Provider #${provider.id}`);
    }
  }

  // 3) Har bir kurs uchun listing (+ 3 filial) — status har doim "pending"
  for (const course of COURSES) {
    const cat = catBySlug.get(course.categorySlug)!;
    const primary = BRANCHES[course.branchIndex];
    const slug = `${slugify(course.title)}-${Math.random().toString(36).slice(2, 7)}`;

    console.log(`\n[${course.title}]`);
    console.log(`  categoryId: ${cat.id} (${cat.name})`);
    console.log(`  narx: ${course.price.toLocaleString("uz-UZ")} so'm${course.discount ? `  |  ${course.discount}` : ""}`);
    console.log(`  format: ${course.format}  |  davomiylik: ${course.duration}`);
    console.log(`  asosiy manzil: ${primary.address} (${primary.district})`);
    console.log(`  filiallar: ${BRANCHES.length} ta`);
    console.log(`  rasm: ${course.imageUrl ?? "YO'Q — keyin qo'shiladi"}`);
    console.log(`  status: pending (moderatsiya kutadi)`);

    if (!DRY_RUN) {
      if (!provider) throw new Error("Provider yaratilmagan — avval provider bosqichi bajarilishi kerak");
      await prisma.listing.create({
        data: {
          userId: provider.id,
          categoryId: cat.id,
          listingType: "COURSE",
          title: course.title,
          slug,
          description: course.description,
          price: course.price,
          format: course.format,
          location: primary.address,
          region: primary.region,
          district: primary.district,
          language: course.languages[0] ?? "uz",
          languages: course.languages,
          level: course.level,
          levels: [course.level],
          studentLimit: course.studentLimit,
          schedule: course.schedule,
          teacherName: course.teacherName,
          teacherExperience: course.teacherExperience,
          certificate: true, // docx: "sertifikat yoki diplom beriladi" — barcha kurslarda
          demoLesson: true, // docx: "Ochiq dars va sinov darsi mavjud" — barcha kurslarda
          discount: course.discount,
          lessons: course.lessons,
          imageUrl: course.imageUrl,
          phone: CENTER.phone,
          phoneShown: true,
          telegram: CENTER.telegram,
          status: "pending",
          statusChangedAt: new Date(),
          branches: {
            create: BRANCHES.map((b, i) => ({
              region: b.region,
              district: b.district,
              address: b.address,
              price: null, // docx alohida filial narxi bermagan — asosiy narx ishlatiladi
              sortOrder: i,
            })),
          },
        },
      });
      console.log(`  ✓ Listing yaratildi (slug: ${slug})`);
    }
  }

  console.log(`\n=== Tugadi: ${COURSES.length} ta kurs${DRY_RUN ? " (DRY RUN — hech narsa yozilmadi)" : " yaratildi, hammasi pending"} ===`);
  if (DRY_RUN) {
    console.log("Haqiqiy yozish uchun: npx tsx scripts/onboard-proweb.ts --commit");
  } else {
    console.log("Keyingi qadam: /admode/listings (status=pending) -> har birini ko'rib chiqib tasdiqlang.");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
