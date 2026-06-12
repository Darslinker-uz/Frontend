import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Home, MapPin, Star, GraduationCap, BookOpen, Calendar, Phone, Wifi, Building2 } from "lucide-react";
import { getTutorBySlug, getRelatedTutors } from "@/lib/tutors";
import { TutorLeadForm } from "./tutor-lead-form";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tutor = await getTutorBySlug(slug);
  if (!tutor) {
    return {
      title: "Repetitor topilmadi",
      robots: { index: false, follow: false },
    };
  }
  const subjectList = tutor.subjects.join(", ");
  const regionList = tutor.regions.join(", ");
  const title = `${tutor.fullName}${subjectList ? ` — ${subjectList} repetitori` : " — repetitor"}`;
  const bioSnippet = (tutor.description ?? "").trim().slice(0, 130);
  const fallback = `${tutor.fullName} — ${subjectList || "shaxsiy"} repetitori${regionList ? ` (${regionList})` : ""}. Narx, tajriba va bog'lanish — Darslinker'da.`;
  const description = bioSnippet ? `${tutor.fullName} shaxsiy repetitori: ${bioSnippet}` : fallback;
  return {
    title,
    description,
    keywords: [
      tutor.fullName,
      `${tutor.fullName} repetitor`,
      ...tutor.subjects.map(s => `${s} repetitori`),
      ...tutor.regions.map(r => `repetitor ${r.toLowerCase()}`),
      "shaxsiy o'qituvchi",
    ],
    alternates: { canonical: `${SITE_URL}/repetitorlar/${tutor.slug}` },
    openGraph: {
      type: "profile",
      locale: "uz_UZ",
      url: `${SITE_URL}/repetitorlar/${tutor.slug}`,
      siteName: "Darslinker.uz",
      title,
      description,
      images: [tutor.imageUrl ?? "/og-image.png?v=4"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [tutor.imageUrl ?? "/og-image.png?v=4"],
    },
  };
}

export default async function TutorPage({ params }: Props) {
  const { slug } = await params;
  const tutor = await getTutorBySlug(slug);
  if (!tutor) notFound();

  const initial = tutor.fullName.charAt(0).toUpperCase();
  const rating = tutor.avgRating > 0 ? tutor.avgRating.toFixed(1) : null;
  const yearsExperience = new Date().getFullYear() - tutor.startedYear;

  const relatedTutors = await getRelatedTutors(tutor.id, tutor.subjects, 3);

  // AEO/GEO: Person + Service + Course schemas
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Asosiy", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Repetitorlar", "item": `${SITE_URL}/repetitorlar` },
      { "@type": "ListItem", "position": 3, "name": tutor.fullName, "item": `${SITE_URL}/repetitorlar/${tutor.slug}` },
    ],
  };

  // Person + Service (repetitorlar uchun asosiy schema turi)
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/repetitorlar/${tutor.slug}#person`,
    "name": tutor.fullName,
    "description": tutor.description,
    "url": `${SITE_URL}/repetitorlar/${tutor.slug}`,
    "telephone": tutor.phone,
    "jobTitle": tutor.subjects.length > 0 ? `${tutor.subjects[0]} repetitori` : "Shaxsiy repetitor",
    "knowsAbout": tutor.subjects,
    "knowsLanguage": ["uz", "ru"],
    "worksFor": { "@type": "Organization", "name": "Darslinker.uz katalogi" },
    "areaServed": tutor.regions.map(r => ({ "@type": "City", "name": r, "containedInPlace": { "@type": "Country", "name": "O'zbekiston" } })),
    ...(rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "ratingCount": tutor.ratingCount,
        "bestRating": 5,
      },
    } : {}),
    ...(tutor.telegram || tutor.instagram || tutor.website ? {
      "sameAs": [
        ...(tutor.telegram ? [`https://t.me/${tutor.telegram}`] : []),
        ...(tutor.instagram ? [`https://instagram.com/${tutor.instagram}`] : []),
        ...(tutor.website ? [`https://${tutor.website}`] : []),
      ],
    } : {}),
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${tutor.fullName} repetitor xizmatlari`,
    "provider": { "@id": `${SITE_URL}/repetitorlar/${tutor.slug}#person` },
    "serviceType": "Educational Tutoring",
    "areaServed": tutor.regions.map(r => ({ "@type": "City", "name": r })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${tutor.fullName} darslari`,
      "itemListElement": tutor.courses.map((c, i) => ({
        "@type": "Offer",
        "position": i + 1,
        "priceCurrency": "UZS",
        "itemOffered": {
          "@type": "Course",
          "name": c.title,
          "courseMode": c.format.toLowerCase(),
          "educationalLevel": c.level,
          "provider": { "@id": `${SITE_URL}/repetitorlar/${tutor.slug}#person` },
        },
      })),
    },
  };

  // FAQ — repetitor haqida AI uchun
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${tutor.fullName} qaerda dars beradi?`,
        "acceptedAnswer": { "@type": "Answer", "text": tutor.regions.length > 0
          ? `${tutor.fullName} ${tutor.regions.join(", ")} ${tutor.regions.length > 1 ? "viloyatlarida" : "viloyatida"} dars beradi.${tutor.regions.includes("Onlayn") ? " Online format ham mavjud." : ""}`
          : `${tutor.fullName} O'zbekistonda dars beradi.` },
      },
      {
        "@type": "Question",
        "name": `${tutor.fullName} qaysi fanlarni o'rgatadi?`,
        "acceptedAnswer": { "@type": "Answer", "text": tutor.subjects.length > 0
          ? `${tutor.fullName} ${tutor.subjects.join(", ")} fanlari bo'yicha shaxsiy dars beradi. ${tutor.courseCount} ta dars/xizmat taklif qiladi.`
          : `${tutor.fullName} repetitor xizmatlari taklif qiladi.` },
      },
      {
        "@type": "Question",
        "name": `${tutor.fullName} ishonchli repetitormi?`,
        "acceptedAnswer": { "@type": "Answer", "text": `Ha, ${tutor.fullName} Darslinker katalogida admin tomonidan tekshirilgan.${rating ? ` O'rtacha reyting: ${rating}/5 (${tutor.ratingCount} sharh).` : ""} ${yearsExperience}+ yil tajriba.` },
      },
      {
        "@type": "Question",
        "name": `${tutor.fullName}ga qanday yozilish mumkin?`,
        "acceptedAnswer": { "@type": "Answer", "text": `2 yo'l bilan: 1) Telefon ${tutor.phone} 2) Darslinker profili: ${SITE_URL}/repetitorlar/${tutor.slug} — "Repetitorga ariza" formasi.` },
      },
    ],
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h2", "h3"] },
  };

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-12 pt-6 md:pt-8 pb-12 md:pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-[#7c8490] mb-5 flex-wrap">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[#16181a] transition-colors">
            <Home className="w-3.5 h-3.5" />
            Asosiy
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/repetitorlar" className="hover:text-[#16181a] transition-colors">Repetitorlar</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#16181a] font-medium line-clamp-1">{tutor.fullName}</span>
        </nav>

        {/* HERO */}
        <div className="bg-white border border-[#e4e7ea] rounded-[24px] p-6 md:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row items-start gap-5 md:gap-7">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-[20px] flex items-center justify-center text-white text-[36px] md:text-[48px] font-extrabold shrink-0 shadow-lg" style={{ background: tutor.gradient }}>
              {tutor.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={tutor.imageUrl} alt={tutor.fullName} className="w-full h-full object-cover rounded-[20px]" />
              ) : (
                initial
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase">
                  <GraduationCap className="w-3 h-3" /> Repetitor
                </span>
              </div>
              <h1 className="text-[28px] md:text-[36px] lg:text-[40px] font-extrabold text-[#16181a] tracking-[-0.03em] leading-tight">
                {tutor.fullName}
              </h1>
              {tutor.description && (
                <p className="text-[14px] md:text-[16px] text-[#475569] mt-3 leading-relaxed max-w-[640px]">{tutor.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5">
                {rating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-[14px] font-bold text-[#16181a]">{rating}</span>
                    <span className="text-[12.5px] text-[#7c8490]">({tutor.ratingCount} sharh)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#7c8490]" />
                  <span className="text-[13px] text-[#16181a]"><span className="font-bold">{tutor.courseCount}</span> dars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#7c8490]" />
                  <span className="text-[13px] text-[#16181a]"><span className="font-bold">{yearsExperience}+</span> yil</span>
                </div>
              </div>

              {tutor.subjects.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  {tutor.subjects.map((s) => (
                    <span key={s} className="text-[12px] font-medium text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-100 rounded-full px-3 py-1">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 mt-6 md:mt-8">
          <div className="space-y-6 md:space-y-8 min-w-0">
            {/* Hududlar */}
            {tutor.regions.length > 0 && (
              <section className="bg-white border border-[#e4e7ea] rounded-[20px] p-5 md:p-6">
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#16181a] tracking-[-0.02em] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-fuchsia-700" />
                  Dars formati va joylashuvi
                </h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tutor.regions.map((region) => (
                    <span key={region} className="inline-flex items-center gap-1.5 bg-[#fbf7fc] border border-[#e4e7ea] rounded-full px-4 py-2 text-[13px] text-[#16181a] font-medium">
                      {region === "Onlayn" ? <Wifi className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                      {region}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Darslar */}
            {tutor.courses.length > 0 && (
              <section className="bg-white border border-[#e4e7ea] rounded-[20px] p-5 md:p-6">
                <div className="flex items-end justify-between gap-3 mb-5">
                  <h2 className="text-[18px] md:text-[22px] font-bold text-[#16181a] tracking-[-0.02em]">{tutor.fullName} darslari</h2>
                  <span className="text-[12.5px] text-[#7c8490] shrink-0">{tutor.courses.length} ta</span>
                </div>
                <div className="space-y-3">
                  {tutor.courses.map((c) => {
                    const FormatIcon = c.format === "Onlayn" ? Wifi : c.format === "Oflayn" ? Building2 : GraduationCap;
                    return (
                      <div key={c.id} className="flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-[16px] bg-[#fbf7fc] border border-[#e4e7ea] hover:border-fuchsia-300 hover:bg-white transition-all">
                        <div className="w-11 h-11 rounded-[12px] bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span className="text-[11px] font-bold text-fuchsia-700 bg-fuchsia-50 rounded-full px-2 py-0.5">{c.category}</span>
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#16181a]/60 bg-[#f2f4f5] rounded-full px-2 py-0.5">
                              <FormatIcon className="w-2.5 h-2.5" />
                              {c.format}
                            </span>
                            <span className="text-[11px] text-[#7c8490] bg-[#f2f4f5] rounded-full px-2 py-0.5">{c.level}</span>
                          </div>
                          <h3 className="text-[14px] md:text-[15px] font-bold text-[#16181a] tracking-[-0.01em] leading-tight">{c.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                            <span className="text-[12px] text-[#16181a]">{c.duration}</span>
                            <span className="text-[12px] font-semibold text-fuchsia-700">{c.price}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* O'xshash repetitorlar */}
            {relatedTutors.length > 0 && (
              <section>
                <h2 className="text-[18px] md:text-[22px] font-bold text-[#16181a] tracking-[-0.02em] mb-4 md:mb-5">O&apos;xshash repetitorlar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {relatedTutors.map((other) => (
                    <Link key={other.slug} href={`/repetitorlar/${other.slug}`} className="group bg-white border border-[#e4e7ea] rounded-[16px] p-4 hover:border-fuchsia-400 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white text-[18px] font-extrabold shrink-0 shadow-sm" style={{ background: other.gradient }}>
                          {other.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-bold text-[#16181a] truncate">{other.fullName}</div>
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

          {/* SIDEBAR: Form + kontakt */}
          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <div>
              <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-t-[20px] px-5 md:px-6 pt-5 pb-3">
                <h2 className="text-[18px] md:text-[20px] font-bold text-[#16181a] tracking-[-0.02em]">Dars uchun ariza</h2>
                <p className="text-[12.5px] text-[#475569] mt-1.5">
                  <span className="font-semibold">{tutor.fullName}</span> 24 soat ichida bog&apos;lanadi.
                </p>
              </div>
              <div className="-mt-1">
                <TutorLeadForm tutorName={tutor.fullName} firstListingId={tutor.courses[0]?.id ?? null} />
              </div>
            </div>

            <div className="bg-white border border-[#e4e7ea] rounded-[20px] p-5 md:p-6">
              <h3 className="text-[14px] font-bold text-[#16181a] tracking-[-0.01em] mb-3">Kontakt</h3>
              <a href={`tel:${tutor.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-[13px] text-[#16181a] hover:text-fuchsia-700 transition-colors">
                <div className="w-8 h-8 rounded-[10px] bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-medium">{tutor.phone}</span>
              </a>
            </div>
          </aside>
        </div>

        {/* CTA: hamkorlik */}
        <section className="mt-10 md:mt-12">
          <div className="bg-[#e8eaed] rounded-[20px] p-8 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-[family-name:var(--font-outfit)] text-[18px] md:text-[26px] font-bold text-[#16181a] leading-tight">
                Repetitormisiz?
              </h2>
              <Link href="/hamkorlik" className="inline-flex items-center gap-2 h-[44px] px-6 rounded-[12px] bg-white text-[#16181a] text-[14px] font-medium hover:bg-white/80 transition-colors shrink-0">
                Hamkorlik <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
