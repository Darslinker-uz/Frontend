import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/faq-item";
import { getActiveListings, getActiveCategories } from "@/lib/listings";
import { findRegionBySlugDb, getActiveRegions } from "@/lib/regions";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

interface Props {
  params: Promise<{ hudud: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hudud } = await params;
  const region = await findRegionBySlugDb(hudud);
  if (!region) return { title: "Sahifa topilmadi" };

  const url = `${SITE_URL}/joylar/${hudud}`;
  const title = `${region.name}dagi o'quv markazlari va kurslar — Darslinker`;
  const description = `${region.name}dagi barcha o'quv markazlari va kurslar bir joyda. Tillar, IT, akademik va kasbiy yo'nalishlar bo'yicha narxlarni qiyoslang.`;

  return {
    title,
    description,
    keywords: [
      `${region.name} o'quv markazlari`,
      `${region.name} kurslari`,
      `${region.name}dagi kurslar`,
    ],
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "uz_UZ", url, siteName: "Darslinker.uz", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function JoylarHududPage({ params }: Props) {
  const { hudud } = await params;
  const region = await findRegionBySlugDb(hudud);
  if (!region) notFound();

  const [allInRegion, categories, allRegions] = await Promise.all([
    getActiveListings({ region: region.name, includeRemote: false }),
    getActiveCategories(),
    getActiveRegions(),
  ]);

  const listings = allInRegion.slice(0, 12);

  // Kategoriya bo'yicha hisob
  const categoryCounts = allInRegion.reduce<Record<string, number>>((acc, c) => {
    acc[c.categorySlug] = (acc[c.categorySlug] ?? 0) + 1;
    return acc;
  }, {});
  const popularCategories = categories
    .filter((c) => categoryCounts[c.slug] > 0)
    .map((c) => ({ name: c.name, slug: c.slug, count: categoryCounts[c.slug] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Format bo'yicha hisob
  const onlineCount = allInRegion.filter((l) => l.format === "Online").length;
  const offlineCount = allInRegion.filter((l) => l.format === "Offline").length;

  // Boshqa hududlar (kurs ko'p bo'lganlar)
  const otherRegionsCounts = (await getActiveListings({ includeRemote: false })).reduce<Record<string, number>>(
    (acc, l) => {
      if (l.region) acc[l.region] = (acc[l.region] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const otherRegions = allRegions
    .filter((r) => r.slug !== region.slug)
    .map((r) => ({ ...r, count: otherRegionsCounts[r.name] ?? 0 }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const url = `${SITE_URL}/joylar/${hudud}`;

  const faqs = [
    { q: `${region.name}da qancha o'quv markaz bor?`, a: `Hozirda Darslinker katalogida ${region.name} bo'yicha ${allInRegion.length} ta aktiv kurs joylashtirilgan.` },
    { q: `${region.name}da qaysi yo'nalishlar mashhur?`, a: popularCategories.length > 0 ? `${region.name}da eng mashhur yo'nalishlar: ${popularCategories.slice(0, 3).map((c) => c.name).join(", ")}.` : `${region.name}da turli yo'nalishlar mavjud.` },
    { q: `${region.name}dan boshqa hududlarga onlayn qatnashish mumkinmi?`, a: `Ha. Aksariyat o'quv markazlar onlayn formatda ham ishlaydi va istalgan hududdan qatnashish mumkin.` },
    { q: `${region.name}dagi kurslar narxi qancha?`, a: `Narxlar yo'nalish va o'quv markaziga qarab farq qiladi. Har kurs sahifasida aniq narx ko'rsatilgan.` },
    { q: `${region.name}da bolalar uchun kurs bormi?`, a: `Ha, ${region.name}da bolalar va o'smirlar uchun maxsus kurslar bor — tillar, dasturlash va boshqa yo'nalishlar bo'yicha.` },
    { q: `${region.name}dagi kursga qanday yozilish mumkin?`, a: `Har kurs sahifasida o'quv markazning telefon raqami ko'rsatilgan. To'g'ridan-to'g'ri ariza qoldirishingiz yoki qo'ng'iroq qilishingiz mumkin.` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Place", name: region.name, url, containedInPlace: { "@type": "Country", name: "O'zbekiston" } },
      { "@type": "ItemList", name: `${region.name}dagi kurslar`, itemListElement: listings.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: l.title, url: `${SITE_URL}/kurslar/${l.categorySlug}/${l.slug}` })) },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="bg-[#f0f2f3] min-h-screen">
        {/* HERO — gradient background */}
        <section className="bg-gradient-to-br from-[#16181a] via-[#1f2226] to-[#2a2f36] text-white">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-10 md:py-16">
            <nav className="text-[13px] text-white/60 mb-5">
              <Link href="/" className="hover:text-white">Asosiy</Link>
              <span className="mx-2">›</span>
              <Link href="/joylar" className="hover:text-white">Joylar</Link>
              <span className="mx-2">›</span>
              <span className="text-white">{region.name}</span>
            </nav>

            <h1 className="text-[32px] md:text-[48px] font-bold leading-tight tracking-tight">
              {region.name}dagi o&apos;quv markazlari
            </h1>
            <p className="mt-4 text-[15.5px] md:text-[18px] text-white/75 leading-relaxed max-w-[720px]">
              {region.name}dagi barcha aktiv o&apos;quv markazlari va kurslar Darslinker katalogida bir joyda. Narx, format va metodika bo&apos;yicha qiyoslang.
            </p>

            {/* STATS */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-[14px] p-4 border border-white/10">
                <div className="text-[28px] md:text-[34px] font-bold">{allInRegion.length}</div>
                <div className="text-[12px] text-white/70 uppercase tracking-wide mt-1">Aktiv kurslar</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-[14px] p-4 border border-white/10">
                <div className="text-[28px] md:text-[34px] font-bold">{popularCategories.length}</div>
                <div className="text-[12px] text-white/70 uppercase tracking-wide mt-1">Yo&apos;nalishlar</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-[14px] p-4 border border-white/10">
                <div className="text-[28px] md:text-[34px] font-bold">{onlineCount}</div>
                <div className="text-[12px] text-white/70 uppercase tracking-wide mt-1">Onlayn kurs</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-[14px] p-4 border border-white/10">
                <div className="text-[28px] md:text-[34px] font-bold">{offlineCount}</div>
                <div className="text-[12px] text-white/70 uppercase tracking-wide mt-1">Oflayn kurs</div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES — white section */}
        {popularCategories.length > 0 && (
          <section className="bg-white border-b border-[#e4e7ea]">
            <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-10">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-[22px] md:text-[28px] font-bold text-[#16181a]">
                    Mashhur yo&apos;nalishlar
                  </h2>
                  <p className="text-[14px] text-[#7c8490] mt-1">{region.name}dagi eng ko&apos;p qidiriladigan kurslar</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {popularCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/kurslar/${c.slug}/joy/${region.slug}`}
                    className="group bg-[#f8f9fa] hover:bg-[#16181a] rounded-[14px] p-5 transition-colors"
                  >
                    <div className="text-[16px] font-semibold text-[#16181a] group-hover:text-white mb-2 leading-snug">
                      {c.name}
                    </div>
                    <div className="text-[13px] text-[#7c8490] group-hover:text-white/70">
                      {c.count} ta kurs
                    </div>
                    <div className="mt-3 text-[12px] font-semibold text-[#7ea2d4] group-hover:text-white">
                      Ko&apos;rish →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* COURSE LISTINGS — gray section */}
        <section className="bg-[#f0f2f3]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-10">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-[22px] md:text-[28px] font-bold text-[#16181a]">
                  {region.name}dagi kurslar
                </h2>
                <p className="text-[14px] text-[#7c8490] mt-1">{listings.length} ta kurs ko&apos;rsatilmoqda</p>
              </div>
              <Link
                href={`/kurslar?region=${encodeURIComponent(region.name)}`}
                className="hidden md:inline-flex text-[14px] font-semibold text-[#16181a] hover:underline"
              >
                Hammasini ko&apos;rish →
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="bg-white rounded-[14px] p-10 text-center border-2 border-dashed border-[#e4e7ea]">
                <p className="text-[15px] text-[#7c8490]">Bu hudud bo&apos;yicha hozircha aktiv kurslar yo&apos;q.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((l) => {
                  const formatBadge = l.format === "Online" ? "Onlayn" : l.format === "Offline" ? "Oflayn" : l.format;
                  const formatColor = l.format === "Online" ? "bg-green-100 text-green-800" : l.format === "Offline" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
                  return (
                    <Link
                      key={l.slug}
                      href={`/kurslar/${l.categorySlug}/${l.slug}`}
                      className="group block bg-white rounded-[16px] hover:shadow-lg transition-all p-5 border border-[#e4e7ea]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 ${formatColor}`}>
                          {formatBadge}
                        </span>
                        <span className="text-[11px] text-[#7c8490] uppercase tracking-wide">
                          {l.category}
                        </span>
                      </div>
                      <h3 className="text-[17px] font-semibold text-[#16181a] leading-snug mb-3 line-clamp-2 min-h-[44px]">
                        {l.title}
                      </h3>
                      <div className="flex items-center justify-between pt-3 border-t border-[#f0f2f3]">
                        <span className="text-[13px] text-[#7c8490]">
                          {l.district ?? l.region ?? region.name}
                        </span>
                        <span className="text-[14px] font-bold text-[#16181a]">
                          {l.priceFree ? "Bepul" : `${l.price} so'm`}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* CTA inline */}
            {allInRegion.length > 12 && (
              <div className="mt-8 text-center">
                <Link
                  href={`/kurslar?region=${encodeURIComponent(region.name)}`}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#16181a] hover:text-white text-[#16181a] border border-[#16181a] rounded-[12px] px-6 py-3 text-[14px] font-semibold transition-colors"
                >
                  {region.name} bo&apos;yicha barcha {allInRegion.length} ta kursni ko&apos;rish →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* FAQ — white section */}
        <section className="bg-white border-y border-[#e4e7ea]">
          <div className="max-w-[860px] mx-auto px-5 md:px-6 py-10">
            <h2 className="text-[22px] md:text-[28px] font-bold text-[#16181a] mb-2">
              Tez-tez beriladigan savollar
            </h2>
            <p className="text-[14px] text-[#7c8490] mb-6">{region.name} bo&apos;yicha kurslar haqida</p>
            <FaqList items={faqs} />
          </div>
        </section>

        {/* OTHER REGIONS — gray section */}
        {otherRegions.length > 0 && (
          <section className="bg-[#f0f2f3]">
            <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-10">
              <h2 className="text-[22px] md:text-[28px] font-bold text-[#16181a] mb-2">
                Boshqa hududlar
              </h2>
              <p className="text-[14px] text-[#7c8490] mb-6">Boshqa hududdagi kurslarni ham ko&apos;rib chiqing</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {otherRegions.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/joylar/${r.slug}`}
                    className="group block bg-white hover:bg-[#16181a] rounded-[12px] p-4 transition-colors"
                  >
                    <div className="text-[15px] font-semibold text-[#16181a] group-hover:text-white">
                      {r.name}
                    </div>
                    <div className="text-[12px] text-[#7c8490] group-hover:text-white/70 mt-0.5">
                      {r.count} ta kurs
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FINAL CTA — dark band */}
        <section className="bg-[#16181a] text-white">
          <div className="max-w-[860px] mx-auto px-5 md:px-6 py-12 text-center">
            <h2 className="text-[24px] md:text-[32px] font-bold mb-3">
              {region.name}dagi mukammal kursni toping
            </h2>
            <p className="text-[15px] text-white/70 mb-6 max-w-[600px] mx-auto">
              Filtrlash, narx solishtirish va sertifikat shartlarini bir oynada ko&apos;ring.
            </p>
            <Link
              href={`/kurslar?region=${encodeURIComponent(region.name)}`}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#7ea2d4] text-[#16181a] hover:text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
            >
              {region.name} kurslarini ko&apos;rish
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
