"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Star } from "lucide-react";
import { type Course, MIN_RATINGS_TO_SHOW } from "@/data/courses";
import { CourseFilter, type FilterGroup, type FilterRegion } from "@/components/course-filter";
import { LocationBanner } from "@/components/location-banner";

const PAGE_SIZE = 12;

interface LocationFilterInfo {
  region: string | null;
  district: string | null;
  fallback: { from: "district" | "region"; to: "region" | "all"; nearby: number; expanded: number } | null;
}

function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  return (
    <Link href={`/kurslar/${course.categorySlug}/${course.slug}`} style={{ animationDelay: `${index * 80}ms` }} className="animate-[cardStagger_0.4s_ease-out_backwards]">
      <div className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br ${course.gradient} flex flex-col h-full group`}>
        {course.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={course.imageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover hidden md:block" style={{ objectPosition: `${course.imageCPosX ?? 50}% ${course.imageCPosY ?? 50}%`, transform: `scale(${(course.imageCZoom ?? 100) / 100})`, transformOrigin: `${course.imageCPosX ?? 50}% ${course.imageCPosY ?? 50}%` }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={course.imageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover md:hidden" style={{ objectPosition: `${course.imageCMPosX ?? 50}% ${course.imageCMPosY ?? 50}%`, transform: `scale(${(course.imageCMZoom ?? 100) / 100})`, transformOrigin: `${course.imageCMPosX ?? 50}% ${course.imageCMPosY ?? 50}%` }} />
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(course.imageDarkness ?? 15) / 100})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/85" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        )}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-300 z-[1]" />
        <div className="relative z-[2] p-5 flex-1">
          <div className="flex items-center gap-2 mb-3">
            {!course.title.toLowerCase().includes(course.category.toLowerCase()) && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">{course.category}</span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px]">{course.format}</span>
          </div>
          <h3 className="text-[17px] font-bold text-white leading-tight">{course.title}</h3>
          <p className="text-[12px] text-white/35 mt-1">{course.provider} · {course.location}</p>
          {(course.duration && course.duration !== "—") || (course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW || (course.views ?? 0) > 0 ? (
            <div className="flex items-center gap-2 mt-2 text-[11px] text-white/40">
              {(course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW && (
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{(course.ratingAvg ?? 0).toFixed(1)} <span className="text-white/30">({course.ratingCount})</span></span>
              )}
              {course.duration && course.duration !== "—" && <span>{course.duration}</span>}
              {(course.views ?? 0) > 0 && (
                <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{course.views}</span>
              )}
            </div>
          ) : null}
        </div>
        <div className="relative z-[2] mx-3 mb-3 rounded-[12px] bg-white/[0.1] border border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
          <span className="text-[14px] font-bold text-white">{course.priceFree ? "Bepul" : `${course.price} so'm`}</span>
          <ArrowRight className="w-4 h-4 text-white/30" />
        </div>
      </div>
    </Link>
  );
}

function CourseGrid({ courses, filterKey }: { courses: Course[]; filterKey: number }) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-20 rounded-[18px] bg-white border border-[#e4e7ea]">
        <p className="text-[16px] text-[#7c8490] font-medium">Kurs topilmadi</p>
        <p className="text-[13px] text-[#7c8490]/60 mt-1">Filtrlarni o&apos;zgartirib ko&apos;ring</p>
      </div>
    );
  }
  return (
    <div key={filterKey} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course, i) => <CourseCard key={course.slug} course={course} index={i} />)}
    </div>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const range: (number | "...")[] = [];
  const add = (p: number | "...") => { if (range[range.length - 1] !== p) range.push(p); };
  add(1);
  if (page > 3) add("...");
  for (let p = Math.max(2, page - 1); p <= Math.min(total - 1, page + 1); p++) add(p);
  if (page < total - 2) add("...");
  if (total > 1) add(total);

  const btn = "h-[36px] min-w-[36px] px-3 rounded-[8px] text-[13px] font-medium flex items-center justify-center transition-colors";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 mb-4 flex-wrap">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`${btn} bg-white border border-[#7ea2d4]/30 text-[#7ea2d4] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7ea2d4]/10 hover:border-[#7ea2d4]`}
        aria-label="Oldingi sahifa"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {range.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="px-2 text-[13px] text-[#7c8490]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={p === page
              ? `${btn} bg-[#7ea2d4] text-white`
              : `${btn} bg-white border border-[#e4e7ea] text-[#16181a] hover:bg-[#f0f2f3]`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        className={`${btn} bg-white border border-[#7ea2d4]/30 text-[#7ea2d4] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7ea2d4]/10 hover:border-[#7ea2d4]`}
        aria-label="Keyingi sahifa"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

const EMPTY_LOCATION_FILTER: LocationFilterInfo = { region: null, district: null, fallback: null };

function KurslarContent({ initialCourses, locationFilter, groups, regions }: { initialCourses: Course[]; locationFilter: LocationFilterInfo; groups: FilterGroup[]; regions: FilterRegion[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialSearch = searchParams.get("search") || "";
  const initialFormat = searchParams.get("format") || "";
  const initialPage = Math.max(1, Number(searchParams.get("page") ?? 1));
  const [filtered, setFiltered] = useState<Course[]>(initialCourses);
  const [filterKey, setFilterKey] = useState(0);
  const [page, setPage] = useState(initialPage);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleFilter = useCallback((courses: Course[]) => {
    setFiltered(courses);
    setFilterKey(k => k + 1);
    setPage(1); // filter o'zgargach 1-sahifaga qaytamiz
  }, []);

  // Joriy sahifa kurslari
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageCourses = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  // Sahifa o'zgarganda URL ham yangilanadi (?page=N) va yuqoriga scroll
  const goToPage = useCallback((p: number) => {
    setPage(p);
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) params.delete("page"); else params.set("page", String(p));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // React re-render'dan keyin scroll — oxirgi sahifada (kontent kamayganda)
    // browser'ning auto-scroll xatti-harakati to'sib qolishini oldini olish uchun
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    });
  }, [searchParams, router, pathname]);

  return (
    <>
      <LocationBanner
        region={locationFilter.region}
        district={locationFilter.district}
        fallback={locationFilter.fallback}
      />
      <div className="md:flex">
        <CourseFilter
          key={`${initialSearch}-${initialFormat}`}
          courses={initialCourses}
          groups={groups}
          regions={regions}
          onFilter={handleFilter}
          initialSearch={initialSearch}
          initialFormat={initialFormat}
        >
          <CourseGrid courses={pageCourses} filterKey={filterKey} />
          <Pagination page={safePage} total={totalPages} onChange={goToPage} />
        </CourseFilter>
      </div>
      <div className="md:hidden mt-4">
        <CourseGrid courses={pageCourses} filterKey={filterKey} />
        <Pagination page={safePage} total={totalPages} onChange={goToPage} />
      </div>
    </>
  );
}

export function KurslarClient({ initialCourses, locationFilter, groups = [], regions = [] }: { initialCourses: Course[]; locationFilter?: LocationFilterInfo; groups?: FilterGroup[]; regions?: FilterRegion[] }) {
  return (
    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{initialCourses.slice(0, 6).map((c, i) => <CourseCard key={c.slug} course={c} index={i} />)}</div>}>
      <KurslarContent initialCourses={initialCourses} locationFilter={locationFilter ?? EMPTY_LOCATION_FILTER} groups={groups} regions={regions} />
    </Suspense>
  );
}
