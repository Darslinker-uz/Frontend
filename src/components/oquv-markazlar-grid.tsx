"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Star, ShieldCheck, BookOpen, MapPin } from "lucide-react";

export type CenterCard = {
  slug?: string;
  provider: string;
  categories: string[];
  regions: string[];
  avgRating: number;
  ratingCount: number;
  courseCount: number;
  imageUrl: string | null | undefined;
  gradient: string;
  firstSlug: string;
  firstCategorySlug: string;
};

type Props = {
  centers: CenterCard[];
  pageSize?: number;
};

export function OquvMarkazlarGrid({ centers, pageSize = 12 }: Props) {
  const [page, setPage] = useState(0);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const totalPages = Math.max(1, Math.ceil(centers.length / pageSize));
  const start = page * pageSize;
  const end = Math.min(start + pageSize, centers.length);
  const pageCenters = centers.slice(start, end);

  const goTo = (target: number) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, target));
    if (clamped === page) return;
    setPage(clamped);
    // Smooth scroll to grid top
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 scroll-mt-24"
      >
        {pageCenters.map((center) => {
          const rating = center.avgRating > 0 ? center.avgRating.toFixed(1) : null;
          const initial = center.provider.charAt(0).toUpperCase();
          const visibleCategories = center.categories.slice(0, 2);
          const moreCategories = center.categories.length - visibleCategories.length;
          const href = center.slug
            ? `/oquv-markazlar/${center.slug}`
            : center.firstSlug && center.firstCategorySlug
              ? `/kurslar/${center.firstCategorySlug}/${center.firstSlug}`
              : "/kurslar";
          return (
            <Link
              key={center.provider}
              href={href}
              className="group relative bg-white rounded-[20px] border border-[#e4e7ea] p-5 md:p-6 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
            >
              {/* Top: avatar + name + rating */}
              <div className="flex items-start gap-3.5">
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-[14px] flex items-center justify-center text-white text-[24px] md:text-[28px] font-extrabold shrink-0 shadow-md"
                  style={{ background: center.gradient }}
                >
                  {center.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={center.imageUrl} alt={center.provider} className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    initial
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10.5px] font-bold text-emerald-700 tracking-wider uppercase">Tekshirilgan</span>
                  </div>
                  <h3 className="text-[17px] md:text-[19px] font-bold text-[#16181a] tracking-[-0.02em] leading-tight line-clamp-2">
                    {center.provider}
                  </h3>
                  {rating && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[13px] font-bold text-[#16181a]">{rating}</span>
                      <span className="text-[11.5px] text-[#7c8490]">({center.ratingCount} sharh)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Aggregate metrics */}
              <div className="flex items-center gap-4 mt-5 pt-5 border-t border-[#f2f4f5]">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#7c8490]" />
                  <span className="text-[12.5px] text-[#16181a]">
                    <span className="font-bold">{center.courseCount}</span>
                    <span className="text-[#7c8490] ml-1">kurs</span>
                  </span>
                </div>
                {center.regions.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7c8490]" />
                    <span className="text-[12.5px] text-[#16181a]">
                      <span className="font-bold">{center.regions.length}</span>
                      <span className="text-[#7c8490] ml-1">joy</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Categories */}
              {visibleCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  {visibleCategories.map((cat) => (
                    <span key={cat} className="text-[11.5px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
                      {cat}
                    </span>
                  ))}
                  {moreCategories > 0 && (
                    <span className="text-[11.5px] font-medium text-[#7c8490] bg-[#f2f4f5] rounded-full px-2.5 py-0.5">
                      +{moreCategories}
                    </span>
                  )}
                </div>
              )}

              {/* Hover arrow */}
              <div className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 rounded-full bg-[#f2f4f5] group-hover:bg-emerald-600 flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-[#7c8490] group-hover:text-white transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 md:mt-10 flex items-center justify-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Oldingisi"
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-[#e4e7ea] flex items-center justify-center text-[#16181a] hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40 disabled:hover:border-[#e4e7ea] disabled:hover:text-[#16181a] disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="inline-flex items-baseline gap-1 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white border border-[#e4e7ea] text-[13px] md:text-[14px] tabular-nums">
            <span className="font-bold text-[#16181a]">{start + 1}–{end}</span>
            <span className="text-[#7c8490]">/</span>
            <span className="text-[#7c8490]">{centers.length} markaz</span>
          </div>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages - 1}
            aria-label="Keyingisi"
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-[#e4e7ea] flex items-center justify-center text-[#16181a] hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40 disabled:hover:border-[#e4e7ea] disabled:hover:text-[#16181a] disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      )}
    </>
  );
}
