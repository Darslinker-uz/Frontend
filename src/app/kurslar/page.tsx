"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Star, ArrowRight } from "lucide-react";
import { courses as allCourses, type Course } from "@/data/courses";
import { CourseFilter } from "@/components/course-filter";

function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  return (
    <Link href={`/kurslar/${course.categorySlug}/${course.slug}`} style={{ animationDelay: `${index * 80}ms` }} className="animate-[cardStagger_0.4s_ease-out_backwards]">
      <div className={`relative overflow-hidden rounded-[18px] bg-gradient-to-br ${course.gradient} flex flex-col h-full group`}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-0 group-hover:backdrop-blur-[2px] transition-all duration-300 z-[1]" />
        <div className="relative z-[2] p-5 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">{course.category}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/60 text-[11px]">{course.format}</span>
          </div>
          <h3 className="text-[17px] font-bold text-white leading-tight">{course.title}</h3>
          <p className="text-[12px] text-white/35 mt-1">{course.provider} · {course.location}</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-white/30">
            <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-white/50 text-white/50" />{course.rating}</span>
            <span>{course.duration}</span>
          </div>
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

function KurslarContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialFormat = searchParams.get("format") || "";
  const [filtered, setFiltered] = useState<Course[]>(allCourses);
  const [filterKey, setFilterKey] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleFilter = useCallback((courses: Course[]) => {
    setFiltered(courses);
    setFilterKey(k => k + 1);
  }, []);

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#16181a] mb-4 md:hidden">Kurslar</h1>
        <div className="md:flex">
          <CourseFilter key={`${initialSearch}-${initialFormat}`} courses={allCourses} onFilter={handleFilter} initialSearch={initialSearch} initialFormat={initialFormat}>
            <CourseGrid courses={filtered} filterKey={filterKey} />
          </CourseFilter>
        </div>
        {/* Mobil — kurslar CourseFilter dan tashqarida */}
        <div className="md:hidden mt-4">
          <CourseGrid courses={filtered} filterKey={filterKey} />
        </div>
      </div>
    </div>
  );
}

export default function KurslarPage() {
  return (
    <Suspense>
      <KurslarContent />
    </Suspense>
  );
}
