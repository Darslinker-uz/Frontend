import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Home, MapPin, Star, ShieldCheck, BookOpen, Award, Calendar, Phone, Send, Building2, Wifi, GraduationCap } from "lucide-react";
import { FAKE_CENTERS, findFakeCenterBySlug, generateFakeCoursesForCenter } from "@/data/fake-centers";
import { getCenterBySlug, getRelatedCenters } from "@/lib/centers";
import { MarkazLeadForm } from "./markaz-lead-form";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

interface Props {
  params: Promise<{ slug: string }>;
}

// Unified loader: avval real DB'dan, keyin fake'lardan qidiradi
async function loadCenter(slug: string) {
  // 1. Real DB
  const real = await getCenterBySlug(slug);
  if (real) {
    return {
      provider: real.provider,
      slug: real.slug,
      description: real.description ?? "",
      categories: real.categories,
      regions: real.regions,
      avgRating: real.avgRating,
      ratingCount: real.ratingCount,
      courseCount: real.courseCount,
      imageUrl: real.imageUrl,
      gradient: real.gradient,
      certificate: real.certificate,
      phone: real.phone,
      telegram: real.telegram,
      instagram: real.instagram,
      website: real.website,
      foundedYear: real.foundedYear,
      courses: real.courses.map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        category: c.category,
        categorySlug: c.categorySlug,
        format: c.format,
        duration: c.duration,
        price: c.price,
        level: c.level,
      })),
      // Lead form uchun — birinchi aktiv kurs ID si
      firstListingId: real.courses[0]?.id ?? null,
      isReal: true as const,
      centerId: real.id,
    };
  }
  // 2. Fake fallback (demo)
  const fake = findFakeCenterBySlug(slug);
  if (fake) {
    return {
      provider: fake.provider,
      slug: fake.slug,
      description: fake.description,
      categories: fake.categories,
      regions: fake.regions,
      avgRating: fake.avgRating,
      ratingCount: fake.ratingCount,
      courseCount: fake.courseCount,
      imageUrl: fake.imageUrl,
      gradient: fake.gradient,
      certificate: fake.certificate,
      phone: fake.phone,
      telegram: fake.telegram ?? null,
      instagram: fake.instagram ?? null,
      website: fake.website ?? null,
      foundedYear: fake.foundedYear,
      courses: generateFakeCoursesForCenter(fake).map(c => ({
        id: 0, // fake — DB'da yo'q
        slug: c.slug,
        title: c.title,
        category: c.category,
        categorySlug: "", // fake — link beriladigan kategoriya slug yo'q
        format: c.format,
        duration: c.duration,
        price: c.price,
        level: c.level,
      })),
      firstListingId: null, // fake markazda real listing yo'q → form simulate qiladi
      isReal: false as const,
      centerId: null,
    };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const center = await loadCenter(slug);
  if (!center) {
    return {
      title: "Markaz topilmadi",
      robots: { index: false, follow: false },
    };
  }
  const regionList = center.regions.join(", ");
  const title = `${center.provider}${regionList ? ` — ${regionList}` : ""} | O'quv markaz`;
  const bioSnippet = (center.description ?? "").trim().slice(0, 130);
  const catList = center.categories.slice(0, 4).join(", ");
  const fallback = `${center.provider} — ${catList || "ta'lim"} yo'nalishida ${center.courseCount} ta kurs${regionList ? ` (${regionList})` : ""}. Narxlar, jadval va bog'lanish — Darslinker'da.`;
  const description = bioSnippet ? `${center.provider} o'quv markazi: ${bioSnippet}` : fallback;
  return {
    title,
    description,
    keywords: [
      center.provider,
      `${center.provider} kurslar`,
      `${center.provider} kontakt`,
      ...center.categories.map(c => `${c} markaz`),
      ...center.regions.map(r => `o'quv markaz ${r.toLowerCase()}`),
    ],
    alternates: { canonical: `${SITE_URL}/oquv-markazlar/${center.slug}` },
    openGraph: {
      type: "website",
      locale: "uz_UZ",
      url: `${SITE_URL}/oquv-markazlar/${center.slug}`,
      siteName: "Darslinker.uz",
      title,
      description,
      images: [center.imageUrl ?? "/og-image.png?v=4"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [center.imageUrl ?? "/og-image.png?v=4"],
    },
  };
}

export default async function MarkazPage({ params }: Props) {
  const { slug } = await params;
  const center = await loadCenter(slug);
  if (!center) {
    notFound();
  }

  const courses = center.courses;
  const initial = center.provider.charAt(0).toUpperCase();
  const rating = center.avgRating > 0 ? center.avgRating.toFixed(1) : null;

  // Boshqa markazlar — real yoki fake
  let otherCenters: Array<{ slug: string; provider: string; gradient: string; avgRating: number; ratingCount: number; }> = [];
  if (center.isReal && center.centerId) {
    const related = await getRelatedCenters(center.centerId, center.categories, 3);
    otherCenters = related.map(c => ({
      slug: c.slug,
      provider: c.provider,
      gradient: c.gradient,
      avgRating: c.avgRating,
      ratingCount: c.ratingCount,
    }));
  }
  if (otherCenters.length < 3) {
    // Fake'lardan to'ldirish
    const need = 3 - otherCenters.length;
    const existing = new Set(otherCenters.map(o => o.slug));
    const fakeRelated = FAKE_CENTERS
      .filter(c => c.slug !== center.slug && !existing.has(c.slug))
      .filter(c => c.categories.some(cat => center.categories.includes(cat)))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, need);
    otherCenters = [
      ...otherCenters,
      ...fakeRelated.map(c => ({
        slug: c.slug,
        provider: c.provider,
        gradient: c.gradient,
        avgRating: c.avgRating,
        ratingCount: c.ratingCount,
      })),
    ];
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Asosiy", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "O'quv markazlar", "item": `${SITE_URL}/oquv-markazlar` },
      { "@type": "ListItem", "position": 3, "name": center.provider, "item": `${SITE_URL}/oquv-markazlar/${center.slug}` },
    ],
  };

  // EDUCATIONAL ORGANIZATION + LOCAL BUSINESS (dual-type — Google Maps + edu directory)
  const orgLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${SITE_URL}/oquv-markazlar/${center.slug}#org`,
    "name": center.provider,
    "description": center.description,
    "url": `${SITE_URL}/oquv-markazlar/${center.slug}`,
    "inLanguage": "uz",
    "foundingDate": center.foundedYear.toString(),
    "telephone": center.phone,
    "areaServed": center.regions.map(r => ({
      "@type": "City",
      "name": r,
      "containedInPlace": { "@type": "Country", "name": "O'zbekiston" },
    })),
    ...(center.regions.length > 0 ? {
      "address": {
        "@type": "PostalAddress",
        "addressLocality": center.regions[0],
        "addressRegion": center.regions[0],
        "addressCountry": "UZ",
      },
    } : {}),
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": center.phone,
      "contactType": "customer service",
      "areaServed": "UZ",
      "availableLanguage": ["uz", "ru"],
    },
    "knowsAbout": center.categories,
    "knowsLanguage": ["uz", "ru"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${center.provider} kurslari`,
      "itemListElement": courses.map((c, i) => ({
        "@type": "Offer",
        "position": i + 1,
        "priceCurrency": "UZS",
        "itemOffered": {
          "@type": "Course",
          "name": c.title,
          "description": `${c.category} bo'yicha ${c.format.toLowerCase()} kurs · ${c.duration} · ${c.level}`,
          "courseMode": c.format.toLowerCase(),
          "educationalLevel": c.level,
          "provider": {
            "@type": "EducationalOrganization",
            "name": center.provider,
            "@id": `${SITE_URL}/oquv-markazlar/${center.slug}#org`,
          },
        },
      })),
    },
    ...(rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "ratingCount": center.ratingCount,
        "bestRating": 5,
        "worstRating": 1,
      },
    } : {}),
    ...(center.telegram || center.instagram || center.website ? {
      "sameAs": [
        ...(center.telegram ? [`https://t.me/${center.telegram}`] : []),
        ...(center.instagram ? [`https://instagram.com/${center.instagram}`] : []),
        ...(center.website ? [`https://${center.website}`] : []),
      ],
    } : {}),
  };

  // WEBPAGE schema — sahifa AYNAN shu markaz haqida ekanini AI'ga aniq bildiradi
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${center.provider} | O'quv markaz`,
    "url": `${SITE_URL}/oquv-markazlar/${center.slug}`,
    "inLanguage": "uz",
    "about": { "@id": `${SITE_URL}/oquv-markazlar/${center.slug}#org` },
    "isPartOf": { "@type": "WebSite", "name": "Darslinker.uz", "url": SITE_URL },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", "h3"],
    },
  };

  // AUTO-GENERATED FAQ schema — bu markaz haqida AI savol-javoblari
  // AEO uchun eng kuchli signal: ChatGPT/Gemini "X markazi haqida" so'rasa shu javoblardan oladi
  const centerFaqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/oquv-markazlar/${center.slug}#faq`,
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${center.provider} qaerda joylashgan?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": center.regions.length > 0
            ? `${center.provider} ${center.regions.join(", ")} ${center.regions.length > 1 ? "viloyatlarida" : "viloyatida"} faoliyat yuritadi. Aniq manzil va kontakt uchun markazga ${center.phone} raqami orqali bog'laning.`
            : `${center.provider} O'zbekistonda faoliyat yuritadi. Kontakt: ${center.phone}.`,
        },
      },
      {
        "@type": "Question",
        "name": `${center.provider} qanday kurslar taklif qiladi?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": center.categories.length > 0
            ? `${center.provider} ${center.categories.join(", ")} yo'nalishlarida ${center.courseCount} ta kurs taklif qiladi. To'liq ro'yxat va narxlar uchun Darslinker.uz katalogini ko'ring.`
            : `${center.provider} bir nechta yo'nalishda kurslar taklif qiladi.`,
        },
      },
      {
        "@type": "Question",
        "name": `${center.provider} ishonchli o'quv markazmi?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Ha, ${center.provider} Darslinker katalogida tekshirilgan o'quv markazlardan biridir. Markaz Darslinker admin tomonidan ko'rib chiqilgan: hujjatlar, manzil va kontakt ma'lumotlari verify qilingan.${rating ? ` O'rtacha reyting: ${rating}/5 (${center.ratingCount} sharh).` : ""}`,
        },
      },
      {
        "@type": "Question",
        "name": `${center.provider} sertifikat beradimi?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": center.certificate
            ? `Ha, ${center.provider} kurslari tugaganidan keyin rasmiy sertifikat beradi. Sertifikat CV va portfolio uchun ishlatilishi mumkin.`
            : `${center.provider} sertifikat berishi haqida aniq ma'lumot uchun markazga ${center.phone} orqali murojaat qiling.`,
        },
      },
      {
        "@type": "Question",
        "name": `${center.provider}ga qanday yozilish mumkin?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${center.provider}ga 2 yo'l bilan yozilishingiz mumkin: 1) Telefon: ${center.phone} 2) Darslinker katalogidagi profil sahifasida "Markazga ariza" formasini to'ldiring — markaz vakili 24 soat ichida bog'lanadi.`,
        },
      },
    ],
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h2", "h3"],
    },
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(centerFaqLd) }} />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-12 pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-[#7c8490] mb-5 flex-wrap">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[#16181a] transition-colors">
            <Home className="w-3.5 h-3.5" />
            Asosiy
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/oquv-markazlar" className="hover:text-[#16181a] transition-colors">O&apos;quv markazlar</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#16181a] font-medium line-clamp-1">{center.provider}</span>
        </nav>

        {/* HERO — Center info card */}
        <div className="bg-white border border-[#e4e7ea] rounded-[24px] p-6 md:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row items-start gap-5 md:gap-7">
            <div
              className="w-20 h-20 md:w-28 md:h-28 rounded-[20px] flex items-center justify-center text-white text-[36px] md:text-[48px] font-extrabold shrink-0 shadow-lg"
              style={{ background: center.gradient }}
            >
              {center.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={center.imageUrl} alt={center.provider} className="w-full h-full object-cover rounded-[20px]" />
              ) : (
                initial
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase">
                  <ShieldCheck className="w-3 h-3" />
                  Tekshirilgan
                </span>
                {center.certificate && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-100 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase">
                    <Award className="w-3 h-3" />
                    Sertifikatli
                  </span>
                )}
              </div>
              <h1 className="text-[28px] md:text-[36px] lg:text-[40px] font-extrabold text-[#16181a] tracking-[-0.03em] leading-tight">
                {center.provider}
              </h1>
              <p className="text-[14px] md:text-[16px] text-[#475569] mt-3 leading-relaxed max-w-[640px]">
                {center.description}
              </p>

              {/* Quick stats row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5">
                {rating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-[14px] font-bold text-[#16181a]">{rating}</span>
                    <span className="text-[12.5px] text-[#7c8490]">({center.ratingCount} sharh)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#7c8490]" />
                  <span className="text-[13px] text-[#16181a]"><span className="font-bold">{center.courseCount}</span> kurs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#7c8490]" />
                  <span className="text-[13px] text-[#16181a]"><span className="font-bold">{center.regions.length}</span> joy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#7c8490]" />
                  <span className="text-[13px] text-[#16181a]"><span className="font-bold">{new Date().getFullYear() - center.foundedYear}+</span> yil</span>
                </div>
              </div>

              {/* Categories */}
              {center.categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  {center.categories.map((cat) => (
                    <span key={cat} className="text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT — 2 column on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 mt-6 md:mt-8">
          {/* LEFT: Courses + Locations */}
          <div className="space-y-6 md:space-y-8 min-w-0">
            {/* Locations */}
            <section className="bg-white border border-[#e4e7ea] rounded-[20px] p-5 md:p-6">
              <h2 className="text-[18px] md:text-[20px] font-bold text-[#16181a] tracking-[-0.02em] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                Joylashuvlar
              </h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {center.regions.map((region) => (
                  <Link
                    key={region}
                    href={`/oquv-markazlar/barchasi?region=${encodeURIComponent(region)}`}
                    className="inline-flex items-center gap-1.5 bg-[#f8fbfa] border border-[#e4e7ea] hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 rounded-full px-4 py-2 text-[13px] text-[#16181a] font-medium transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {region}
                  </Link>
                ))}
              </div>
            </section>

            {/* Courses */}
            <section className="bg-white border border-[#e4e7ea] rounded-[20px] p-5 md:p-6">
              <div className="flex items-end justify-between gap-3 mb-5">
                <h2 className="text-[18px] md:text-[22px] font-bold text-[#16181a] tracking-[-0.02em]">
                  {center.provider} kurslari
                </h2>
                <span className="text-[12.5px] text-[#7c8490] shrink-0">{courses.length} ta kurs</span>
              </div>

              <div className="space-y-3">
                {courses.map((c) => {
                  const FormatIcon = c.format === "Onlayn" ? Wifi : c.format === "Oflayn" ? Building2 : GraduationCap;
                  const isLinkable = c.id > 0 && c.categorySlug;
                  const cardClass = "group flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-[16px] bg-[#f8fbfa] border border-[#e4e7ea] hover:border-emerald-300 hover:bg-white transition-all";
                  const inner = (
                    <>
                      <div className="w-11 h-11 rounded-[12px] bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">{c.category}</span>
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#16181a]/60 bg-[#f2f4f5] rounded-full px-2 py-0.5">
                            <FormatIcon className="w-2.5 h-2.5" />
                            {c.format}
                          </span>
                          <span className="text-[11px] text-[#7c8490] bg-[#f2f4f5] rounded-full px-2 py-0.5">{c.level}</span>
                        </div>
                        <h3 className="text-[14px] md:text-[15px] font-bold text-[#16181a] tracking-[-0.01em] leading-tight group-hover:text-emerald-700 transition-colors">
                          {c.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                          <span className="text-[12px] text-[#16181a]">{c.duration}</span>
                          <span className="text-[12px] font-semibold text-emerald-700">{c.price}</span>
                        </div>
                      </div>
                      {isLinkable && <ArrowRight className="w-4 h-4 text-[#7c8490] group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />}
                    </>
                  );
                  return isLinkable ? (
                    <Link key={c.slug} href={`/kurslar/${c.categorySlug}/${c.slug}`} className={cardClass}>{inner}</Link>
                  ) : (
                    <div key={c.slug} className={cardClass}>{inner}</div>
                  );
                })}
              </div>
            </section>

            {/* Other centers (related) */}
            {otherCenters.length > 0 && (
              <section>
                <h2 className="text-[18px] md:text-[22px] font-bold text-[#16181a] tracking-[-0.02em] mb-4 md:mb-5">
                  Shunga o&apos;xshash markazlar
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {otherCenters.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/oquv-markazlar/${other.slug}`}
                      className="group bg-white border border-[#e4e7ea] rounded-[16px] p-4 hover:border-emerald-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white text-[18px] font-extrabold shrink-0 shadow-sm"
                          style={{ background: other.gradient }}
                        >
                          {other.provider.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-bold text-[#16181a] truncate">{other.provider}</div>
                          {other.avgRating > 0 && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="text-[11.5px] font-semibold text-[#16181a]">{other.avgRating.toFixed(1)}</span>
                              <span className="text-[11px] text-[#7c8490]">({other.ratingCount})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR: Form + Contact */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Application form */}
            <div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-t-[20px] px-5 md:px-6 pt-5 pb-3">
                <div className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 rounded-full px-2.5 py-1 mb-3">
                  <Send className="w-3 h-3 text-emerald-700" />
                  <span className="text-[10.5px] font-bold text-emerald-800 tracking-wider uppercase">Markazga ariza</span>
                </div>
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#16181a] tracking-[-0.02em]">
                  Bog&apos;lanish uchun ariza qoldiring
                </h2>
                <p className="text-[12.5px] text-[#475569] mt-1.5">
                  <span className="font-semibold">{center.provider}</span> vakili siz bilan 24 soat ichida bog&apos;lanadi.
                </p>
              </div>
              <div className="-mt-1">
                <MarkazLeadForm centerName={center.provider} firstListingId={center.firstListingId} />
              </div>
            </div>

            {/* Quick contact (kontakt malumotlar) */}
            <div className="bg-white border border-[#e4e7ea] rounded-[20px] p-5 md:p-6">
              <h3 className="text-[14px] font-bold text-[#16181a] tracking-[-0.01em] mb-3">Kontakt ma&apos;lumotlari</h3>
              <a href={`tel:${center.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-[13px] text-[#16181a] hover:text-emerald-700 transition-colors mb-2.5">
                <div className="w-8 h-8 rounded-[10px] bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-medium">{center.phone}</span>
              </a>
              {center.telegram && (
                <a href={`https://t.me/${center.telegram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13px] text-[#16181a] hover:text-emerald-700 transition-colors mb-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                  </div>
                  <span className="font-medium">@{center.telegram}</span>
                </a>
              )}
              {center.instagram && (
                <a href={`https://instagram.com/${center.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13px] text-[#16181a] hover:text-emerald-700 transition-colors mb-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-pink-50 text-pink-700 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </div>
                  <span className="font-medium">@{center.instagram}</span>
                </a>
              )}
              {center.website && (
                <a href={`https://${center.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13px] text-[#16181a] hover:text-emerald-700 transition-colors">
                  <div className="w-8 h-8 rounded-[10px] bg-[#f2f4f5] text-[#16181a]/70 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{center.website}</span>
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
