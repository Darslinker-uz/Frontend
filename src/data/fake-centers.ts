// FAKE markazlar — demo uchun. Backend listingType + Center entity tayyor bo'lganda olib tashlanadi.
export type FakeCenter = {
  slug: string;
  provider: string;
  description: string;
  categories: string[];
  regions: string[];
  avgRating: number;
  ratingCount: number;
  courseCount: number;
  imageUrl: string | null;
  gradient: string;
  firstSlug: string;
  firstCategorySlug: string;
  certificate: boolean;
  phone: string;
  telegram?: string;
  instagram?: string;
  website?: string;
  foundedYear: number;
};

export const FAKE_CENTERS: FakeCenter[] = [
  { slug: "najot-talim", provider: "Najot Ta'lim", description: "O'zbekistondagi yetakchi IT o'quv markazlaridan biri. Dasturlash, ma'lumotlar tahlili va sun'iy intellekt yo'nalishlarida zamonaviy dasturlar bilan o'qitamiz.", categories: ["Dasturlash", "IT"], regions: ["Toshkent shahri", "Samarqand"], avgRating: 4.9, ratingCount: 247, courseCount: 12, imageUrl: null, gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 200 12 12", telegram: "najot_talim", instagram: "najot.talim", website: "najottalim.uz", foundedYear: 2015 },
  { slug: "astrum-it-academy", provider: "Astrum IT Academy", description: "Sifatli IT ta'lim va kreativ dizayn yo'nalishlari. Tajribali mentorlar va real loyihalar bilan ish tajribasi.", categories: ["IT", "Dizayn"], regions: ["Toshkent shahri"], avgRating: 4.8, ratingCount: 189, courseCount: 9, imageUrl: null, gradient: "linear-gradient(135deg, #10b981, #06b6d4)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 230 45 67", telegram: "astrum_it", instagram: "astrum.academy", foundedYear: 2018 },
  { slug: "pdp-academy", provider: "PDP Academy", description: "Toshkent va Buxoroda dasturlash va raqamli marketing yo'nalishlarida tajribali ustozlar bilan amaliy darslar.", categories: ["Dasturlash", "Marketing"], regions: ["Toshkent shahri", "Buxoro"], avgRating: 4.7, ratingCount: 156, courseCount: 8, imageUrl: null, gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 245 80 80", telegram: "pdp_academy", foundedYear: 2017 },
  { slug: "everest-school", provider: "Everest School", description: "IELTS va Ingliz tili bo'yicha mutaxassislashgan markaz. Yuqori band'lar va xalqaro sertifikatlar.", categories: ["IELTS", "Ingliz tili"], regions: ["Toshkent shahri", "Andijon"], avgRating: 4.9, ratingCount: 312, courseCount: 6, imageUrl: null, gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 200 55 99", telegram: "everest_school", instagram: "everest.uz", foundedYear: 2014 },
  { slug: "step-it-academy", provider: "Step IT Academy", description: "IT va Robotexnika yo'nalishlarida zamonaviy dasturlar. Toshkent va Farg'ona filiallarida o'qitiladi.", categories: ["IT", "Robotexnika"], regions: ["Toshkent shahri", "Farg'ona"], avgRating: 4.6, ratingCount: 128, courseCount: 7, imageUrl: null, gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 207 30 30", telegram: "stepit_academy", foundedYear: 2016 },
  { slug: "multilang-academy", provider: "Multilang Academy", description: "Ingliz, Nemis va boshqa xorijiy tillarni o'rgatishga ixtisoslashgan markaz. Tajribali ona tili egasi o'qituvchilar.", categories: ["Ingliz tili", "Nemis tili"], regions: ["Toshkent shahri"], avgRating: 4.8, ratingCount: 134, courseCount: 7, imageUrl: null, gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)", firstSlug: "", firstCategorySlug: "", certificate: false, phone: "+998 71 211 22 33", telegram: "multilang_uz", foundedYear: 2019 },
  { slug: "smart-education", provider: "Smart Education", description: "DTM tayyorlov va maktab fanlari bo'yicha kuchli ustozlar bilan natijaga yo'naltirilgan o'qitish.", categories: ["DTM tayyorlov", "Matematika"], regions: ["Samarqand", "Buxoro"], avgRating: 4.6, ratingCount: 98, courseCount: 5, imageUrl: null, gradient: "linear-gradient(135deg, #f97316, #eab308)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 66 234 56 78", telegram: "smart_edu", foundedYear: 2017 },
  { slug: "marketing-pro", provider: "Marketing Pro", description: "Raqamli marketing va SMM bo'yicha amaliy kurslar. Real loyihalar va portfolio yaratish.", categories: ["Marketing", "SMM"], regions: ["Toshkent shahri"], avgRating: 4.5, ratingCount: 62, courseCount: 6, imageUrl: null, gradient: "linear-gradient(135deg, #a855f7, #ec4899)", firstSlug: "", firstCategorySlug: "", certificate: false, phone: "+998 71 246 88 99", instagram: "marketing.pro.uz", foundedYear: 2020 },
  { slug: "design-hub", provider: "Design Hub", description: "UI/UX va grafik dizayn yo'nalishlarida zamonaviy dasturlar. Toshkent va Namangan filiallari.", categories: ["Dizayn", "UI/UX"], regions: ["Toshkent shahri", "Namangan"], avgRating: 4.8, ratingCount: 89, courseCount: 5, imageUrl: null, gradient: "linear-gradient(135deg, #ef4444, #f97316)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 233 44 55", telegram: "designhub_uz", instagram: "designhub.uz", foundedYear: 2019 },
  { slug: "ai-academy", provider: "AI Academy", description: "Sun'iy intellekt va Ma'lumotlar fani bo'yicha O'zbekistondagi yetakchi mutaxassis markaz.", categories: ["Sun'iy intellekt", "Data Science"], regions: ["Toshkent shahri"], avgRating: 4.9, ratingCount: 41, courseCount: 3, imageUrl: null, gradient: "linear-gradient(135deg, #1e293b, #475569)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 200 77 88", telegram: "ai_academy_uz", website: "aiacademy.uz", foundedYear: 2021 },
  { slug: "edugrade-center", provider: "EduGrade Center", description: "Bolalar va maktab tayyorlov fanlari bo'yicha sifatli ta'lim. Yumshoq yondashuv va individual ish.", categories: ["Maktab tayyorlov", "Bolalar"], regions: ["Toshkent shahri"], avgRating: 4.7, ratingCount: 84, courseCount: 4, imageUrl: null, gradient: "linear-gradient(135deg, #84cc16, #22c55e)", firstSlug: "", firstCategorySlug: "", certificate: false, phone: "+998 71 240 12 34", telegram: "edugrade_uz", foundedYear: 2020 },
  { slug: "future-school", provider: "Future School", description: "DTM va maktab fanlari bo'yicha tajribali ustozlar. Yuqori natijalar va aniq dastur.", categories: ["DTM", "Maktab"], regions: ["Toshkent shahri", "Samarqand"], avgRating: 4.6, ratingCount: 112, courseCount: 5, imageUrl: null, gradient: "linear-gradient(135deg, #3b82f6, #2563eb)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 256 78 90", foundedYear: 2018 },
  { slug: "logos-academy", provider: "Logos Academy", description: "IELTS va TOEFL bo'yicha xalqaro standartdagi tayyorgarlik. Tajribali xorijiy ekspertlar.", categories: ["IELTS", "TOEFL"], regions: ["Toshkent shahri"], avgRating: 4.8, ratingCount: 178, courseCount: 4, imageUrl: null, gradient: "linear-gradient(135deg, #d946ef, #a855f7)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 207 89 01", telegram: "logos_uz", foundedYear: 2016 },
  { slug: "mind-lab", provider: "Mind Lab", description: "Matematika va mantiq bo'yicha rivojlantiruvchi kurslar. Bolalar va o'smirlar uchun.", categories: ["Matematika", "Mantiq"], regions: ["Toshkent shahri"], avgRating: 4.7, ratingCount: 65, courseCount: 4, imageUrl: null, gradient: "linear-gradient(135deg, #f43f5e, #ec4899)", firstSlug: "", firstCategorySlug: "", certificate: false, phone: "+998 71 245 11 22", telegram: "mindlab_uz", foundedYear: 2019 },
  { slug: "engtime", provider: "EngTime", description: "Ingliz tili bo'yicha qulay kurslar. Buxoro va Andijonda filiallar mavjud.", categories: ["Ingliz tili"], regions: ["Buxoro", "Andijon"], avgRating: 4.6, ratingCount: 47, courseCount: 3, imageUrl: null, gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)", firstSlug: "", firstCategorySlug: "", certificate: false, phone: "+998 65 234 56 78", instagram: "engtime.uz", foundedYear: 2020 },
  { slug: "code-master", provider: "Code Master", description: "Frontend va to'liq dasturlash kurslari. Amaliy loyihalar va real ish jarayoni.", categories: ["Dasturlash", "Frontend"], regions: ["Toshkent shahri"], avgRating: 4.5, ratingCount: 52, courseCount: 5, imageUrl: null, gradient: "linear-gradient(135deg, #0f766e, #14b8a6)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 200 30 30", telegram: "codemaster_uz", foundedYear: 2021 },
  { slug: "pioneer-school", provider: "Pioneer School", description: "Maktab tayyorlov va akademik fanlar bo'yicha izchil dastur. Toshkentda yetakchi.", categories: ["Maktab", "Tayyorlov"], regions: ["Toshkent shahri"], avgRating: 4.7, ratingCount: 91, courseCount: 4, imageUrl: null, gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 244 55 66", foundedYear: 2015 },
  { slug: "bilim-ochoqi", provider: "Bilim O'choqi", description: "Samarqand shahridagi til va matematika yo'nalishlarida ishonchli o'quv markaz.", categories: ["Til", "Matematika"], regions: ["Samarqand"], avgRating: 4.5, ratingCount: 38, courseCount: 4, imageUrl: null, gradient: "linear-gradient(135deg, #b45309, #d97706)", firstSlug: "", firstCategorySlug: "", certificate: false, phone: "+998 66 233 44 55", foundedYear: 2019 },
  { slug: "certifyup", provider: "CertifyUp", description: "Xalqaro sertifikat tayyorgarliklari (IELTS, CEFR, TOEFL) bo'yicha mutaxassis markaz.", categories: ["IELTS", "CEFR"], regions: ["Toshkent shahri"], avgRating: 4.8, ratingCount: 143, courseCount: 3, imageUrl: null, gradient: "linear-gradient(135deg, #9333ea, #ec4899)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 215 77 88", telegram: "certifyup", foundedYear: 2018 },
  { slug: "digital-brain", provider: "Digital Brain", description: "Marketing va IT yo'nalishlarida zamonaviy bilim. Karyera maslahati va portfolio yaratish.", categories: ["Marketing", "IT"], regions: ["Toshkent shahri"], avgRating: 4.6, ratingCount: 71, courseCount: 6, imageUrl: null, gradient: "linear-gradient(135deg, #059669, #10b981)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 240 90 90", telegram: "digitalbrain_uz", foundedYear: 2020 },
  { slug: "talim-plus", provider: "Talim+", description: "Namangan shahridagi maktab va til kurslari bo'yicha qulay markaz.", categories: ["Maktab", "Til"], regions: ["Namangan"], avgRating: 4.5, ratingCount: 29, courseCount: 5, imageUrl: null, gradient: "linear-gradient(135deg, #be123c, #f43f5e)", firstSlug: "", firstCategorySlug: "", certificate: false, phone: "+998 69 234 56 78", foundedYear: 2021 },
  { slug: "wiseschool", provider: "WiseSchool", description: "Maktab fanlari va tayyorlov yo'nalishlarida sifatli ta'lim. Individual yondashuv.", categories: ["Maktab", "Tayyorlov"], regions: ["Toshkent shahri"], avgRating: 4.6, ratingCount: 58, courseCount: 4, imageUrl: null, gradient: "linear-gradient(135deg, #4f46e5, #7c3aed)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 71 245 67 89", foundedYear: 2019 },
  { slug: "pixelart-academy", provider: "PixelArt Academy", description: "Dizayn va animatsiya bo'yicha kreativ kurslar. Portfolio loyihalar bilan o'qitiladi.", categories: ["Dizayn", "Animatsiya"], regions: ["Toshkent shahri"], avgRating: 4.7, ratingCount: 49, courseCount: 4, imageUrl: null, gradient: "linear-gradient(135deg, #ea580c, #f97316)", firstSlug: "", firstCategorySlug: "", certificate: false, phone: "+998 71 200 60 60", instagram: "pixelart.academy", foundedYear: 2020 },
  { slug: "smartmath", provider: "SmartMath", description: "Farg'ona shahridagi matematika va DTM tayyorlovi yo'nalishida yetakchi markaz.", categories: ["Matematika", "DTM"], regions: ["Farg'ona"], avgRating: 4.6, ratingCount: 33, courseCount: 3, imageUrl: null, gradient: "linear-gradient(135deg, #0891b2, #06b6d4)", firstSlug: "", firstCategorySlug: "", certificate: true, phone: "+998 73 233 44 55", foundedYear: 2018 },
];

export function findFakeCenterBySlug(slug: string): FakeCenter | null {
  return FAKE_CENTERS.find(c => c.slug === slug) ?? null;
}

// Markaz uchun fake kurslar generatsiyasi — har bir markazning kategoriyalari asosida
export type FakeCourse = {
  slug: string;
  title: string;
  category: string;
  format: "Onlayn" | "Oflayn" | "Gibrid";
  duration: string;
  price: string;
  level: string;
};

export function generateFakeCoursesForCenter(center: FakeCenter): FakeCourse[] {
  const formats: Array<"Onlayn" | "Oflayn" | "Gibrid"> = ["Oflayn", "Onlayn", "Gibrid"];
  const durations = ["3 oy", "4 oy", "6 oy", "8 oy", "1 yil"];
  const levels = ["Boshlang'ich", "O'rta", "Yuqori"];
  const priceRanges = ["500 000 so'm/oy", "800 000 so'm/oy", "1 200 000 so'm/oy", "1 500 000 so'm/oy", "2 000 000 so'm/oy"];

  const titleTemplates: Record<string, string[]> = {
    "IT": ["Full-stack dasturlash", "Backend dasturchi", "Mobile dasturlash"],
    "Dasturlash": ["Python dasturlash", "JavaScript & React", "Java dasturchi"],
    "Frontend": ["Frontend dasturchi (HTML, CSS, JS)", "React.js professional"],
    "Dizayn": ["UI/UX dizayn", "Grafik dizayn", "Figma professional"],
    "UI/UX": ["UI/UX dizayn", "Web dizayn"],
    "Animatsiya": ["2D animatsiya", "Motion grafika"],
    "Marketing": ["Raqamli marketing", "Marketing strategiya"],
    "SMM": ["SMM mutaxassis", "Content marketing"],
    "IELTS": ["IELTS 6.5+", "IELTS Speaking & Writing", "IELTS Intensive"],
    "TOEFL": ["TOEFL iBT tayyorgarlik"],
    "CEFR": ["CEFR B2 tayyorlov", "CEFR C1 darajasi"],
    "Ingliz tili": ["General English", "Business English", "Speaking Club"],
    "Nemis tili": ["A1-A2 Nemis tili", "B1 darajasi"],
    "Til": ["Til kurslari (Ingliz)", "Suhbat darslari"],
    "DTM": ["DTM kompleks tayyorlov", "DTM matematika"],
    "DTM tayyorlov": ["DTM matematika va fizika", "DTM intensiv"],
    "Matematika": ["Yuqori matematika", "Maktab matematikasi"],
    "Mantiq": ["Mantiqiy fikrlash"],
    "Maktab": ["Maktab fanlari (5-9 sinf)", "Maktab oxiri tayyorlov"],
    "Tayyorlov": ["Imtihon tayyorlov", "Olimpiada tayyorgarligi"],
    "Maktab tayyorlov": ["1-sinfga tayyorlov", "Maktab oldi tayyorlov"],
    "Bolalar": ["Bolalar uchun ingliz tili", "Bolalar matematikasi"],
    "Robotexnika": ["Bolalar uchun robototexnika", "Arduino dasturlash"],
    "Sun'iy intellekt": ["AI va Machine Learning", "Deep Learning"],
    "Data Science": ["Data Science to'liq kurs", "Python for Data Science"],
  };

  const courses: FakeCourse[] = [];
  let courseIndex = 0;
  for (const cat of center.categories) {
    const titles = titleTemplates[cat] ?? [`${cat} bo'yicha kurs`];
    for (const title of titles) {
      if (courses.length >= center.courseCount) break;
      const seed = courseIndex + center.provider.length;
      courses.push({
        slug: `${center.slug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30)}`,
        title,
        category: cat,
        format: formats[seed % formats.length],
        duration: durations[seed % durations.length],
        price: priceRanges[seed % priceRanges.length],
        level: levels[seed % levels.length],
      });
      courseIndex++;
    }
    if (courses.length >= center.courseCount) break;
  }
  // Agar yetmasa, generic kurslar bilan to'ldirish
  while (courses.length < center.courseCount) {
    const cat = center.categories[0] ?? "Umumiy";
    const seed = courses.length;
    courses.push({
      slug: `${center.slug}-kurs-${courses.length + 1}`,
      title: `${cat} kursi ${courses.length + 1}`,
      category: cat,
      format: formats[seed % formats.length],
      duration: durations[seed % durations.length],
      price: priceRanges[seed % priceRanges.length],
      level: levels[seed % levels.length],
    });
  }
  return courses;
}
