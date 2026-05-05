import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Star, BookOpen, Award, Users, Globe, CreditCard, Gift, Calendar, GraduationCap, Wallet, Tag, Eye } from "lucide-react";
import { notFound } from "next/navigation";
import { getListingBySlug, getActiveCategories, getActiveListings, getRecentComments } from "@/lib/listings";
import { CourseLeadForm } from "@/components/course-lead-form";
import { RatingForm } from "@/components/rating-form";
import { RatingComments } from "@/components/rating-comments";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ViewTracker } from "@/components/view-tracker";
import { MIN_RATINGS_TO_SHOW } from "@/data/courses";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ kategoriya: string; slug: string }>;
};

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategoriya, slug } = await params;
  const result = await getListingBySlug(slug);
  if (!result) return { title: "Kurs topilmadi" };
  const c = result.course;
  const url = `${SITE_URL}/kurslar/${kategoriya}/${slug}`;
  const imageUrl = c.imageUrl ? (c.imageUrl.startsWith("http") ? c.imageUrl : `${SITE_URL}${c.imageUrl}`) : undefined;
  const priceText = c.priceFree ? "Bepul" : `${c.price} so'm`;

  // Joy ma'lumoti — birinchi filial yoki eski region/district fallback'i.
  // Onlayn/Video uchun joy ko'rsatmaymiz (har joydan kirish mumkin).
  const isRemote = c.format === "Online" || c.format === "Video";
  const firstBranch = c.branches?.[0];
  const region = firstBranch?.region ?? c.region ?? null;
  const district = firstBranch?.district ?? c.district ?? null;
  // Title uchun: "Toshkent · Yunusobod" yoki "Toshkent" yoki bo'sh
  const cityPart = !isRemote && (region || district)
    ? ` · ${[region, district].filter(Boolean).join(" · ")}`
    : (isRemote ? " · Onlayn" : "");

  // Title: "Ingliz tili kursi — MYPRO · Toshkent · Yunusobod"
  // 60 belgidan ko'p bo'lmasin (Google snippet max ~60)
  const fullTitle = `${c.title} — ${c.provider}${cityPart}`;
  const title = fullTitle.length > 60 ? fullTitle.slice(0, 57).trim() + "…" : fullTitle;

  const desc = (c.description && c.description.length > 40)
    ? `${c.description.slice(0, 155).trim()}…`
    : `${c.title} — ${c.provider}${cityPart}. ${priceText}. ${c.duration ?? ""}. Ariza qoldiring.`;

  // Keywords — shahar/tuman variantlari ham qo'shilsin
  const keywords = [
    c.title,
    `${c.title} ${district ?? region ?? "Toshkent"}`,
    c.category,
    `${c.category} kursi`,
    c.provider,
    ...(region ? [`${c.category} ${region}`] : []),
    ...(district ? [`${c.category} ${district}`] : []),
    "kurs", c.format.toLowerCase(),
  ].filter(Boolean) as string[];

  return {
    title,
    description: desc,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "uz_UZ",
      url,
      siteName: "Darslinker.uz",
      title,
      description: desc,
      images: imageUrl ? [{ url: imageUrl, alt: c.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function KursDetailPage({ params }: Props) {
  const { kategoriya, slug } = await params;
  const [result, categories] = await Promise.all([
    getListingBySlug(slug),
    getActiveCategories(),
  ]);
  if (!result) notFound();
  const { course, id: listingId } = result;

  // Sharhlar — faqat reyting publik chegarasidan o'tgan bo'lsa yuklaymiz.
  // Faqat izoh qoldirgan foydalanuvchilar ko'rsatiladi (yulduzlar emas).
  const comments = (course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW
    ? await getRecentComments(listingId, 200)
    : [];

  // Cross-linking: shu kategoriyadagi boshqa kurslar (joriy listing'dan tashqari).
  const relatedAll = course.categorySlug
    ? await getActiveListings({ categorySlug: course.categorySlug, limit: 7 })
    : [];
  const related = relatedAll.filter((c) => c.slug !== course.slug).slice(0, 6);

  const cat = categories.find((c) => c.slug === kategoriya);
  const catName = cat?.name ?? kategoriya.replace(/-/g, " ");

  // JSON-LD structured data — Google rich snippets uchun
  const url = `${SITE_URL}/kurslar/${kategoriya}/${slug}`;
  const imageAbs = course.imageUrl ? (course.imageUrl.startsWith("http") ? course.imageUrl : `${SITE_URL}${course.imageUrl}`) : undefined;
  const priceAmount = course.priceFree ? 0 : Number(course.price.replace(/[^\d]/g, "")) || 0;

  // Tillar va filiallar — yangi (multi) yoki eski (single) qaytadan tiklash
  const langCodes: string[] = (course.languages && course.languages.length > 0)
    ? course.languages
    : (course.language ? [course.language] : ["uz"]);
  const inLanguageValue: string | string[] = langCodes.length === 1 ? langCodes[0] : langCodes;

  type AddressInfo = { region: string | null; district: string | null; address: string | null };
  const addresses: AddressInfo[] = (course.branches && course.branches.length > 0)
    ? course.branches
    : ((course.region || course.district || course.location)
      ? [{ region: course.region ?? null, district: course.district ?? null, address: course.location ?? null }]
      : []);

  // Course schema — kurs uchun asosiy struktura
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description || `${course.title} — ${course.provider}`,
    "provider": {
      "@type": "Organization",
      "name": course.provider,
      "sameAs": SITE_URL,
    },
    ...(imageAbs && { "image": imageAbs }),
    "url": url,
    ...(course.location && { "locationCreated": course.location }),
    "inLanguage": inLanguageValue,
    // S2 — Offer + PriceSpecification
    "offers": {
      "@type": "Offer",
      "price": priceAmount,
      "priceCurrency": "UZS",
      "availability": "https://schema.org/InStock",
      "url": url,
      "category": course.priceFree ? "Free" : "Paid",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": priceAmount,
        "priceCurrency": "UZS",
        "valueAddedTaxIncluded": true,
      },
    },
    "courseMode":
      course.format === "Offline" ? "onsite" :
      course.format === "Online" ? "online" :
      course.format === "Gibrid" ? "blended" :
      "online",
    ...(course.duration && { "timeRequired": course.duration }),
    // S3 — instructor (Person)
    ...(course.teacherName && {
      "instructor": {
        "@type": "Person",
        "name": course.teacherName,
        ...(course.teacherExperience && { "description": course.teacherExperience }),
      },
    }),
    ...((course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (course.ratingAvg ?? 0).toFixed(1),
        "ratingCount": course.ratingCount,
        "bestRating": 5,
        "worstRating": 1,
      },
    }),
  };

  // F — VideoObject (faqat video formatdagi kurslar uchun)
  const isVideo = course.format === "Video";
  const videoLd = (isVideo && imageAbs) ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": course.title,
    "description": course.description || `${course.title} — ${course.provider}`,
    "thumbnailUrl": [imageAbs],
    "uploadDate": new Date().toISOString().split("T")[0],
    ...(course.duration && { "duration": course.duration }),
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "Darslinker.uz",
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon-512.png` },
    },
    "inLanguage": inLanguageValue,
  } : null;

  // S1 — LocalBusiness — har bir filial uchun alohida entry (faqat offline kurslar)
  const isOffline = course.format === "Offline";
  const localBusinessLds = (isOffline && addresses.length > 0)
    ? addresses.map((a) => ({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": course.provider,
        "url": url,
        ...(imageAbs && { "image": imageAbs }),
        ...(course.phone && { "telephone": course.phone }),
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "UZ",
          ...(a.region && { "addressRegion": a.region }),
          ...(a.district && { "addressLocality": a.district }),
          ...(a.address && { "streetAddress": a.address }),
        },
        ...(a.region && {
          "areaServed": { "@type": "AdministrativeArea", "name": a.region },
        }),
        ...((course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": (course.ratingAvg ?? 0).toFixed(1),
            "ratingCount": course.ratingCount,
            "bestRating": 5,
            "worstRating": 1,
          },
        }),
      }))
    : [];
  const breadcrumbItems: { "@type": "ListItem"; position: number; name: string; item: string }[] = [
    { "@type": "ListItem", position: 1, name: "Bosh sahifa", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Kurslar", item: `${SITE_URL}/kurslar` },
  ];
  if (course.groupName && course.groupSlug) {
    breadcrumbItems.push({ "@type": "ListItem", position: breadcrumbItems.length + 1, name: course.groupName, item: `${SITE_URL}/kurslar/g/${course.groupSlug}` });
  }
  breadcrumbItems.push({ "@type": "ListItem", position: breadcrumbItems.length + 1, name: catName, item: `${SITE_URL}/kurslar/${kategoriya}` });
  breadcrumbItems.push({ "@type": "ListItem", position: breadcrumbItems.length + 1, name: course.title, item: url });
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <ScrollToTop />
      <ViewTracker slug={slug} />
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {localBusinessLds.map((ld, i) => (
        <script key={`lb-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      {videoLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      )}
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-8 md:py-12">
        {/* Back button */}
        <Link href="/kurslar" className="inline-flex items-center gap-2 text-[13px] text-[#7c8490] hover:text-[#16181a] font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kurslarga qaytish
        </Link>
        {/* Breadcrumb — guruh > yo'nalish > kurs */}
        <div className="flex items-center gap-2 text-[13px] mb-8 flex-wrap">
          <Link href="/kurslar" className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors">Kurslar</Link>
          {course.groupName && course.groupSlug && (
            <>
              <span className="text-[#16181a]/20">/</span>
              <Link href={`/kurslar/g/${course.groupSlug}`} className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors">{course.groupName}</Link>
            </>
          )}
          <span className="text-[#16181a]/20">/</span>
          <Link href={`/kurslar/${kategoriya}`} className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors">{catName}</Link>
          <span className="text-[#16181a]/20">/</span>
          <span className="text-[#7c8490]">{course.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Asosiy content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <div className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br ${course.gradient} p-6 md:p-8`}>
              {course.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.imageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover hidden md:block" style={{ objectPosition: `${course.imageAPosX ?? 50}% ${course.imageAPosY ?? 50}%`, transform: `scale(${(course.imageAZoom ?? 100) / 100})`, transformOrigin: `${course.imageAPosX ?? 50}% ${course.imageAPosY ?? 50}%` }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.imageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover md:hidden" style={{ objectPosition: `${course.imageAMPosX ?? 50}% ${course.imageAMPosY ?? 50}%`, transform: `scale(${(course.imageAMZoom ?? 100) / 100})`, transformOrigin: `${course.imageAMPosX ?? 50}% ${course.imageAMPosY ?? 50}%` }} />
                  <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(course.imageDarkness ?? 15) / 100})` }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/85" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  <svg className="absolute right-6 bottom-6 w-[100px] h-[100px] text-white/[0.08]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"><path d={course.iconPath} /></svg>
                </>
              )}
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  {!course.title.toLowerCase().includes(course.category.toLowerCase()) && (
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold">{course.category}</span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-[12px]">{course.format}</span>
                </div>
                <h1 className="text-[24px] md:text-[32px] font-bold text-white leading-tight">{course.title}</h1>
                <p className="text-[14px] text-white/50 mt-2">{course.provider}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {course.location && (
                    <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                      <MapPin className="w-4 h-4" />{course.location}
                    </div>
                  )}
                  {course.duration && course.duration !== "—" && (
                    <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                      <Clock className="w-4 h-4" />{course.duration}
                    </div>
                  )}
                  {(course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW && (
                    <div className="flex items-center gap-1.5 text-[13px] text-white/80">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{(course.ratingAvg ?? 0).toFixed(1)} <span className="text-white/40">· {course.ratingCount} baholash</span>
                    </div>
                  )}
                  {(course.views ?? 0) > 0 && (
                    <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                      <Eye className="w-4 h-4" />{course.views}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kurs haqida */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-3">Kurs haqida</h2>
              <p className="text-[15px] text-[#7c8490] leading-relaxed whitespace-pre-wrap">{course.description}</p>
            </div>

            {/* Reyting bloki */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-[18px] font-bold text-[#16181a] mb-1">Reytinglar</h2>
                  {(course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`w-4 h-4 ${(course.ratingAvg ?? 0) >= n - 0.25 ? "fill-amber-400 text-amber-400" : "text-[#d4d7db]"}`} />
                        ))}
                      </div>
                      <span className="text-[16px] font-bold text-[#16181a]">{(course.ratingAvg ?? 0).toFixed(1)}</span>
                      <span className="text-[13px] text-[#7c8490]">· {course.ratingCount} baholash</span>
                    </div>
                  ) : (course.ratingCount ?? 0) > 0 ? (
                    <p className="text-[13px] text-[#7c8490] mt-1">
                      O&apos;rtacha reyting kamida {MIN_RATINGS_TO_SHOW} ta baholashdan keyin ko&apos;rinadi ({course.ratingCount}/{MIN_RATINGS_TO_SHOW})
                    </p>
                  ) : (
                    <p className="text-[13px] text-[#7c8490] mt-1">Hali baholanmagan — birinchi bo&apos;lib baho bering!</p>
                  )}
                </div>
                <RatingForm listingId={listingId} />
              </div>

              <RatingComments comments={comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))} />
            </div>

            {/* Chegirma/aksiya — faqat discount bo'lsa */}
            {course.discount && (
              <div className="rounded-[18px] bg-gradient-to-r from-[#fef9c3] to-[#fde68a] border border-[#fcd34d] p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[12px] bg-white/70 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-[#a16207]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#a16207] uppercase tracking-wide">Maxsus taklif</p>
                    <p className="text-[16px] md:text-[17px] font-bold text-[#713f12] leading-snug mt-0.5">{course.discount}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ma'lumotlar grid */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-5">Batafsil ma&apos;lumot</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Narx</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.priceFree ? "Bepul" : `${course.price} so'm`}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Davomiylik</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Format</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.format}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#7c8490]">Dars tili</p>
                    <p className="text-[14px] font-bold text-[#16181a]">
                      {(course.languages && course.languages.length > 0
                        ? course.languages
                        : (course.language ? [course.language] : ["uz"])
                      ).map(c => c === "ru" ? "Rus" : c === "en" ? "Ingliz" : "O'zbek").join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Sertifikat</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.certificate ? "Beriladi" : "Yo'q"}</p>
                  </div>
                </div>
                {((course.levels && course.levels.length > 0) || course.level) && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 text-[#7ea2d4]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#7c8490]">Daraja</p>
                      <p className="text-[14px] font-bold text-[#16181a]">
                        {(course.levels && course.levels.length > 0 ? course.levels : (course.level ? [course.level] : [])).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                {course.schedule && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-[#7ea2d4]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#7c8490]">Dars jadvali</p>
                      <p className="text-[14px] font-bold text-[#16181a]">{course.schedule}</p>
                    </div>
                  </div>
                )}
                {course.paymentType && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4 text-[#7ea2d4]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#7c8490]">To&apos;lov turi</p>
                      <p className="text-[14px] font-bold text-[#16181a]">{course.paymentType}</p>
                    </div>
                  </div>
                )}
                {course.demoLesson && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4 text-[#7ea2d4]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#7c8490]">Demo dars</p>
                      <p className="text-[14px] font-bold text-[#16181a]">Mavjud</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Filiallar — bir nechta manzil bo'lsa ko'rsatamiz */}
            {course.branches && course.branches.length > 1 && (
              <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
                <h2 className="text-[18px] font-bold text-[#16181a] mb-5">Filiallar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.branches.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-[12px] bg-[#f0f2f3]">
                      <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/15 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#7ea2d4]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-[#16181a] truncate">
                          {[b.district, b.region].filter(Boolean).join(", ") || "—"}
                        </p>
                        {b.address && (
                          <p className="text-[12px] text-[#7c8490] mt-0.5">{b.address}</p>
                        )}
                        {b.price && b.price !== priceAmount && (
                          <p className="text-[13px] font-bold text-[#16181a] mt-1.5">
                            {new Intl.NumberFormat("uz-UZ").format(b.price).replace(/\s/g, ",")} so&apos;m
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dars rejasi — faqat teacher kiritgan bo'lsa ko'rsatiladi */}
            {course.lessons && course.lessons.length > 0 && (
              <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
                <h2 className="text-[18px] font-bold text-[#16181a] mb-5">Dars rejasi</h2>
                <div className="space-y-3">
                  {course.lessons.map((modul, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-[12px] bg-[#f0f2f3]">
                      <span className="w-7 h-7 rounded-full bg-[#7ea2d4]/15 flex items-center justify-center shrink-0 text-[12px] font-bold text-[#7ea2d4]">{i + 1}</span>
                      <span className="text-[14px] text-[#16181a]">{modul}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* O'qituvchi — faqat ma'lumot kiritilgan bo'lsa ko'rsatamiz */}
            {(course.teacherName || course.teacherExperience) && (
              <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
                <h2 className="text-[18px] font-bold text-[#16181a] mb-4">O&apos;qituvchi</h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#7ea2d4]/15 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[#7ea2d4]" />
                  </div>
                  <div>
                    {course.teacherName && (
                      <p className="text-[15px] font-semibold text-[#16181a]">{course.teacherName}</p>
                    )}
                    {course.location && (
                      <p className="text-[13px] text-[#7c8490]">{course.location}</p>
                    )}
                    {course.teacherExperience && (
                      <p className="text-[13px] text-[#7c8490] leading-relaxed mt-2">{course.teacherExperience}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — ariza form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-5">
              {/* Narx */}
              <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-bold text-[#16181a]">{course.priceFree ? "Bepul" : `${course.price}`}</span>
                  {!course.priceFree && <span className="text-[14px] text-[#7c8490]">so&apos;m</span>}
                </div>
              </div>

              {/* Ariza form */}
              <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6">
                <h3 className="text-[16px] font-bold text-[#16181a] mb-2">Ariza qoldirish</h3>
                <p className="text-[13px] text-[#7c8490] mb-5">Ma&apos;lumotlaringizni qoldiring — markaz siz bilan bog&apos;lanadi</p>
                <CourseLeadForm listingId={listingId} />
              </div>
            </div>
          </div>
        </div>

        {/* Shu kategoriyadagi boshqa kurslar — cross-linking */}
        {related.length > 0 && (
          <section className="mt-12">
            <div className="flex items-end justify-between gap-4 mb-5">
              <h2 className="text-[18px] md:text-[20px] font-bold text-[#16181a]">Shu kategoriyadagi boshqa kurslar</h2>
              <Link href={`/kurslar/${kategoriya}`} className="text-[13px] text-[#7ea2d4] hover:text-[#5b87c0] font-semibold whitespace-nowrap transition-colors">
                Barcha {catName} kurslari &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kurslar/${c.categorySlug}/${c.slug}`}
                  className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br ${c.gradient} p-5 flex flex-col min-h-[150px] group transition-transform hover:-translate-y-0.5`}
                >
                  {c.imageUrl && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.imageUrl} alt={c.title} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: `${c.imageCPosX ?? 50}% ${c.imageCPosY ?? 50}%`, transform: `scale(${(c.imageCZoom ?? 100) / 100})`, transformOrigin: `${c.imageCPosX ?? 50}% ${c.imageCPosY ?? 50}%` }} />
                      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(c.imageDarkness ?? 15) / 100})` }} />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/85" />
                    </>
                  )}
                  <div className="relative z-[1] flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-2">{c.format}</span>
                    <h3 className="text-[15px] font-bold text-white leading-snug">{c.title}</h3>
                    <p className="text-[12px] text-white/50 mt-1 line-clamp-1">{c.provider}{c.location ? ` · ${c.location}` : ""}</p>
                  </div>
                  <div className="relative z-[1] mt-3 text-[13px] font-bold text-white">
                    {c.priceFree ? "Bepul" : `${c.price} so'm`}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Orqaga */}
        <div className="mt-10">
          <Link href={`/kurslar/${kategoriya}`} className="inline-flex items-center gap-2 text-[14px] text-[#7ea2d4] hover:text-[#5b87c0] font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {catName} kurslariga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
