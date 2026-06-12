import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/faq-item";
import { getActiveListings, getActiveCategories } from "@/lib/listings";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

// Modifier registry — har biri DB filtri va matn beradi
type ModifierDef = {
  label: string;
  intro: (cat: string) => string;
  filter: (l: { format: string; level?: string; title: string; price: string }) => boolean;
  faqExtra: { q: string; a: string }[];
  siblings: string[];
};

const MODIFIERS: Record<string, ModifierDef> = {
  "bolalar-uchun": {
    label: "Bolalar uchun",
    intro: (cat) =>
      `5-12 yoshdagi bolalar uchun maxsus moslashtirilgan ${cat.toLowerCase()} kurslari. O'yin va interaktiv metodikalar orqali bola tilni qiziqarli o'rganadi.`,
    filter: (l) => /bola|kid|kids|child/i.test(l.title),
    faqExtra: [
      { q: "Necha yoshdan boshlash mumkin?", a: "Aksariyat markazlar 5-6 yoshdan qabul qiladi. Ba'zi markazlar 4 yoshdan ham boshlaydi." },
      { q: "Bolalar uchun maxsus metodika nima?", a: "Cambridge YLE, Oxford Kids va shunga o'xshash xalqaro tasdiqlangan dasturlar — o'yin asosida o'qitish." },
    ],
    siblings: ["onlayn", "intensiv"],
  },
  onlayn: {
    label: "Onlayn",
    intro: (cat) =>
      `Onlayn ${cat.toLowerCase()} kurslari — uydan chiqmasdan, qulay vaqtda va tejamkor narxda o'qish imkoniyati. Zoom, Google Meet va maxsus platformalar orqali.`,
    filter: (l) => l.format === "Online",
    faqExtra: [
      { q: "Onlayn kurs samaralimi?", a: "Ha. Tajribali o'qituvchilar va interaktiv platformalar bilan onlayn kurs offline bilan teng samara beradi." },
      { q: "Onlayn kurs uchun nima kerak?", a: "Internet, kompyuter yoki telefon, va naushnik. Ko'pchilik markazlar Zoom yoki Google Meet ishlatadi." },
    ],
    siblings: ["oflayn", "bolalar-uchun", "intensiv"],
  },
  oflayn: {
    label: "Oflayn",
    intro: (cat) =>
      `Oflayn (offline) ${cat.toLowerCase()} kurslari — o'quv markazda jonli o'qituvchi bilan, jamoaviy muhitda. Tirik nutq amaliyoti va qattiq disciplina.`,
    filter: (l) => l.format === "Offline",
    faqExtra: [
      { q: "Oflayn vs onlayn — qaysi yaxshi?", a: "Oflayn — disciplina va tirik amaliyot uchun. Onlayn — qulaylik va tejam uchun. Maqsadingizga qarang." },
    ],
    siblings: ["onlayn", "bolalar-uchun"],
  },
  intensiv: {
    label: "Intensiv",
    intro: (cat) =>
      `Intensiv ${cat.toLowerCase()} kurslari — qisqa muddatda maksimal natija. Haftada 4-6 marta, 2-4 soatdan dars.`,
    filter: (l) => /intensiv|crash|fast|tezkor/i.test(l.title) || (l.level?.includes("intensiv") ?? false),
    faqExtra: [
      { q: "Intensiv kurs necha vaqt davom etadi?", a: "Odatda 1-3 oy. Maqsadga qarab ba'zi kurslar 6 oygacha cho'zilishi mumkin." },
    ],
    siblings: ["onlayn", "boshlovchi"],
  },
  boshlovchi: {
    label: "Boshlovchilar uchun",
    intro: (cat) =>
      `Noldan ${cat.toLowerCase()} o'rganuvchi boshlovchilar uchun kurslar. A1-A2 darajadan boshlab, asoslarni mustahkam o'rgatadi.`,
    filter: (l) =>
      /boshlovchi|beginner|noldan|A1|A2/i.test(l.title) || (l.level?.toLowerCase().includes("a1") ?? false),
    faqExtra: [
      { q: "Hech narsa bilmasam ham bo'ladimi?", a: "Ha. Boshlovchi kurslari aynan noldan boshlovchilar uchun mo'ljallangan." },
    ],
    siblings: ["intensiv", "onlayn"],
  },
  arzon: {
    label: "Arzon",
    intro: (cat) =>
      `${cat} bo'yicha eng arzon kurslar. Sifatli ta'limni mos narxda olishni istovchilar uchun tanlangan o'quv markazlar.`,
    filter: () => true, // narx bo'yicha keyingi sortlash bilan
    faqExtra: [
      { q: "Arzon kurs sifatlimi?", a: "Ha — narx pastligi sifat pasligini anglatmaydi. Yangi va kichik markazlar ham yuqori sifat berishi mumkin." },
    ],
    siblings: ["onlayn", "boshlovchi"],
  },
};

interface Props {
  params: Promise<{ kategoriya: string; modifier: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategoriya, modifier } = await params;
  const categories = await getActiveCategories();
  const cat = categories.find((c) => c.slug === kategoriya);
  const mod = MODIFIERS[modifier];
  if (!cat || !mod) return { title: "Sahifa topilmadi" };

  const url = `${SITE_URL}/kurslar/${kategoriya}/t/${modifier}`;
  const title = `${mod.label} ${cat.name.toLowerCase()} kurslari — Darslinker`;
  const description = `${mod.label} ${cat.name.toLowerCase()} kurslari — narx, format, metodika bo'yicha solishtirib tanlang. O'zbekiston bo'yicha aktiv markazlar.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "uz_UZ", url, siteName: "Darslinker.uz", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function YonalishPage({ params }: Props) {
  const { kategoriya, modifier } = await params;
  const categories = await getActiveCategories();
  const cat = categories.find((c) => c.slug === kategoriya);
  const mod = MODIFIERS[modifier];
  if (!cat || !mod) notFound();

  const all = await getActiveListings({ categorySlug: cat.slug, includeRemote: true });
  let filtered = all.filter((l) =>
    mod.filter({ format: l.format, level: l.level, title: l.title, price: l.price }),
  );

  const parsePrice = (p: string): number => {
    const n = parseInt(p.replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
  };

  // "Arzon" uchun narx bo'yicha sortlash
  if (modifier === "arzon") {
    filtered = [...all].sort((a, b) => parsePrice(a.price) - parsePrice(b.price)).slice(0, 12);
  } else {
    filtered = filtered.slice(0, 12);
  }

  const url = `${SITE_URL}/kurslar/${kategoriya}/t/${modifier}`;

  const faqs = [
    {
      q: `${mod.label} ${cat.name.toLowerCase()} kurslari narxi qancha?`,
      a:
        filtered.length > 0
          ? `Narxlar markazga qarab har xil — pastdagi kurslar ro'yxatida har bir kurs uchun aniq narx ko'rsatilgan.`
          : `Narxlar har xil. Aniq raqamlar uchun pastdagi kurslar ro'yxatini ko'ring.`,
    },
    {
      q: `${mod.label} ${cat.name.toLowerCase()} kursi qanday tanlash kerak?`,
      a: `Markaz reytingi, narx, joylashuv va metodika bo'yicha qiyoslang. Birinchi darsda demo so'rang — ko'p markazlar bepul demo o'tkazadi.`,
    },
    ...mod.faqExtra,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: `${mod.label} ${cat.name} kurslari`,
        itemListElement: filtered.map((l, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: l.title,
          url: `${SITE_URL}/kurslar/${cat.slug}/${l.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="bg-white min-h-screen">
        <article className="max-w-[1100px] mx-auto px-5 md:px-6 py-10 md:py-14">
          {/* Breadcrumb */}
          <nav className="text-[13px] text-[#7c8490] mb-5">
            <Link href="/" className="hover:text-[#16181a]">Asosiy</Link>
            <span className="mx-2">›</span>
            <Link href="/kurslar" className="hover:text-[#16181a]">Kurslar</Link>
            <span className="mx-2">›</span>
            <Link href={`/kurslar/${cat.slug}`} className="hover:text-[#16181a]">{cat.name}</Link>
            <span className="mx-2">›</span>
            <span className="text-[#16181a]">{mod.label}</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              {mod.label} {cat.name.toLowerCase()} kurslari
            </h1>
            <p className="mt-4 text-[15.5px] md:text-[17px] text-[#16181a]/75 leading-relaxed max-w-[720px]">
              {mod.intro(cat.name)}
            </p>
          </header>

          {/* Listings */}
          <section className="mb-12">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-4">
              {filtered.length} ta kurs topildi
            </h2>
            {filtered.length === 0 ? (
              <p className="text-[#7c8490]">Bu yo&apos;nalish bo&apos;yicha hozircha kurs yo&apos;q. <Link href={`/kurslar/${cat.slug}`} className="text-[#7ea2d4] hover:underline">Barcha {cat.name.toLowerCase()} kurslarini ko&apos;rish →</Link></p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((l) => (
                  <Link
                    key={l.slug}
                    href={`/kurslar/${cat.slug}/${l.slug}`}
                    className="group block bg-white rounded-[14px] border border-[#e4e7ea] hover:border-[#16181a]/20 hover:shadow-md transition-all p-5"
                  >
                    <div className="text-[12px] text-[#7c8490] font-medium uppercase tracking-wide mb-1.5">
                      {l.format === "Online" ? "Onlayn" : l.format === "Offline" ? "Oflayn" : l.format}
                    </div>
                    <h3 className="text-[16px] font-semibold text-[#16181a] leading-snug mb-3">
                      {l.title}
                    </h3>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="text-[#16181a]/70">{l.region ?? "Toshkent"}</span>
                      <span className="font-semibold text-[#16181a]">
                        {l.priceFree ? "Bepul" : `${l.price} so'm`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-4">
              Tez-tez beriladigan savollar
            </h2>
            <FaqList items={faqs} />
          </section>

          {/* Tegishli yo'nalishlar */}
          {mod.siblings.length > 0 && (
            <section className="mb-12">
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-4">
                Tegishli yo&apos;nalishlar
              </h2>
              <div className="flex flex-wrap gap-2">
                {mod.siblings.map((s) =>
                  MODIFIERS[s] ? (
                    <Link
                      key={s}
                      href={`/kurslar/${cat.slug}/t/${s}`}
                      className="inline-flex items-center bg-[#f2f4f5] hover:bg-[#e4e7ea] text-[#16181a] rounded-[10px] px-4 py-2 text-[14px] font-medium transition-colors"
                    >
                      {MODIFIERS[s].label} {cat.name.toLowerCase()}
                    </Link>
                  ) : null,
                )}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="border-t border-[#e4e7ea] pt-10">
            <Link
              href={`/kurslar/${cat.slug}`}
              className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
            >
              Barcha {cat.name.toLowerCase()} kurslarini ko&apos;rish
              <span aria-hidden>→</span>
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}
