import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { CrmApplyButton } from "@/components/crm/crm-apply";
import { PREVIEW_COLORS } from "@/components/crm/features-explorer";
import { FaqList } from "@/components/faq-item";
import { SHARE_OG, SHARE_TWITTER } from "@/lib/share-meta";

// /features/* va /for/* sahifalarining umumiy ko'rinishi (bosh sahifa uslubida): hero + namuna,
// savol-javob (AEO: H2 savol, ostida qisqa aniq javob), qadamlar, foydalar, bog'liq bo'lim, FAQ, yakuniy CTA.
// Meta, breadcrumb va JSON-LD (WebPage + BreadcrumbList + FAQPage) shu yerda quriladi — sahifada faqat matn.
// Kalit so'zlar — docs/crm-pages-keywords.md. Faqat tasdiqlangan imkoniyatlar yoziladi.

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";

export type Crumb = { name: string; href: string };

export const FEATURES_CRUMB: Crumb = { name: "Imkoniyatlar", href: "/features" };
// /for/* uchun alohida hub yo'q — /features sahifasidagi "Kimlar uchun" bo'limiga olib boradi.
export const FOR_CRUMB: Crumb = { name: "Kimlar uchun", href: "/features#kimlar-uchun" };

export type FeaturePageContent = {
  path: string;
  ref: string; // ariza manbasi, masalan feature-attendance
  parent: Crumb;
  crumb: string; // breadcrumb'dagi qisqa nom
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  title: string; // H1
  lead: string;
  Preview: () => ReactNode;
  how: { question: string; answer: string; steps: { title: string; text: string }[] };
  // Qisqacha: 3–4 ta asosiy fakt (GEO — AI iqtibos uchun). Ixtiyoriy.
  summary?: string[];
  benefits: { question: string; items: { title: string; text: string }[] };
  // Daftar/Excel bilan taqqoslash: [vazifa, daftar/Excel'da, Darslinker'da]. Ixtiyoriy.
  compare?: { question: string; beforeLabel?: string; rows: [string, string, string][] };
  related: { title: string; text: ReactNode };
  faqs: { q: string; a: string }[];
  cta: { title: string; text: string };
};

export function featureMetadata(c: FeaturePageContent): Metadata {
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    keywords: c.keywords,
    alternates: { canonical: c.path },
    openGraph: { ...SHARE_OG, title: c.metaTitle, description: c.metaDescription, url: c.path },
    twitter: { ...SHARE_TWITTER, title: c.metaTitle, description: c.metaDescription },
  };
}

function jsonLd(c: FeaturePageContent) {
  const crumbs = [{ name: "Bosh sahifa", href: "/" }, c.parent, { name: c.crumb, href: c.path }];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": c.metaTitle,
        "description": c.metaDescription,
        "url": `${SITE_URL}${c.path}`,
        "inLanguage": "uz",
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "about": { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": crumbs.map((b, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": b.name,
          "item": `${SITE_URL}${b.href}`,
        })),
      },
      {
        "@type": "FAQPage",
        "mainEntity": c.faqs.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      },
    ],
  };
}

const SECTION = "max-w-[1600px] mx-auto px-5 md:px-20";
const H2 = "text-[28px] md:text-[40px] font-bold tracking-[-0.035em] leading-[1.1] text-[#16181a]";
export const TEXT_LINK = "font-semibold text-[#2d5a8a] hover:underline";

export function FeaturePage({ c }: { c: FeaturePageContent }) {
  return (
    <div className="bg-[#f0f2f3] min-h-screen text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(c)) }} />

      {/* HERO */}
      <section className={`${SECTION} pt-10 pb-14 md:pt-14 md:pb-20`}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            {/* Ko'k yorliq — breadcrumb ham: "Imkoniyatlar · Davomat" (ota sahifa bosiladi). Alohida qator yo'q. */}
            <nav aria-label="Breadcrumb" className="text-[14px] font-semibold text-[#5b87c0] md:text-[16px]">
              <Link href={c.parent.href} className="hover:underline">{c.parent.name}</Link>
              <span aria-hidden="true"> · </span>
              <span aria-current="page">{c.crumb}</span>
            </nav>
            <h1 className="mt-3 text-[40px] font-bold leading-[1.02] tracking-[-0.04em] md:text-[56px] xl:text-[64px]">{c.title}</h1>
            <p className="mt-5 max-w-[600px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">{c.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CrmApplyButton
                refSource={c.ref}
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
          <div style={PREVIEW_COLORS} className="flex min-h-[340px] items-center justify-center rounded-[28px] bg-[var(--s)] p-8 md:min-h-[420px]">
            <c.Preview />
          </div>
        </div>
      </section>

      {/* QISQACHA — asosiy faktlar */}
      {c.summary && (
        <section className={`${SECTION} pb-14 md:pb-20`}>
          <div className="rounded-[22px] bg-white p-6 ring-1 ring-[#e4e7ea] md:p-8">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#5b87c0]">Qisqacha</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {c.summary.map((s) => (
                <li key={s} className="flex gap-3 text-[15px] leading-relaxed md:text-[16px]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#5b87c0]" strokeWidth={3} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* QANDAY ISHLAYDI — savol + qisqa javob + qadamlar */}
      <section className={`${SECTION} pb-14 md:pb-20`}>
        <h2 className={`${H2} max-w-[760px]`}>{c.how.question}</h2>
        <p className="mt-4 max-w-[760px] text-[16px] leading-relaxed text-[#4b525c] md:text-[18px]">{c.how.answer}</p>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {c.how.steps.map((s, i) => (
            <li key={s.title} className="rounded-[22px] bg-white p-6 ring-1 ring-[#e4e7ea]">
              <span className="text-[13px] font-semibold tabular-nums text-[#5b87c0]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-[20px] font-bold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#5d6672]">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FOYDALAR */}
      <section className="bg-[#e8eaed] py-14 md:py-20">
        <div className={SECTION}>
          <h2 className={`${H2} max-w-[760px]`}>{c.benefits.question}</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {c.benefits.items.map((b) => (
              <li key={b.title} className="flex gap-4 rounded-[22px] bg-white p-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5b87c0]">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </span>
                <div>
                  <h3 className="text-[18px] font-bold tracking-[-0.02em]">{b.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#5d6672]">{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TAQQOSLASH — daftar/Excel va Darslinker */}
      {c.compare && (
        <section className={`${SECTION} pt-14 md:pt-20`}>
          <h2 className={`${H2} max-w-[760px]`}>{c.compare.question}</h2>
          <div className="mt-8 overflow-x-auto rounded-[22px] bg-white ring-1 ring-[#e4e7ea]">
            <table className="w-full min-w-[620px] text-left text-[15px]">
              <thead className="border-b border-[#e4e7ea] text-[13px] text-[#7c8490]">
                <tr>
                  <th className="w-[26%] p-4 font-semibold">Vazifa</th>
                  <th className="w-[37%] p-4 font-semibold">{c.compare.beforeLabel ?? "Daftar yoki Excel'da"}</th>
                  <th className="p-4 font-semibold">Darslinker&apos;da</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f3] align-top">
                {c.compare.rows.map(([task, before, after]) => (
                  <tr key={task}>
                    <td className="p-4 font-bold">{task}</td>
                    <td className="p-4 leading-relaxed text-[#7c8490]">{before}</td>
                    <td className="p-4 leading-relaxed">{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* BOG'LIQ — boshqa imkoniyatlar bilan aloqa */}
      <section className={`${SECTION} py-14 md:py-20`}>
        <div className="grid gap-6 rounded-[28px] bg-white p-7 ring-1 ring-[#e4e7ea] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="text-[24px] font-bold tracking-[-0.03em] md:text-[32px]">{c.related.title}</h2>
            <div className="mt-3 max-w-[720px] text-[15px] leading-relaxed text-[#5d6672] md:text-[17px]">{c.related.text}</div>
          </div>
          <Link href="/features" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#2d5a8a] hover:underline">
            Barcha imkoniyatlar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${SECTION} pb-14 md:pb-20`}>
        <div className="rounded-[20px] border border-[#e4e7ea] bg-white p-6 md:p-10">
          <h2 className="text-[24px] font-bold tracking-[-0.03em] md:text-[32px]">Ko&apos;p so&apos;raladigan savollar</h2>
          <div className="mt-6">
            <FaqList items={c.faqs} />
          </div>
        </div>
      </section>

      {/* YAKUNIY CTA */}
      <section className={`${SECTION} pb-16 md:pb-24`}>
        <div className="grid items-center gap-8 overflow-hidden rounded-[24px] bg-[#1e2024] p-8 text-white md:grid-cols-[1fr_auto] md:p-14">
          <div>
            <h2 className="text-[28px] font-bold leading-tight tracking-[-0.03em] md:text-[40px]">{c.cta.title}</h2>
            <p className="mt-3 max-w-[520px] text-[15px] text-white/60 md:text-[17px]">{c.cta.text}</p>
          </div>
          <CrmApplyButton refSource={c.ref} className="inline-flex h-[56px] items-center justify-center gap-2 rounded-[14px] bg-white px-8 text-[16px] font-semibold text-[#16181a] transition-colors hover:bg-white/90">
            Bepul sinab ko&apos;rish <ArrowRight className="h-4 w-4" />
          </CrmApplyButton>
        </div>
      </section>
    </div>
  );
}
