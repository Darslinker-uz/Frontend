import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, BookOpen, Video, GraduationCap, Target, Zap } from "lucide-react";
import { FaqList } from "@/components/faq-item";
import { RepetitorlarHero } from "@/components/repetitorlar-hero";
import { RepetitorlarSlider } from "@/components/repetitorlar-slider";
import { getActiveCategoryGroups } from "@/lib/listings";
import { getActiveRegions } from "@/lib/regions";
import { getActiveTutors } from "@/lib/tutors";
import { FAKE_TUTORS, type FakeTutor } from "@/data/fake-tutors";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export const metadata: Metadata = {
  title: "Repetitorlar — O'zbekistondagi shaxsiy o'qituvchilar",
  description: "O'zbekiston bo'ylab shaxsiy repetitorlarni toping: matematika, ingliz tili, fizika, kimyo va boshqa fanlar bo'yicha 1-on-1 darslar. Onlayn yoki uyda — sizga mos repetitorni Darslinker'da tanlang.",
  keywords: [
    "repetitor",
    "shaxsiy o'qituvchi",
    "repetitor toshkent",
    "1 on 1 dars",
    "uy darslari",
    "online repetitor",
    "matematika repetitori",
    "ingliz tili repetitori",
    "fizika repetitori",
    "kimyo repetitori",
    "DTM tayyorlov repetitor",
    "IELTS repetitor",
    "o'zbekiston repetitorlari",
  ],
  alternates: { canonical: `${SITE_URL}/repetitorlar` },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: `${SITE_URL}/repetitorlar`,
    siteName: "Darslinker.uz",
    title: "Repetitorlar — O'zbekistondagi shaxsiy o'qituvchilar",
    description: "Matematika, ingliz tili, fizika, kimyo va boshqa fanlar bo'yicha shaxsiy repetitorlarni Darslinker'da toping.",
    images: ["/og-image.png?v=4"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Repetitorlar — Darslinker.uz",
    description: "O'zbekiston bo'ylab shaxsiy repetitorlarni toping.",
    images: ["/og-image.png?v=4"],
  },
};

// Tutor lib turini slider FakeTutor turiga moslashtirish
function tutorToSlideFormat(t: Awaited<ReturnType<typeof getActiveTutors>>[number]): FakeTutor {
  const G = [
    "linear-gradient(135deg,#7a3d8a,#3a1e4f)",
    "linear-gradient(135deg,#d946ef,#7a3d8a)",
    "linear-gradient(135deg,#6d28d9,#3a1e4f)",
    "linear-gradient(135deg,#a21caf,#581c87)",
  ];
  // Eng birinchi fan (subject) — listing kategoriyalaridan
  const firstSubject = t.subjects[0] ?? "Repetitor";
  const isOnline = t.regions.length === 0 || t.regions.includes("Onlayn");
  const region = t.regions[0] ?? "Onlayn";
  return {
    slug: t.slug,
    name: t.fullName,
    subject: firstSubject,
    subjectKey: firstSubject.toLowerCase().replace(/\s+/g, "-"),
    rating: Math.round((t.avgRating || 4.7) * 10) / 10,
    reviews: t.ratingCount || 0,
    online: isOnline,
    region,
    experience: new Date().getFullYear() - 2020, // taxminiy, kelajakda User.experience field
    price: 50000, // taxminiy, kurslardan
    gradient: G[t.id % G.length],
  };
}

export default async function RepetitorlarPage() {
  const [groups, regions, realTutors] = await Promise.all([
    getActiveCategoryGroups({ homepageOnly: true }),
    getActiveRegions(),
    getActiveTutors(),
  ]);

  // Real tutorlarni FakeTutor formatiga konvertatsiya qilamiz.
  // Production'da FAQAT real repetitorlar ko'rsatiladi; fake demo'lar faqat
  // development'da to'ldiruvchi sifatida qo'shiladi (UI sinash uchun).
  const realAsFake = realTutors.map(tutorToSlideFormat);
  const realNames = new Set(realAsFake.map(t => t.name));
  const slidersTutors: FakeTutor[] =
    process.env.NODE_ENV === "production"
      ? realAsFake
      : [...realAsFake, ...FAKE_TUTORS.filter(f => !realNames.has(f.name))];

  // FAQ — repetitor bo'limiga maxsus
  const faqs = [
    {
      q: "Repetitor va o'quv markazi nimasi bilan farq qiladi?",
      a: "Repetitor — shaxsiy o'qituvchi, odatda 1-on-1 yoki kichik guruhda dars beradi. O'quv markazi esa filiali, jamoasi va sertifikati bo'lgan tashkilot. Repetitor moslashuvchanroq, markaz esa tartibli dastur taklif qiladi.",
    },
    {
      q: "Darslinker'da repetitorlar tekshirilganmi?",
      a: "Ha. Har bir repetitor ariza topshirgandan keyin admin tomonidan ko'rib chiqiladi. Faqat ma'lumotlari to'g'ri va haqiqiy bo'lganlar saytda chiqadi.",
    },
    {
      q: "Onlayn repetitor topish mumkinmi?",
      a: "Albatta. Filtrlarda \"online\" formatini tanlasangiz, butun O'zbekiston bo'ylab masofadan dars beradigan repetitorlar ko'rinadi — vaqt va joydan qat'i nazar mos birini topasiz.",
    },
    {
      q: "Repetitor narxlari qancha?",
      a: "Narxlar tajriba, fan va format (onlayn/oflayn, individual/guruh)ga qarab farqlanadi. Har bir repetitor sahifasida aniq narx va dars rejasi ko'rsatilgan.",
    },
    {
      q: "O'zim repetitor bo'lib ro'yxatdan o'tmoqchiman, qanday qilaman?",
      a: "Bosh sahifadagi \"Hamkorlik qilish\" sahifasidan ariza topshiring. Ro'yxatdan o'tishda \"Repetitor\" turini tanlang — admin tasdiqlagandan keyin profilingiz repetitorlar bo'limida chiqadi.",
    },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Asosiy", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Repetitorlar", "item": `${SITE_URL}/repetitorlar` },
    ],
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Repetitorlar — O'zbekistondagi shaxsiy o'qituvchilar",
    "url": `${SITE_URL}/repetitorlar`,
    "inLanguage": "uz",
    "description": "O'zbekiston bo'ylab shaxsiy repetitorlar va fanlar bo'yicha o'qituvchilar katalogi.",
    "isPartOf": { "@type": "WebSite", "name": "Darslinker.uz", "url": SITE_URL },
    "about": {
      "@type": "Service",
      "name": "Repetitor xizmatlari",
      "areaServed": { "@type": "Country", "name": "O'zbekiston" },
    },
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

  // HowTo schema — "Repetitorni qanday tanlash"
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Repetitorni qanday tanlash",
    "description": "Sizga mos shaxsiy repetitorni topishning 4 ta asosiy qadami",
    "step": [
      { "@type": "HowToStep", "position": 1, "name": "Fan va maqsadni belgilang", "text": "Qaysi fandan va qaysi maqsad uchun (DTM, IELTS, maktab darslari) repetitor kerakligini aniqlang." },
      { "@type": "HowToStep", "position": 2, "name": "Formatni tanlang", "text": "Onlayn yoki yuzma-yuz? Vaqtingiz va sharoitingizga mos formatni tanlang." },
      { "@type": "HowToStep", "position": 3, "name": "Tajriba va reytingni tekshiring", "text": "Repetitorning tajribasi, o'quvchilar reytingi va real sharhlariga e'tibor bering." },
      { "@type": "HowToStep", "position": 4, "name": "Sinov darsida ko'ring", "text": "Imkon bo'lsa, oldin bitta sinov darsida o'qituvchini sinab ko'ring, so'ng qaror qiling." },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />

      {/* HERO — markazlar bilan bir xil dizayn (violet tema) */}
      <RepetitorlarHero
        regions={regions.map((r) => ({ slug: r.slug, name: r.name }))}
        groups={groups.map((g) => ({ slug: g.slug, name: g.name, count: g.listingsCount }))}
      />

      {/* REPETITORLAR — slider. Real repetitor bo'lmasa (prod) bo'lim yashiriladi */}
      {slidersTutors.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-5 md:px-20 py-10 md:py-14">
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">Repetitorlar</h2>
            </div>
          </div>

          <RepetitorlarSlider tutors={slidersTutors} />
        </section>
      )}

      {/* BROWSE BY FAN */}
      <section className="bg-white border-y border-[#e4e7ea] py-10 md:py-14">
        <div className="max-w-[1600px] mx-auto px-5 md:px-20">
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">Fan bo&apos;yicha repetitor</h2>
              <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-1.5">Kerakli fandan shaxsiy o&apos;qituvchini tanlang</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {groups.map((g) => (
              <Link key={g.slug} href={`/kurslar/g/${g.slug}`} className="group relative overflow-hidden bg-gradient-to-br from-[#fbf8fc] to-[#f4eef8] hover:from-fuchsia-50 hover:to-fuchsia-100 border border-[#e4e7ea] hover:border-fuchsia-200 rounded-[16px] p-5 md:p-6 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[16px] md:text-[18px] font-bold text-[#16181a] tracking-[-0.02em] leading-tight">{g.name}</div>
                    <div className="text-[12px] text-[#7c8490] mt-1.5 line-clamp-2 leading-snug">{g.desc}</div>
                  </div>
                  <div className="text-[28px] md:text-[34px] font-extrabold text-[#16181a]/10 group-hover:text-fuchsia-600/30 transition-colors leading-none">
                    {g.listingsCount}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-[12px] font-semibold text-fuchsia-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ko&apos;rish <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEGA SHAXSIY REPETITOR */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-20 py-10 md:py-14">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">Nega shaxsiy repetitor kerak?</h2>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2 max-w-[560px] mx-auto">Guruh darslaridan farqli o&apos;laroq — butun e&apos;tibor faqat sizda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {[
            { icon: Target, title: "Sizga moslashgan dastur", desc: "Repetitor darajangiz, maqsadingiz va vaqtingizga qarab dars rejasini tuzadi — “hammaga bir xil” yo'q." },
            { icon: Zap, title: "Tezroq natija", desc: "1 ga 1 darsda butun e'tibor sizda. Bitta soat shaxsiy dars guruhdagi bir necha darsga teng samara beradi." },
            { icon: Video, title: "Onlayn yoki uyda", desc: "Vaqtingiz cheklangani muammo emas — onlayn ulanasiz yoki repetitor uyingizga keladi. Siz tanlaysiz." },
          ].map((b) => (
            <div key={b.title} className="bg-white border border-[#e4e7ea] rounded-[18px] p-6 md:p-7">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-fuchsia-500/20">
                <b.icon className="w-5 h-5" />
              </div>
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#16181a] tracking-[-0.02em]">{b.title}</h3>
              <p className="text-[14px] md:text-[15px] text-[#6a7585] mt-2 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO CHOOSE */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-20 py-10 md:py-14">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">Repetitorni qanday tanlash?</h2>
          <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2 max-w-[560px] mx-auto">Sizga mos shaxsiy o&apos;qituvchini topishning 4 ta asosiy qadami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            { icon: BookOpen, title: "1. Fan va maqsadni belgilang", desc: "Qaysi fandan va qaysi maqsad uchun (DTM, IELTS, maktab) repetitor kerakligini aniqlang." },
            { icon: Video, title: "2. Formatni tanlang", desc: "Onlayn yoki yuzma-yuz? Vaqtingiz va sharoitingizga mos formatni tanlang." },
            { icon: Star, title: "3. Tajriba va reytingni tekshiring", desc: "Repetitor tajribasi, o'quvchilar reytingi va real sharhlariga e'tibor bering." },
            { icon: GraduationCap, title: "4. Sinov darsida ko'ring", desc: "Imkon bo'lsa — bitta sinov darsida sinab ko'ring va keyin qaror qabul qiling." },
          ].map((s) => (
            <div key={s.title} className="bg-white border border-[#e4e7ea] rounded-[18px] p-5 md:p-6">
              <div className="w-11 h-11 rounded-[12px] bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="text-[16px] md:text-[17px] font-bold text-[#16181a] tracking-[-0.02em]">{s.title}</h3>
              <p className="text-[13px] md:text-[14px] text-[#6a7585] mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-[#e4e7ea] py-10 md:py-14" aria-label="Repetitorlar haqida ko'p so'raladigan savollar">
        <div className="max-w-[1100px] mx-auto px-5 md:px-20">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-[26px] md:text-[36px] font-bold text-[#16181a] tracking-[-0.03em]">Ko&apos;p so&apos;raladigan savollar</h2>
            <p className="text-[14px] md:text-[16px] text-[#7c8490] mt-2">Repetitor tanlash, narxlar va Darslinker xizmati haqida</p>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* HAMKORLIK CTA — asosiy sahifadagi bilan bir xil */}
      <section className="max-w-[1600px] mx-auto px-5 md:px-20 py-10 md:py-14">
        <div className="bg-[#e8eaed] rounded-[20px] p-8 md:p-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-outfit)] text-[18px] md:text-[26px] font-bold text-[#16181a] leading-tight">
              Repetitormisiz?
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
