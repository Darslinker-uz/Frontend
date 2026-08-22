// Kod ichida yozilgan (DB'da bo'lmagan) blog postlari — yagona manba.
// Bu ro'yxatdan /blog indeksi ham, sitemap.ts ham foydalanadi, shuning uchun
// yangi static blog qo'shganda faqat shu yerga bitta qator qo'shish kifoya.
//
// `date` — maqola nashr etilgan aniq sana (ISO, YYYY-MM-DD). Post sahifasidagi
// JSON-LD `datePublished` bilan bir xil bo'lishi shart.

export type StaticBlogPost = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  category: string;
};

export const STATIC_BLOG_POSTS: StaticBlogPost[] = [
  {
    slug: "dasturlashni-noldan-organish-6-oylik-yol-xaritasi",
    date: "2026-08-22",
    title: "Dasturlashni noldan o'rganish: 6 oylik yo'l xaritasi (2026)",
    excerpt:
      "6 oylik amaliy reja: 1-2 oy asos, 3-4 oy frontend yoki backend tanlash, 5-oy portfolio, 6-oy ish qidiruv. hh.uz, Najot Ta'lim va School 21 ma'lumoti asosida.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "onlayn-talim-bozori-2026",
    date: "2026-08-20",
    title: "O'zbekistonda onlayn ta'lim bozori: 2026-yil raqamlari",
    excerpt:
      "Internet qamrovi 94,2%ga yetdi, uzbekcoders.uz'da (Coursera) 1,4 mln foydalanuvchi, global bozor $389 mlrd. IT Park va davlat dasturlari statistikasi bitta joyda.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "smm-ni-noldan-organish-3-oylik-reja",
    date: "2026-08-20",
    title: "SMM'ni noldan o'rganish: 3 oylik reja (2026)",
    excerpt:
      "Nol tajribadan boshlang'ich SMM lavozimigacha 3 oylik amaliy reja: 1-oy asos, 2-oy AI vositalar va reklama testi, 3-oy portfolio va birinchi mijoz. hh.uz talablari asosida.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "ai-qaysi-kasblarni-ozgartiryapti",
    date: "2026-08-17",
    title: "AI O'zbekistonda qaysi kasblarni o'zgartiryapti? (2026)",
    excerpt:
      "Banklar call-markaz uchun ovozli AI'ni sinamoqda, Soliq qo'mitasi AI Soliq portalini ishga tushirdi. hh.uz vakansiyalari va davlat dasturlari asosida qaysi kasblar birinchi bo'lib o'zgarayotgani tahlil qilindi.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "ui-ux-dizayner-maoshi",
    date: "2026-08-12",
    title: "O'zbekistonda UI/UX dizayner: maosh, talab va portfolio (2026)",
    excerpt:
      "Toshkentdagi 22 ta ochiq dizayn e'loni qo'lda ajratildi: maosh atigi bittasida yozilgan, talabning 9 tasi bank va fintechdan, \"junior\" yorlig'i esa umuman yo'q. Portfolio uchun uch oqim qoidasi.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "frontend-dasturchi-maoshi",
    date: "2026-08-11",
    title: "O'zbekistonda frontend dasturchi maoshi va talab (2026)",
    excerpt:
      "hh.uz'dagi 82 ta ochiq e'lon qo'lda tahlil qilindi: middle daraja 15-20 mln so'm, dollar takliflari $200-1000, junior o'rin esa atigi bitta. Agregator o'rtachalari nega noto'g'ri ekani ham ko'rsatilgan.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "smm-mutaxassisi-qancha-ishlaydi",
    date: "2026-08-09",
    title: "O'zbekistonda SMM mutaxassisi qancha ishlaydi? (2026)",
    excerpt:
      "hh.uz va GorodRabot.uz vakansiyalari asosida: boshlovchi 3-5 mln, o'rta daraja 5-10 mln, senior 15-18 mln so'm. Milliy o'rtacha ish haqi va freelance narxlari bilan taqqoslangan.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "ishonchli-oquv-markazni-qanday-tekshirish",
    date: "2026-07-31",
    title: "Ishonchli o'quv markazni qanday tekshirish kerak? 5 mezon (2026)",
    excerpt:
      "To'lovdan oldin tekshiriladigan 5 mezon — yuridik ro'yxat, ruxsat hujjati, shartnoma va pul qaytarish sharti, \"2+6\" davlat dasturi va manzil. Rasmiy manbalar bilan.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "kurslarni-qayerdan-topish-mumkin",
    date: "2026-07-02",
    title: "O'zbekistonda kurslarni qayerdan topish mumkin? (2026 qo'llanma)",
    excerpt:
      "Kurs va o'quv markazlarini qanday topish mumkin — ijtimoiy tarmoq, tavsiya yoki katalog orqali. Yo'nalish, shahar va narx bo'yicha qidirish uchun amaliy qo'llanma.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "nega-oquv-markazlar-darslinker-tanlaydi",
    date: "2026-05-10",
    title: "Nega o'quv markazlar Darslinker'ni tanlaydi? 5 ta sabab (2026)",
    excerpt:
      "Darslinker o'quv markazlarga nima beradi? SEO, marketplace katalog, real-time Telegram lid, CRM kabinet va organik ko'rinish — bir platformada. 5 ta asosiy imkoniyat batafsil.",
    category: "O'quv markazlar uchun",
  },
  {
    slug: "kursni-qanday-tanlash-7-mezon",
    date: "2026-05-04",
    title: "Kursni qanday to'g'ri tanlash kerak: 7 ta mezon 2026",
    excerpt:
      "Kurs tanlashda 7 ta asosiy mezon — format, narx, o'qituvchi, sertifikat va boshqalar. Vaqt va pulni yo'qotmaslik uchun amaliy yondashuv.",
    category: "O'quvchilar uchun",
  },
  {
    slug: "oquv-markaz-yangi-oquvchi-topish",
    date: "2026-05-04",
    title: "Yangi o'quvchi topish: o'quv markaz uchun 5 strategiya 2026",
    excerpt:
      "O'quv markaz uchun yangi o'quvchi topishning 5 ta strategiyasi — SEO, marketplace, ijtimoiy tarmoqlar, referrals, hamkorlik. CPL va vaqt bilan qiyoslangan.",
    category: "O'quv markazlar uchun",
  },
];

const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

/** "2026-07-31" → "31-iyul, 2026". Noto'g'ri sana bo'lsa bo'sh satr qaytaradi. */
export function formatUzDate(input: string | Date | null | undefined): string {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(`${input}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()}-${UZ_MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}
