"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, BookOpen, ShieldCheck, Star, Filter, X, Award, Search } from "lucide-react";

// Karta uchun yetarli ma'lumot — phone/telegram/etc. detail sahifada kerak, bu yerda emas
type CenterCardItem = {
  slug: string;
  provider: string;
  description: string;
  categories: string[];
  regions: string[];
  avgRating: number;
  ratingCount: number;
  courseCount: number;
  imageUrl: string | null;
  gradient: string;
  firstSlug: string;
  firstCategorySlug: string;
  certificate: boolean;
};

type Props = {
  centers: CenterCardItem[];
  regions: string[];
  categories: string[];
};

type Sort = "rating" | "reviews" | "courses";

const PAGE_SIZE = 12;

export function OquvMarkazlarBarchasiClient({ centers, regions, categories }: Props) {
  const [region, setRegion] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [certificateOnly, setCertificateOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<Sort>("rating");
  const [page, setPage] = useState<number>(0);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return centers
      .filter((c) => {
        if (region && !c.regions.includes(region)) return false;
        if (category && !c.categories.includes(category)) return false;
        if (certificateOnly && !c.certificate) return false;
        if (lowerSearch && !c.provider.toLowerCase().includes(lowerSearch)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "rating") return b.avgRating - a.avgRating || b.ratingCount - a.ratingCount;
        if (sort === "reviews") return b.ratingCount - a.ratingCount;
        return b.courseCount - a.courseCount;
      });
  }, [centers, region, category, certificateOnly, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filtered.length);
  const pageItems = filtered.slice(start, end);

  const goTo = (target: number) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, target));
    setPage(clamped);
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const resetFilters = () => {
    setRegion("");
    setCategory("");
    setSearch("");
    setCertificateOnly(false);
    setSort("rating");
    setPage(0);
  };

  const hasActiveFilters = region || category || search || certificateOnly || sort !== "rating";

  return (
    <div className="max-w-[1600px] mx-auto px-5 md:px-20 pb-16 md:pb-20">
      {/* FILTER BAR */}
      <div className="bg-white border border-[#e4e7ea] rounded-[18px] p-3 md:p-4 mb-6 md:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 md:gap-3 items-stretch">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 bg-[#f8fbfa] border border-[#e4e7ea] rounded-[12px]">
            <Search className="w-4 h-4 text-[#7c8490] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Markaz nomini yozing..."
              className="flex-1 bg-transparent text-[14px] text-[#16181a] py-2.5 outline-none placeholder:text-[#7c8490]"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-[#7c8490] hover:text-[#16181a]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region */}
          <div className="flex items-center gap-2 px-3 bg-[#f8fbfa] border border-[#e4e7ea] rounded-[12px]">
            <MapPin className="w-4 h-4 text-[#7c8490] shrink-0" />
            <select
              value={region}
              onChange={(e) => { setRegion(e.target.value); setPage(0); }}
              className="flex-1 bg-transparent text-[14px] text-[#16181a] py-2.5 outline-none cursor-pointer"
            >
              <option value="">Barcha joylar</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 px-3 bg-[#f8fbfa] border border-[#e4e7ea] rounded-[12px]">
            <BookOpen className="w-4 h-4 text-[#7c8490] shrink-0" />
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(0); }}
              className="flex-1 bg-transparent text-[14px] text-[#16181a] py-2.5 outline-none cursor-pointer"
            >
              <option value="">Barcha yo&apos;nalishlar</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#16181a] text-white text-[13px] font-semibold hover:bg-[#26282c] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Tozalash
            </button>
          )}
        </div>

        {/* Secondary row — certificate toggle + sort */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-3 pt-3 border-t border-[#f2f4f5]">
          <button
            type="button"
            onClick={() => { setCertificateOnly(v => !v); setPage(0); }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
              certificateOnly
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-white border-[#e4e7ea] text-[#16181a]/70 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Sertifikatli
          </button>

          <div className="ml-auto flex items-center gap-2 text-[12.5px]">
            <span className="text-[#7c8490]">Tartiblash:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as Sort); setPage(0); }}
              className="bg-transparent border border-[#e4e7ea] rounded-full px-2.5 py-1 text-[#16181a] font-medium outline-none cursor-pointer hover:border-emerald-300"
            >
              <option value="rating">Reyting bo&apos;yicha</option>
              <option value="reviews">Sharhlar soni</option>
              <option value="courses">Kurslar soni</option>
            </select>
          </div>
        </div>
      </div>

      {/* RESULT COUNT + EMPTY STATE */}
      <div className="flex items-center justify-between gap-3 mb-4 md:mb-5">
        <p className="text-[13px] md:text-[14px] text-[#7c8490]">
          <span className="font-bold text-[#16181a]">{filtered.length}</span> markaz topildi
          {hasActiveFilters && <span className="ml-2 text-emerald-700">(filtr qo&apos;llanildi)</span>}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e4e7ea] rounded-[20px] p-10 md:p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#f2f4f5] flex items-center justify-center mx-auto mb-4">
            <Filter className="w-6 h-6 text-[#7c8490]" />
          </div>
          <h3 className="text-[18px] md:text-[20px] font-bold text-[#16181a]">Hech qanday markaz topilmadi</h3>
          <p className="text-[13px] md:text-[14px] text-[#7c8490] mt-2 max-w-[420px] mx-auto">Filtrni o&apos;zgartiring yoki tozalang — qidiruv mezonlari bo&apos;yicha mos markaz yo&apos;q.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition-colors"
          >
            Filtrni tozalash
          </button>
        </div>
      ) : (
        <>
          {/* GRID */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 scroll-mt-24"
          >
            {pageItems.map((center) => {
              const rating = center.avgRating > 0 ? center.avgRating.toFixed(1) : null;
              const initial = center.provider.charAt(0).toUpperCase();
              const visibleCategories = center.categories.slice(0, 2);
              const moreCategories = center.categories.length - visibleCategories.length;
              const href = `/oquv-markazlar/${center.slug}`;
              return (
                <Link
                  key={center.provider}
                  href={href}
                  className="group relative bg-white rounded-[20px] border border-[#e4e7ea] p-5 md:p-6 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/5 transition-all"
                >
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
                    {center.certificate && (
                      <div className="flex items-center gap-1 ml-auto text-[11px] font-medium text-emerald-700">
                        <Award className="w-3 h-3" />
                        Sertifikat
                      </div>
                    )}
                  </div>

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

                  <div className="absolute top-5 right-5 md:top-6 md:right-6 w-8 h-8 rounded-full bg-[#f2f4f5] group-hover:bg-emerald-600 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-[#7c8490] group-hover:text-white transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 md:mt-10 flex items-center justify-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => goTo(safePage - 1)}
                disabled={safePage === 0}
                aria-label="Oldingisi"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-[#e4e7ea] flex items-center justify-center text-[#16181a] hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40 disabled:hover:border-[#e4e7ea] disabled:hover:text-[#16181a] disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <div className="inline-flex items-baseline gap-1 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white border border-[#e4e7ea] text-[13px] md:text-[14px] tabular-nums">
                <span className="font-bold text-[#16181a]">{start + 1}–{end}</span>
                <span className="text-[#7c8490]">/</span>
                <span className="text-[#7c8490]">{filtered.length} markaz</span>
              </div>

              <button
                type="button"
                onClick={() => goTo(safePage + 1)}
                disabled={safePage >= totalPages - 1}
                aria-label="Keyingisi"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-[#e4e7ea] flex items-center justify-center text-[#16181a] hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-40 disabled:hover:border-[#e4e7ea] disabled:hover:text-[#16181a] disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
