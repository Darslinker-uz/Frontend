import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, ShieldCheck, BookOpen, MessageSquare, Clock, Sparkles, Users } from "lucide-react";
import { FaqList } from "@/components/faq-item";
import { OquvMarkazlarHero } from "@/components/oquv-markazlar-hero";
import { OquvMarkazlarGrid } from "@/components/oquv-markazlar-grid";
import { FAKE_CENTERS } from "@/data/fake-centers";
import { getActiveCenters } from "@/lib/centers";
import { getActiveCategoryGroups, getFeaturedListings, getPopularListings } from "@/lib/listings";
import { getActiveRegions } from "@/lib/regions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "O'quv markazlar — O'zbekistondagi kurs markazlari katalogi",
  description: "O'zbekiston bo'ylab tekshirilgan o'quv markazlarini toping: IT, ingliz tili, dizayn, marketing va boshqa yo'nalishlar. Sertifikatli kurslar, filiallar va guruh darslari — Darslinker katalogida.",
  keywords: [
    "o'quv markaz",
    "kurs markazi",
    "o'quv markazlar toshkent",
    "o'zbekiston o'quv markazlari",
    "guruh darslari",
    "sertifikatli kurs",
    "IT o'quv markaz",
    "ingliz tili markazi",
    "ielts markaz",
    "dasturlash markazi",
    "marketing markazi",
    "samarqand o'quv markaz",
    "andijon o'quv markaz",
  ],
  alternates: { canonical: `${SITE_URL}/oquv-markazlar` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/oquv-markazlar`,
    siteName: "Darslinker.uz",
    title: "O'quv markazlar — O'zbekistondagi kurs markazlari",
    description: "Tekshirilgan o'quv markazlarini bitta katalogda toping va o'zingizga moslarini tanlang.",
    images: ["/og-image.png?v=4"],
  },
  twitter: {
    card: "summary_large_image",
    title: "O'quv markazlar — Darslinker.uz",
    description: "O'zbekistondagi o'quv markazlari katalogi.",
    images: ["/og-image.png?v=4"],
  },
};

export default async function OquvMarkazlarPage() {
  const [groups, featured, popular, regions, realCenters] = await Promise.all([
    getActiveCategoryGroups({ homepageOnly: true }),
    getFeaturedListings(),
    getPopularListings(),
    getActiveRegions(),
    getActiveCenters(),
  ]);

  // Statistikalar — real ma'lumotlardan hisoblanadi
  const totalGroups = groups.length;
  const totalCategories = groups.reduce((a, g) => a + g.categories.length, 0);
  const totalRegions = regions.length;
  const totalListings = popular.length + featured.length; // soni emas, lekin minimal ko'rsatkich
  // Unikal markazlar (provider)
  const allCourses = [...featured, ...popular];
  const uniqueProviders = new Set(allCourses.map(c => c.provider).filter(p => p && p !== "—"));
  const totalCenters = uniqueProviders.size;
  // O'rtacha reyting (faqat reytingi borlarda)
  const ratedCourses = allCourses.filter(c => (c.ratingCount ?? 0) > 0);
  const avgRating = ratedCourses.length > 0
    ? (ratedCourses.reduce((a, c) => a + (c.ratingAvg ?? 0), 0) / ratedCourses.length).toFixed(1)
    : "—";

  // Markazlar real DB'dan keladi (getActiveCenters)
  // Tartib: reyting bo'yicha, keyin kursi ko'p
  const centers = [...realCenters].sort((a, b) => {
    if (a.avgRating !== b.avgRating) return b.avgRating - a.avgRating;
    return b.courseCount - a.courseCount;
  });

  // Display markazlar: production'da FAQAT real markazlar; fake demo'lar faqat
  // development'da to'ldiruvchi sifatida qo'shiladi (UI sinash uchun).
  const realProviders = new Set(centers.map(c => c.provider));
  const fakesToShow =
    process.env.NODE_ENV === "production"
      ? []
      : FAKE_CENTERS.filter(f => !realProviders.has(f.provider));
  // Real shape va fake shape biroz farq qiladi — ikkalasi ham grid uchun mos
  const displayCenters: Array<{
    slug: string;
    provider: string;
    categories: string[];
    regions: string[];
    avgRating: number;
    ratingCount: number;
    courseCount: number;
    imageUrl: string | null;
    gradient: string;
    firstSlug: string;
    firstCategorySlug: string;
    isReal: boolean;
  }> = [
    ...centers.map(c => ({
      slug: c.slug,
      provider: c.provider,
      categories: c.categories,
      regions: c.regions,
      avgRating: c.avgRating,
      ratingCount: c.ratingCount,
      courseCount: c.courseCount,
      imageUrl: c.imageUrl,
      gradient: c.gradient,
      firstSlug: c.firstSlug,
      firstCategorySlug: c.firstCategorySlug,
      isReal: true,
    })),
    ...fakesToShow.map(f => ({
      slug: f.slug,
      provider: f.provider,
      categories: f.categories,
      regions: f.regions,
      avgRating: f.avgRating,
      ratingCount: f.ratingCount,
      courseCount: f.courseCount,
      imageUrl: f.imageUrl,
      gradient: f.gradient,
      firstSlug: f.firstSlug,
      firstCategorySlug: f.firstCategorySlug,
      isReal: false,
    })),
  ];

  // Top viloyatlar — featured bo'lganlari avval
  const topRegions = [...regions]
    .sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1))
    .slice(0, 8);

  const faqs = [
    {
      q: "O'quv markazi va repetitor o'rtasidagi farq nima?",
      a: "O'quv markazi — bu rasmiy tashkilot: filiallari, jamoasi, dasturi va ko'pincha sertifikati bor. Repetitor esa shaxsiy o'qituvchi — 1-on-1 yoki kichik guruhda dars beradi. Markazlar tartibli kurs taklif qiladi, repetitorlar moslashuvchanroq.",
    },
    {
      q: "Darslinker'dagi o'quv markazlari ishonchli ekanini qanday bilamiz?",
      a: "Har bir markaz ro'yxatdan o'tganda admin tomonidan tekshiriladi: hujjatlar, manzil, kontakt. Faqat tasdiqlanganlar saytda chiqadi. Bundan tashqari, o'quvchilar sharhlari va reytingi har bir sahifada ochiq.",
    },
    {
      q: "Qanday qilib o'zimga eng yaqin o'quv markazni topaman?",
      a: "Yuqoridagi viloyat tabs'larida o'z hududingizni tanlang yoki qidiruvda shahar nomini yozing. Onlayn kurslar ham bor — har joydan ulanish mumkin.",
    },
    {
      q: "O'quv markazi sertifikat beradimi?",
      a: "Aksariyat markazlar kurs tugagandan keyin sertifikat beradi. Har bir kurs sahifasida \"Sertifikat\" maydoni bor — sertifikat berilishi va turi haqida aniq ma'lumot ko'rinadi.",
    },
    {
      q: "O'z o'quv markazimni Darslinker'ga qo'shmoqchiman, qaerdan boshlayman?",
      a: "\"Hamkorlik\" sahifasi orqali ariza topshiring. Ro'yxatdan o'tishda \"O'quv markaz\" turini tanlang — admin tasdiqlagandan keyin profilingiz aktivlashadi va o'quv markazlar bo'limida chiqadi.",
    },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Asosiy", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "O'quv markazlar", "item": `${SITE_URL}/oquv-markazlar` },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "O'quv markazlar — O'zbekistondagi kurs markazlari",
    "url": `${SITE_URL}/oquv-markazlar`,
    "inLanguage": "uz",
    "description": "O'zbekiston bo'ylab tekshirilgan o'quv markazlari va kurs tashkilotlari katalogi.",
    "isPartOf": { "@type": "WebSite", "name": "Darslinker.uz", "url": SITE_URL },
    "about": {
      "@type": "EducationalOrganization",
      "name": "O'quv markazlari",
      "areaServed": { "@type": "Country", "name": "O'zbekiston" },
    },
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Mashhur o'quv markazlari",
    "numberOfItems": centers.length,
    "itemListElement": centers.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE_URL}/oquv-markazlar/${c.slug}`,
      "name": c.provider,
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", "h3", "summary"],
    },
  };

  // HowTo schema — "O'quv markazni qanday tanlash"
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "O'quv markazni qanday tanlash",
    "description": "Sizga mos o'quv markazni topishning 4 ta asosiy qadami",
    "step": [
      { "@type": "HowToStep", "position": 1, "name": "Yo'nalishni belgilang", "text": "Qaysi fan yoki ko'nikmani o'rganmoqchisiz? Aniq maqsadni belgilang — IT, til, dizayn, marketing va h.k." },
      { "@type": "HowToStep", "position": 2, "name": "Joylashuv va formatni tanlang", "text": "Onlayn yoki yaqin atrofdagi markaz? Vaqtingiz va sharoitingizga mos formatni tanlang." },
      { "@type": "HowToStep", "position": 3, "name": "Sharh va reytingni tekshiring", "text": "Markazlar reytingi, real o'quvchilar sharhi va o'qituvchilar tajribasiga e'tibor bering." },
      { "@type": "HowToStep", "position": 4, "name": "Demo darsda sinab ko'ring", "text": "Bepul demo dars bo'lsa, oldin sinab ko'ring. So'ng yakuniy qaror qabul qiling." },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />

      {/* HERO — markazlashtirilgan, dark glass filter */}
      <OquvMarkazlarHero
        totalCenters={totalCenters}
        totalCategories={totalCategories}
        totalRegions={totalRegions}
        regions={regions.map(r => ({ slug: r.slug, name: r.name }))}
        groups={groups
          .map(g => ({ slug: g.slug, name: g.name, count: g.listingsCount }))
          .filter(g => g.count > 0)
          .sort((a, b) => b.count - a.count)}
        topRegions={topRegions.map(r => ({ slug: r.slug, name: r.name }))}
      />

      {/* TOP MARKAZLAR — center-focused cards. Real markaz bo'lmasa (prod) yashiriladi */}
      {displayCenters.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-5 md:px-20 py-12 md:py-16">
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1 mb-3">
                <Star className="w-3 h-3 fill-emerald-700 text-emerald-700" />
                <span className="text-[11px] font-semibold text-emerald-800 tracking-wider uppercase">Top reytingli</span>
              </div>
              <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">O&apos;quv markazlar</h2>
              <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-1.5">O&apos;quvchilar tomonidan eng yuqori baholangan tekshirilgan markazlar</p>
            </div>
            <Link href="/oquv-markazlar/barchasi" className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-700 hover:text-emerald-800 shrink-0">
              Barcha markazlar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <OquvMarkazlarGrid
            pageSize={12}
            centers={displayCenters.map(c => ({
              slug: c.slug,
              provider: c.provider,
              categories: c.categories,
              regions: c.regions,
              avgRating: c.avgRating,
              ratingCount: c.ratingCount,
              courseCount: c.courseCount,
              imageUrl: c.imageUrl,
              gradient: c.gradient,
              firstSlug: c.firstSlug,
              firstCategorySlug: c.firstCategorySlug,
            }))}
          />
        </section>
      )}

      {/* YO'NALISH BO'YICHA — improved category grid */}
      <section className="bg-white border-y border-[#e4e7ea] py-12 md:py-16">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20">
          <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">Yo&apos;nalish bo&apos;yicha markazlar</h2>
              <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-1.5">Sizni qiziqtirgan yo&apos;nalishni tanlab, markazlarni ko&apos;ring</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {groups.map(g => (
              <Link
                key={g.slug}
                href={`/kurslar/g/${g.slug}`}
                className="group relative overflow-hidden bg-[#f8fbfa] border border-[#e4e7ea] hover:border-emerald-300 hover:bg-white hover:shadow-lg hover:shadow-emerald-900/5 rounded-[18px] p-5 md:p-6 transition-all"
              >
                {/* Decorative emerald blob */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-50/70 group-hover:bg-emerald-100 transition-colors" />
                <div className="relative">
                  <div className="text-[16px] md:text-[18px] font-bold text-[#16181a] tracking-[-0.02em] leading-tight">{g.name}</div>
                  <div className="text-[12px] text-[#7c8490] mt-1.5 line-clamp-2 leading-snug min-h-[32px]">{g.desc}</div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f2f4f5]">
                    <span className="text-[12px] text-[#16181a]">
                      <span className="font-bold">{g.listingsCount}</span>
                      <span className="text-[#7c8490] ml-1">e&apos;lon</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#7c8490] group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DARSLINKER? — trust features */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-20 py-12 md:py-16">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">Nima uchun aynan Darslinker?</h2>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2 max-w-[580px] mx-auto">Ota-onalar va o&apos;quvchilar Darslinker&apos;da ishonchli o&apos;quv markazni topishi uchun nima qilamiz</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            { icon: ShieldCheck, title: "Tekshirilgan markazlar", desc: "Har bir markaz admin tomonidan tekshiriladi — hujjatlar, manzil, kontakt", color: "emerald" },
            { icon: MessageSquare, title: "Real sharhlar", desc: "O'quvchilarning haqiqiy fikrlari va reyting — soxtalashtirib bo'lmaydigan", color: "amber" },
            { icon: Sparkles, title: "Bepul taqqoslash", desc: "Markazlarni narx, joylashuv va sifat bo'yicha bir joyda solishtiring", color: "violet" },
            { icon: Clock, title: "24 soatda javob", desc: "Ariza qoldiring — markaz vakili 24 soat ichida siz bilan bog'lanadi", color: "sky" },
          ].map((f) => {
            const colors: Record<string, string> = {
              emerald: "bg-emerald-50 text-emerald-700",
              amber: "bg-amber-50 text-amber-700",
              violet: "bg-violet-50 text-violet-700",
              sky: "bg-sky-50 text-sky-700",
            };
            return (
              <div key={f.title} className="bg-white border border-[#e4e7ea] rounded-[20px] p-5 md:p-6 hover:shadow-md hover:shadow-black/5 transition-all">
                <div className={`w-12 h-12 rounded-[14px] ${colors[f.color]} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] md:text-[17px] font-bold text-[#16181a] tracking-[-0.02em]">{f.title}</h3>
                <p className="text-[13px] md:text-[14px] text-[#6a7585] mt-2 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW TO CHOOSE — visual stepper */}
      <section className="bg-white border-y border-[#e4e7ea] py-12 md:py-16">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">O&apos;quv markazni qanday tanlash?</h2>
            <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2 max-w-[580px] mx-auto">Sizga mos markazni topishning 4 ta asosiy qadami</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-4">
            {/* Connecting line — only on desktop */}
            <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent pointer-events-none" />

            {[
              { num: "01", icon: BookOpen, title: "Yo'nalishni belgilang", desc: "IT, til, dizayn, marketing — qaysi sohada o'sishni xohlaysiz?" },
              { num: "02", icon: MapPin, title: "Joy va formatni tanlang", desc: "Onlayn yoki yaqin atrofdagi markaz? Vaqtingizga moslang." },
              { num: "03", icon: Star, title: "Reyting va sharhlar", desc: "Sharhlar, reyting va o'qituvchilar tajribasiga e'tibor bering." },
              { num: "04", icon: Users, title: "Demo darsda sinab ko'ring", desc: "Bepul demo dars bo'lsa — sinab ko'ring va qaror qabul qiling." },
            ].map((s) => (
              <div key={s.num} className="relative bg-[#f8fbfa] border border-[#e4e7ea] rounded-[20px] p-5 md:p-6 hover:bg-white hover:border-emerald-200 transition-all">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-emerald-200 mb-4 mx-auto md:mx-0">
                  <s.icon className="w-5 h-5 text-emerald-700" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {s.num.replace("0", "")}
                  </span>
                </div>
                <h3 className="text-[16px] md:text-[17px] font-bold text-[#16181a] tracking-[-0.02em] text-center md:text-left">{s.title}</h3>
                <p className="text-[13px] md:text-[14px] text-[#6a7585] mt-2 leading-relaxed text-center md:text-left">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-20 py-12 md:py-16" aria-label="O'quv markazlari haqida ko'p so'raladigan savollar">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-white border border-[#e4e7ea] rounded-full px-2.5 py-1 mb-3">
            <MessageSquare className="w-3 h-3 text-emerald-700" />
            <span className="text-[11px] font-semibold text-[#16181a] tracking-wider uppercase">FAQ</span>
          </div>
          <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">Ko&apos;p so&apos;raladigan savollar</h2>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2">O&apos;quv markazlar haqida bilishingiz kerak bo&apos;lgan asosiy ma&apos;lumotlar</p>
        </div>
        <div className="bg-white border border-[#e4e7ea] rounded-[20px] p-6 md:p-10">
          <FaqList items={faqs} />
        </div>
      </section>

      {/* HAMKORLIK CTA — bosh sahifa bilan bir xil oddiy stil */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-20 pb-12 md:pb-16">
        <div className="bg-[#e8eaed] rounded-[20px] p-8 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-outfit)] text-[18px] md:text-[26px] font-bold text-[#16181a] leading-tight">
              O&apos;quv markaz egasimisiz?
            </h2>
            <Link href="/hamkorlik">
              <Button className="h-[40px] md:h-[44px] px-5 md:px-6 rounded-[12px] bg-white text-[#16181a] text-[13px] md:text-[14px] font-medium hover:bg-white/80 transition-colors shrink-0 flex items-center gap-2 border-0">
                Hamkorlik
                <ArrowRight className="w-[16px] h-[16px]" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
