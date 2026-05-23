"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AiKursCourseCard } from "@/components/ai/aikurs-courses-panel";
import type { Course } from "@/data/courses";

export function AiKursMiniCoursesPanel({
  courses,
  loading = false,
  error = null,
  title = "Kurslar",
  subtitle = "AI yordamida mos kurslarni toping",
  ranked = false,
}: {
  courses: Course[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  /** AI natijasi: 1–3 eng mos, qolganlari «shunga o'xshash» */
  ranked?: boolean;
}) {
  const top = ranked ? courses.slice(0, 3) : [];
  const similar = ranked ? courses.slice(3) : courses;

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f0f2f3]">
      <header className="flex shrink-0 items-center gap-3 border-b border-[#e4e7ea] bg-white px-4 py-3">
        <Link
          href="/"
          aria-label="Asosiy sahifaga qaytish"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#dce6f2] bg-[#f8fafb] text-[#2d5a8a] transition hover:bg-[#eef4fc]"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-[#16181a] sm:text-lg">{title}</h1>
          <p className="truncate text-[12px] text-[#6a7585]">{subtitle}</p>
        </div>
        <Link
          href="/kurslar"
          className="shrink-0 rounded-full border border-[#7ea2d4]/40 px-3 py-1.5 text-[11px] font-medium text-[#2d5a8a] hover:bg-[#eef4fc] sm:text-[12px]"
        >
          Katalog
        </Link>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[220px] animate-pulse rounded-[16px] bg-[#e4e7ea]" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#e4e7ea] bg-white py-16 px-6 text-center">
            <p className="text-[15px] font-medium text-[#7c8490]">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#e4e7ea] bg-white py-16 px-6 text-center">
            <p className="text-[15px] font-medium text-[#7c8490]">Kurs topilmadi</p>
            <p className="mt-2 text-[13px] text-[#9aa3ad]">
              Pastdagi AI chatga yozing — masalan: «ingliz tili boshlang&apos;ich»
            </p>
          </div>
        ) : ranked && top.length > 0 ? (
          <div className="space-y-8">
            <div>
              <h2 className="mb-3 text-sm font-semibold text-[#2d5a8a]">Eng mos kurslar</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {top.map((course, i) => (
                  <AiKursCourseCard key={course.slug} course={course} index={i} rank={i + 1} />
                ))}
              </div>
            </div>
            {similar.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold text-[#6a7585]">
                  Shunga o&apos;xshash kurslar ({similar.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {similar.map((course, i) => (
                    <AiKursCourseCard key={course.slug} course={course} index={i + 3} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((course, i) => (
              <AiKursCourseCard key={course.slug} course={course} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
