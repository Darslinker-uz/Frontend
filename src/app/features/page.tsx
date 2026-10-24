import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, CalendarDays, Headset, ShieldCheck, HeartHandshake, ClipboardCheck, Code2, GraduationCap, KanbanSquare, Languages, LayoutDashboard, MousePointerClick, Palette, Send, Sparkles, Store, Trophy, User, Users, Wallet, type LucideIcon } from "lucide-react";
import { CrmApplyButton } from "@/components/crm/crm-apply";
import { FaqList } from "@/components/faq-item";
import { PLANS } from "@/lib/crm-content";
import { SHARE_OG, SHARE_TWITTER } from "@/lib/share-meta";

// /features — imkoniyatlar hub'i: "o'quv markazi boshqaruv tizimi imkoniyatlari" (docs/crm-pages-keywords.md).
// Tuzilma: hero (CTA + rasm) → farqlar (3 ta) → imkoniyatlar 4 guruhda → kimlar uchun (#kimlar-uchun,
// /for/* breadcrumb'i shu yerga) → tarif → FAQ → CTA. Kartaning o'zi havola ("Batafsil" yozuvi yo'q).

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const PATH = "/features";
const TITLE = "O'quv markazi uchun CRM va LMS imkoniyatlari — Darslinker";
const DESCRIPTION =
  "Darslinker imkoniyatlari: davomat, to'lov va qarzdorlik, jonli quiz, ota-onaga Telegram xabar, lidlar va hisobotlar. Barchasi har bir tarifda.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["CRM va LMS imkoniyatlari", "o'quv markazi boshqaruv tizimi imkoniyatlari", "o'quv markazini boshqarish dasturi", "o'quv markazi boshqaruv tizimi", "o'quv markazi uchun dastur"],
  alternates: { canonical: PATH },
  openGraph: { ...SHARE_OG, title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { ...SHARE_TWITTER, title: TITLE, description: DESCRIPTION },
};

type Item = { href: string; Icon: LucideIcon; title: string; text: string };

// Darslinker'ni ajratib turadigan 3 imkoniyat (faqat tasdiqlangan faktlar; raqobatchilar haqida da'vo yo'q).
const HIGHLIGHTS: Item[] = [
  { href: "/features/live-quiz", Icon: Trophy, title: "Darsda jonli quiz", text: "O'quvchilar telefondan PIN bilan qo'shiladi, savollarga vaqt ichida javob beradi, reyting jonli yangilanadi. Dars o'yinga aylanadi va o'quvchi qiziqib qatnaydi." },
  { href: "/features/parents", Icon: Send, title: "Ota-onaga xabar va nazorat", text: "Farzandi darsga kelmasa, qarz paydo bo'lsa yoki to'lov qabul qilinsa, ota-ona avtomatik xabar oladi va farzandini o'zi kuzatadi. SMS kerak emas." },
  { href: "/features/leads", Icon: KanbanSquare, title: "Yangi o'quvchilar oqimi", text: "Lidlar Kanban doskada kuzatiladi. Bundan tashqari Darslinker marketplace'da kurs qidirayotgan o'quvchilar markazingizga ariza qoldiradi." },
];

const GROUPS: { title: string; text: string; items: Item[] }[] = [
  {
    title: "Kundalik boshqaruv",
    text: "Markazning har kungi ishi: kim qaysi guruhda o'qiydi, qachon darsi bor va kim kelmadi. Bir nechta filial bo'lsa, ular ham shu tizimda.",
    items: [
      { href: "/features/students", Icon: Users, title: "O'quvchilar bazasi", text: "Har o'quvchining holati, davomati, to'lovlari va quiz natijalari bitta profilda." },
      { href: "/features/attendance", Icon: ClipboardCheck, title: "Davomat", text: "O'qituvchi davomatni darsda telefondan belgilaydi, ilova o'rnatish shart emas." },
      { href: "/features/schedule", Icon: CalendarDays, title: "Dars jadvali va guruhlar", text: "Xona yoki o'qituvchi band bo'lsa, tizim darhol ogohlantiradi." },
      { href: "/features/branches", Icon: Building2, title: "Filiallar", text: "Bir nechta filial alohida dasturlarsiz, bitta tizimda." },
    ],
  },
  {
    title: "To'lov va hisobotlar",
    text: "Kim qancha to'lagani va kimning qarzi borligi doim ko'rinib turadi. Rahbar markaz holatini bitta ekranda ko'radi.",
    items: [
      { href: "/features/payments", Icon: Wallet, title: "To'lov va qarzdorlik", text: "To'lov chek bilan qayd etiladi, qarz esa o'zi hisoblanadi." },
      { href: "/features/reports", Icon: LayoutDashboard, title: "Hisobotlar", text: "Dashboard'da 8 ta asosiy ko'rsatkich: faol o'quvchilardan qarzdorlargacha." },
    ],
  },
  {
    title: "O'quvchi va ota-ona bilan aloqa",
    text: "O'quvchini markazda ushlab qolish uchun dars qiziqarli, ota-ona esa xabardor bo'lishi kerak.",
    items: [
      { href: "/features/lms", Icon: GraduationCap, title: "LMS: o'quv jarayoni", text: "Quiz natijalari profilda, CRM bilan bitta tizimda." },
      { href: "/features/live-quiz", Icon: Trophy, title: "Jonli quiz", text: "Darsda o'yin shaklidagi savol-javob va jonli reyting." },
      { href: "/features/parents", Icon: HeartHandshake, title: "Ota-onalar uchun", text: "Avtomatik xabarlar va farzandning davomati hamda to'lovlarini kuzatish." },
      { href: "/features/telegram", Icon: Send, title: "Telegram mini ilova", text: "Darslinker Telegram ichida, alohida ilova o'rnatmasdan." },
    ],
  },
  {
    title: "O'sish va sozlash",
    text: "Yangi o'quvchilarni yo'qotmaslik va tizimni markazingizga moslash.",
    items: [
      { href: "/features/leads", Icon: KanbanSquare, title: "Lidlar va arizalar", text: "Har bir murojaat Kanban doskada, lid bir bosishda o'quvchiga aylanadi." },
      { href: "/features/easy-to-use", Icon: MousePointerClick, title: "Oson boshqaruv", text: "Har xodim faqat o'z bo'limini ko'radi, ro'yxat Excel'dan ko'chiriladi." },
      { href: "/features/customization", Icon: Palette, title: "Markazga moslash", text: "Logotip, dashboard ranglari, xabar matnlari va rollar." },
      { href: "/features/security", Icon: ShieldCheck, title: "Xavfsizlik", text: "Kunlik zaxira nusxa, shifrlangan ulanish, ma'lumot sizniki." },
      { href: "/features/support", Icon: Headset, title: "Support va sozlash", text: "Birgalikda o'rnatamiz, to'liq sozlaymiz, o'rgatamiz. 7 kun, 10:00–20:00." },
    ],
  },
];

const AUDIENCES: Item[] = [
  { href: "/for/language-centers", Icon: Languages, title: "Til markazlari", text: "Ingliz, rus va boshqa til kurslari." },
  { href: "/for/exam-prep", Icon: GraduationCap, title: "Abituriyent markazlari", text: "Imtihonga tayyorlov guruhlari." },
  { href: "/for/it-schools", Icon: Code2, title: "IT akademiyalar", text: "Dasturlash va IT kurslari." },
  { href: "/for/kids-centers", Icon: Sparkles, title: "Bolalar markazlari", text: "Bolalar kurslari va ota-ona bilan aloqa." },
  { href: "/for/small-centers", Icon: Store, title: "Kichik markazlar", text: "Endi boshlayotgan va kichik markazlar." },
  { href: "/for/tutors", Icon: User, title: "Repetitorlar", text: "Shaxsiy o'quvchilar bilan ishlaydiganlar." },
];

const FAQS = [
    { q: "O'zbekistonda o'quv markazini boshqarish uchun qaysi CRM'da davomat, to'lov, lidlar va hisobotlar bir joyda bor?", a: "Bularning hammasi Darslinker'da bor. Bu O'zbekistondagi o'quv markazlari uchun CRM va LMS: davomat, to'lov va qarzdorlik, lidlar va hisobotlar bitta tizimda yuritiladi. Bundan tashqari ota-onaga Telegram xabar va darsda jonli quiz bor. Barcha imkoniyatlar har bir tarifda." },
  {
    q: "O'quv markazini boshqarish uchun qanday dastur kerak?",
    a: "O'quv markaziga o'quvchilar, guruhlar, davomat, to'lov va qarzdorlikni bir joyda yuritadigan CRM kerak. Darslinker bularga qo'shimcha ravishda jonli quiz va ota-onaga Telegram xabarlarini beradi, shuning uchun u CRM va LMS vazifasini birga bajaradi.",
  },
  {
    q: "Darslinker'da qaysi imkoniyatlar bor?",
    a: "O'quvchilar bazasi, davomat, dars jadvali va guruhlar, filiallar, to'lov va qarzdorlik, hisobotlar, jonli quiz, ota-onaga Telegram xabar va farzandni kuzatish, Telegram mini ilova, lidlar, Excel import, rollar va markazga moslash (logotip, ranglar, xabar matnlari).",
  },
  {
    q: "Darslinker boshqa CRM'lardan nimasi bilan farq qiladi?",
    a: "Darslinker faqat hisob yuritish bilan cheklanmaydi: darsda jonli quiz va ota-onaga Telegram xabarlari o'quvchini markazda ushlab qolishga yordam beradi. Darslinker marketplace orqali esa markazga yangi o'quvchilardan arizalar keladi.",
  },
  {
    q: "Imkoniyatlar tarifga qarab cheklanadimi?",
    a: `Yo'q. Barcha imkoniyatlar har bir tarifda bor. Tariflar faqat o'quvchilar, filiallar va xodimlar soni bilan farq qiladi va oyiga ${PLANS[0].price} so'mdan boshlanadi.`,
  },
  {
    q: "Darslinker CRM'mi yoki LMS'mi?",
    a: "Ikkalasi ham. CRM qismi o'quvchilar, to'lov va lidlarni boshqaradi, LMS qismi esa jonli quiz va natijalar orqali o'quv jarayonini qo'llab-quvvatlaydi.",
  },
  {
    q: "Imkoniyatlarni sinab ko'rsa bo'ladimi?",
    a: "Ha. Istalgan tarifni 14 kun bepul sinab ko'rasiz, karta talab qilinmaydi. Sinov davomida barcha imkoniyatlar ochiq.",
  },
];

const ALL_ITEMS = [...GROUPS.flatMap((g) => g.items), ...AUDIENCES];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "name": TITLE,
      "description": DESCRIPTION,
      "url": `${SITE_URL}${PATH}`,
      "inLanguage": "uz",
      "isPartOf": { "@id": `${SITE_URL}/#website` },
      "about": { "@id": `${SITE_URL}/#organization` },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": ALL_ITEMS.map((f, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": f.title,
          "url": `${SITE_URL}${f.href}`,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Imkoniyatlar", "item": `${SITE_URL}${PATH}` },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQS.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
    },
  ],
};

const SECTION = "max-w-[1600px] mx-auto px-5 md:px-20";
const H2 = "text-[28px] md:text-[40px] font-bold tracking-[-0.035em] leading-[1.1] text-[#16181a]";

// Ixcham karta: butun karta havola; mobilda ikonka va sarlavha bir qatorda.
function Card({ href, Icon, title, text }: Item) {
  return (
    <Link href={href} className="group flex h-full gap-4 rounded-[20px] bg-white p-5 ring-1 ring-[#e4e7ea] transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(22,24,26,0.35)] md:p-6">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#e6ebf2]">
        <Icon aria-hidden="true" className="h-5 w-5 text-[#2d5a8a]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <h3 className="text-[17px] font-bold leading-snug tracking-[-0.02em] md:text-[18px]">{title}</h3>
          <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#2d5a8a] transition-transform group-hover:translate-x-0.5" />
        </span>
        <span className="mt-1 block text-[14px] leading-relaxed text-[#5d6672] md:text-[15px]">{text}</span>
      </span>
    </Link>
  );
}

export default function FeaturesPage() {
  return (
    <div className="bg-[#f0f2f3] min-h-screen text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className={`${SECTION} pt-10 pb-12 md:pt-14 md:pb-16`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="text-[14px] font-semibold text-[#5b87c0] md:text-[16px]">Darslinker imkoniyatlari</p>
            <h1 className="mt-3 text-[40px] font-bold leading-[1.02] tracking-[-0.04em] md:text-[56px] xl:text-[64px]">
              O&apos;quv markazi uchun CRM va LMS imkoniyatlari
            </h1>
            <p className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
              Darslinker o&apos;quv markazining kundalik ishini bitta tizimga yig&apos;adi:
              o&apos;quvchilar, davomat, to&apos;lov va qarzdorlik, ota-ona bilan aloqa va darsdagi jonli quiz.
              Barcha imkoniyatlar har bir tarifda bor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CrmApplyButton
                refSource="features"
                className="group relative inline-flex h-[56px] items-center justify-center rounded-full bg-[#2d5a8a] px-[60px] text-[16px] font-semibold text-white transition-colors hover:bg-[#244c76] sm:justify-start sm:pl-7"
              >
                Bepul sinab ko&apos;rish
                <span className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#2d5a8a] transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </CrmApplyButton>
              <Link
                href="/pricing"
                className="inline-flex h-[56px] items-center justify-center rounded-full bg-white px-6 text-[16px] font-semibold text-[#16181a] ring-1 ring-[#e4e7ea] transition-colors hover:bg-[#f7f8f9]"
              >
                Tariflar
              </Link>
            </div>
          </div>
          <div className="mx-auto hidden w-full max-w-[460px] lg:block">
            <Image
              src="/images/hero/crm-hero-transparent-v2.png"
              alt="Darslinker CRM bo'limlari: o'quvchilar, lidlar, guruhlar, to'lovlar, davomat, dashboard va gamifikatsiya"
              width={1254}
              height={1254}
              sizes="460px"
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* FARQLAR */}
      <section className={`${SECTION} pb-14 md:pb-20`}>
        <h2 className={`${H2} max-w-[820px]`}>Darslinker&apos;ni nima ajratib turadi?</h2>
        <p className="mt-4 max-w-[760px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
          Darslinker faqat hisob yuritish bilan cheklanmaydi. U o&apos;quvchini markazda ushlab qolishga va markazga
          yangi o&apos;quvchilar olib kelishga ham yordam beradi.
        </p>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {HIGHLIGHTS.map(({ href, Icon, title, text }) => (
            <li key={href}>
              <Link href={href} className="group flex h-full flex-col rounded-[24px] bg-[#2d5a8a] p-7 text-white transition-colors hover:bg-[#244c76]">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/15">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-[22px] font-bold tracking-[-0.02em]">{title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-white/75">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold">
                  {title} haqida <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* IMKONIYATLAR — guruhlab */}
      <section className="bg-[#e8eaed] py-14 md:py-20">
        <div className={SECTION}>
          <h2 className={H2}>Barcha imkoniyatlar</h2>
          <div className="mt-10 space-y-10 md:space-y-14">
            {GROUPS.map((g) => (
              <div key={g.title} className="grid gap-5 lg:grid-cols-[0.8fr_1.6fr] lg:gap-10">
                <div>
                  <h3 className="text-[22px] font-bold tracking-[-0.03em] md:text-[26px]">{g.title}</h3>
                  <p className="mt-2 max-w-[420px] text-[15px] leading-relaxed text-[#5d6672] md:text-[16px]">{g.text}</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {/* Toq sonli guruhda oxirgi karta to'liq kenglikda — qatorda bo'sh joy qolmasin. */}
                  {g.items.map((it, i) => (
                    <li key={it.href} className={g.items.length % 2 && i === g.items.length - 1 ? "sm:col-span-2" : ""}><Card {...it} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KIMLAR UCHUN */}
      <section id="kimlar-uchun" className={`${SECTION} scroll-mt-24 py-14 md:py-20`}>
        <h2 className={H2}>Kimlar uchun</h2>
        <p className="mt-4 max-w-[720px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">
          Darslinker turli yo&apos;nalishdagi o&apos;quv markazlari va repetitorlar uchun. Har biri uchun eng kerakli
          imkoniyatlarni alohida tushuntirdik.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {AUDIENCES.map((it) => (
            <li key={it.href}><Card {...it} /></li>
          ))}
        </ul>
      </section>

      {/* TARIF */}
      <section className={`${SECTION} pb-14 md:pb-20`}>
        <div className="grid gap-6 rounded-[28px] bg-white p-7 ring-1 ring-[#e4e7ea] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="text-[24px] font-bold tracking-[-0.03em] md:text-[32px]">Barcha imkoniyatlar har bir tarifda</h2>
            <p className="mt-3 max-w-[720px] text-[15px] leading-relaxed text-[#5d6672] md:text-[17px]">
              Tariflar faqat o&apos;quvchilar, filiallar va xodimlar soni bilan farq qiladi. Narxlar oyiga{" "}
              {PLANS[0].price}{" "}so&apos;mdan boshlanadi, 14 kun bepul sinov bor.
            </p>
          </div>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#2d5a8a] hover:underline">
            Tariflar va narxlar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${SECTION} pb-14 md:pb-20`}>
        <div className="rounded-[20px] border border-[#e4e7ea] bg-white p-6 md:p-10">
          <h2 className="text-[24px] font-bold tracking-[-0.03em] md:text-[32px]">Ko&apos;p so&apos;raladigan savollar</h2>
          <div className="mt-6">
            <FaqList items={FAQS} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${SECTION} pb-16 md:pb-24`}>
        <div className="grid items-center gap-8 overflow-hidden rounded-[24px] bg-[#1e2024] p-8 text-white md:grid-cols-[1fr_auto] md:p-14">
          <div>
            <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em] md:text-[40px]">Markazingizni bitta tizimga o&apos;tkazing</h2>
            <p className="mt-3 max-w-[520px] text-[15px] text-white/60 md:text-[17px]">14 kun bepul sinov, karta kerak emas. O&apos;quvchilar ro&apos;yxatini Excel&apos;dan ko&apos;chirib, birinchi kundan ishlaysiz.</p>
          </div>
          <CrmApplyButton refSource="features" className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[14px] bg-white px-8 text-[16px] font-semibold text-[#16181a] transition-colors hover:bg-white/90">
            Bepul sinab ko&apos;rish <ArrowRight className="h-4 w-4" />
          </CrmApplyButton>
        </div>
      </section>
    </div>
  );
}
