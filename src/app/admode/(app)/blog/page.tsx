"use client";

import { useState } from "react";
import { Check, ChevronDown, ExternalLink } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";
import { BLOG_PLAN, BLOG_PLAN_CLUSTERS, type BlogPlanCluster } from "@/data/blog-plan";
import { STATIC_BLOG_POSTS } from "@/data/static-blog-posts";

// Blog rejasi — faqat ko'rish uchun. Ro'yxat: src/data/blog-plan.ts, mezonlar: docs/crm-blog-plan.md.
// "Done" avtomatik: mavzu slug'i saytdagi maqolalar (STATIC_BLOG_POSTS) orasida bo'lsa.

const WRITTEN = new Set(STATIC_BLOG_POSTS.map((p) => p.slug));

type Row = { key: string; title: string; done: boolean; href?: string };

function Section({ title, rows, defaultOpen }: { title: string; rows: Row[]; defaultOpen: boolean }) {
  const { config } = useAdminTheme();
  const [open, setOpen] = useState(defaultOpen);
  const doneCount = rows.filter((r) => r.done).length;

  return (
    <div className="rounded-[14px]" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="flex-1 text-[15px] font-semibold" style={{ color: config.text }}>{title}</span>
        <span className="text-[13px] tabular-nums" style={{ color: config.textMuted }}>{doneCount}/{rows.length} done</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: config.textMuted }} />
      </button>
      {open && (
        <ol style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
          {rows.map((r, i) => (
            <li
              key={r.key}
              className="flex items-center gap-3 px-5 py-3"
              style={{ borderTop: i ? `1px solid ${config.surfaceBorder}` : undefined }}
            >
              <span className="w-6 shrink-0 text-[12px] tabular-nums" style={{ color: config.textDim }}>{i + 1}</span>
              <span className="flex-1 text-[14px]" style={{ color: r.done ? config.textMuted : config.text }}>{r.title}</span>
              {r.done && (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: "rgba(29,107,74,0.15)", color: "#3fb27f" }}>
                  <Check className="h-3 w-3" strokeWidth={3} /> Done
                </span>
              )}
              {r.href && (
                <a href={r.href} target="_blank" rel="noopener noreferrer" aria-label="Saytda ochish" style={{ color: config.textDim }}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function AdminBlogPlanPage() {
  const { config } = useAdminTheme();

  // Reja guruhlar bo'yicha: har guruh alohida ochiladigan bo'lim (birinchisi ochiq).
  const groups = (Object.keys(BLOG_PLAN_CLUSTERS) as BlogPlanCluster[]).map((cluster) => ({
    cluster,
    rows: BLOG_PLAN.filter((t) => t.cluster === cluster).map((t): Row => ({
      key: t.slug,
      title: t.title,
      done: WRITTEN.has(t.slug),
      href: WRITTEN.has(t.slug) ? `/blog/${t.slug}` : undefined,
    })),
  }));
  const planDone = BLOG_PLAN.filter((t) => WRITTEN.has(t.slug)).length;
  const planned = new Set(BLOG_PLAN.map((t) => t.slug));
  const published: Row[] = STATIC_BLOG_POSTS.filter((p) => !planned.has(p.slug)).map((p) => ({
    key: p.slug,
    title: p.title,
    done: true,
    href: `/blog/${p.slug}`,
  }));

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6 md:px-8 md:py-8">
      <h1 className="text-[22px] font-bold" style={{ color: config.text }}>Blog</h1>
      <p className="mt-1 text-[14px]" style={{ color: config.textMuted }}>
        CRM/LMS blog rejasi va saytdagi maqolalar. Maqola saytga qo&apos;shilsa, rejadagi mavzu avtomatik Done bo&apos;ladi.
      </p>

      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold" style={{ color: config.text }}>Rejadagi mavzular</h2>
        <span className="text-[13px] tabular-nums" style={{ color: config.textMuted }}>{planDone}/{BLOG_PLAN.length} done</span>
      </div>
      <div className="mt-3 space-y-3">
        {groups.map((g, i) => (
          <Section key={g.cluster} title={BLOG_PLAN_CLUSTERS[g.cluster]} rows={g.rows} defaultOpen={i === 0} />
        ))}
      </div>

      <h2 className="mt-8 text-[15px] font-semibold" style={{ color: config.text }}>Saytdagi boshqa maqolalar</h2>
      <div className="mt-3">
        <Section title="Avval yozilgan maqolalar" rows={published} defaultOpen={false} />
      </div>
    </div>
  );
}
