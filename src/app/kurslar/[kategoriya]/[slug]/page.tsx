import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Star, BookOpen, Award, Users, Globe, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import { getListingBySlug, getActiveCategories } from "@/lib/listings";
import { CourseLeadForm } from "@/components/course-lead-form";

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
  const desc = (c.description && c.description.length > 40)
    ? `${c.description.slice(0, 155).trim()}…`
    : `${c.title} — ${c.provider}${c.location ? `, ${c.location}` : ""}. ${c.format} format. Narx: ${priceText}. Davomiylik: ${c.duration}.`;

  return {
    title: `${c.title} — ${c.provider}`,
    description: desc,
    keywords: [c.title, c.category, c.provider, c.location, "kurs", "online kurs", c.format.toLowerCase()].filter(Boolean) as string[],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "uz_UZ",
      url,
      siteName: "Darslinker.uz",
      title: `${c.title} — ${c.provider}`,
      description: desc,
      images: imageUrl ? [{ url: imageUrl, alt: c.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
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

  const cat = categories.find((c) => c.slug === kategoriya);
  const catName = cat?.name ?? kategoriya.replace(/-/g, " ");

  // JSON-LD structured data — Google rich snippets uchun
  const url = `${SITE_URL}/kurslar/${kategoriya}/${slug}`;
  const imageAbs = course.imageUrl ? (course.imageUrl.startsWith("http") ? course.imageUrl : `${SITE_URL}${course.imageUrl}`) : undefined;
  const priceAmount = course.priceFree ? 0 : Number(course.price.replace(/[^\d]/g, "")) || 0;
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
    "inLanguage": "uz",
    "offers": {
      "@type": "Offer",
      "price": priceAmount,
      "priceCurrency": "UZS",
      "availability": "https://schema.org/InStock",
      "url": url,
      "category": course.priceFree ? "Free" : "Paid",
    },
    "courseMode": course.format === "Offline" ? "onsite" : course.format === "Online" ? "online" : "blended",
    ...(course.duration && { "timeRequired": course.duration }),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": course.rating,
      "ratingCount": 1,
      "bestRating": 5,
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Kurslar", "item": `${SITE_URL}/kurslar` },
      { "@type": "ListItem", "position": 3, "name": catName, "item": `${SITE_URL}/kurslar/${kategoriya}` },
      { "@type": "ListItem", "position": 4, "name": course.title, "item": url },
    ],
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-8 md:py-12">
        {/* Back button */}
        <Link href="/kurslar" className="inline-flex items-center gap-2 text-[13px] text-[#7c8490] hover:text-[#16181a] font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kurslarga qaytish
        </Link>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] mb-8">
          <Link href="/kurslar" className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors">Kurslar</Link>
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
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[12px] font-semibold">{course.category}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-[12px]">{course.format}</span>
                </div>
                <h1 className="text-[24px] md:text-[32px] font-bold text-white leading-tight">{course.title}</h1>
                <p className="text-[14px] text-white/50 mt-2">{course.provider}</p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                    <Star className="w-4 h-4 fill-white/60 text-white/60" />{course.rating}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                    <MapPin className="w-4 h-4" />{course.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-white/60">
                    <Clock className="w-4 h-4" />{course.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Kurs haqida */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-3">Kurs haqida</h2>
              <p className="text-[15px] text-[#7c8490] leading-relaxed">{course.description}</p>
            </div>

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
                    <Star className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Reyting</p>
                    <p className="text-[14px] font-bold text-[#16181a]">{course.rating}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Til</p>
                    <p className="text-[14px] font-bold text-[#16181a]">O&apos;zbek</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#7ea2d4]/10 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#7ea2d4]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7c8490]">Sertifikat</p>
                    <p className="text-[14px] font-bold text-[#16181a]">Beriladi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dars rejasi */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-5">Dars rejasi</h2>
              <div className="space-y-3">
                {["Asoslar va kirish", "Amaliy mashqlar", "Loyiha ishlash", "Yakuniy loyiha va sertifikat"].map((modul, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-[12px] bg-[#f0f2f3]">
                    <span className="w-7 h-7 rounded-full bg-[#7ea2d4]/15 flex items-center justify-center shrink-0 text-[12px] font-bold text-[#7ea2d4]">{i + 1}</span>
                    <span className="text-[14px] text-[#16181a]">{modul}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* O'qituvchi */}
            <div className="rounded-[18px] bg-white border border-[#e4e7ea] p-6 md:p-8">
              <h2 className="text-[18px] font-bold text-[#16181a] mb-4">O&apos;qituvchi</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#7ea2d4]/15 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#7ea2d4]" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#16181a]">{course.provider}</p>
                  <p className="text-[13px] text-[#7c8490]">{course.location}</p>
                </div>
              </div>
            </div>
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
                <span className="inline-flex px-2.5 py-1 rounded-full bg-green-50 text-[12px] font-medium text-green-600 mt-2">
                  Bo&apos;sh joy bor
                </span>
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
