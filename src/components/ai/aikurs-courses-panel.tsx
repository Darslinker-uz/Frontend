"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, Eye, Star } from "lucide-react";
import { type Course, MIN_RATINGS_TO_SHOW } from "@/data/courses";

export function AiKursCourseCard({
  course,
  index = 0,
  rank,
}: {
  course: Course;
  index?: number;
  rank?: number;
}) {
  return (
    <Link
      href={`/kurslar/${course.categorySlug}/${course.slug}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="animate-[cardStagger_0.4s_ease-out_backwards] block h-full"
    >
      <div
        className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br ${course.gradient} flex flex-col h-full group`}
      >
        {course.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.imageUrl}
              alt={course.title}
              className="absolute inset-0 hidden h-full w-full object-cover md:block"
              style={{
                objectPosition: `${course.imageCPosX ?? 50}% ${course.imageCPosY ?? 50}%`,
                transform: `scale(${(course.imageCZoom ?? 100) / 100})`,
                transformOrigin: `${course.imageCPosX ?? 50}% ${course.imageCPosY ?? 50}%`,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.imageUrl}
              alt={course.title}
              className="absolute inset-0 h-full w-full object-cover md:hidden"
              style={{
                objectPosition: `${course.imageCMPosX ?? 50}% ${course.imageCMPosY ?? 50}%`,
                transform: `scale(${(course.imageCMZoom ?? 100) / 100})`,
                transformOrigin: `${course.imageCMPosX ?? 50}% ${course.imageCMPosY ?? 50}%`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${(course.imageDarkness ?? 15) / 100})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/85" />
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
        )}
        <div className="relative z-[2] flex flex-1 flex-col p-4">
          {rank != null && rank <= 3 && (
            <span
              className={`mb-2 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                rank === 1
                  ? "bg-amber-400/90 text-amber-950"
                  : rank === 2
                    ? "bg-white/25 text-white"
                    : "bg-white/15 text-white/90"
              }`}
            >
              {rank === 1 ? "🥇 Eng mos" : rank === 2 ? "🥈 2-o'rin" : "🥉 3-o'rin"}
            </span>
          )}
          <div className="mb-2 flex items-center gap-2">
            {!course.title.toLowerCase().includes(course.category.toLowerCase()) && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                {course.category}
              </span>
            )}
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
              {course.format}
            </span>
          </div>
          <h3 className="text-[20px] font-bold leading-tight text-white">{course.title}</h3>
          <p className="mt-1 text-[11px] text-white/35">
            {course.provider} · {course.location}
          </p>
          {(course.duration && course.duration !== "—") ||
          (course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW ||
          (course.views ?? 0) > 0 ? (
            <div className="mt-2 flex items-center gap-2 text-[10px] text-white/40">
              {(course.ratingCount ?? 0) >= MIN_RATINGS_TO_SHOW && (
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {(course.ratingAvg ?? 0).toFixed(1)}
                </span>
              )}
              {course.duration && course.duration !== "—" && <span>{course.duration}</span>}
              {(course.views ?? 0) > 0 && (
                <span className="flex items-center gap-0.5">
                  <Eye className="h-3 w-3" />
                  {course.views}
                </span>
              )}
            </div>
          ) : null}
        </div>
        <div className="relative z-[2] mx-3 mb-3 flex items-center justify-between rounded-[10px] border border-white/[0.08] bg-white/[0.1] px-3 py-2">
          <span className="text-[13px] font-bold text-white">
            {course.priceFree ? "Bepul" : `${course.price} so'm`}
          </span>
          <ArrowRight className="h-4 w-4 text-white/30" />
        </div>
      </div>
    </Link>
  );
}

export function AiKursCoursesPanel({
  courses,
  loading = false,
  error = null,
  title = "Kurslar",
  subtitle = "AI maslahatchi yonida tanlang va solishtiring",
  compactHeader = false,
}: {
  courses: Course[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  compactHeader?: boolean;
}) {
  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f0f2f3]">
      <header
        className={`flex shrink-0 items-center gap-3 border-b border-[#e4e7ea] bg-white ${
          compactHeader ? "px-4 py-3" : "px-4 py-3 sm:px-6"
        }`}
      >
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
        {!compactHeader && (
          <Link
            href="/kurslar"
            className="ml-auto hidden shrink-0 rounded-full border border-[#7ea2d4]/40 px-3 py-1.5 text-[12px] font-medium text-[#2d5a8a] hover:bg-[#eef4fc] sm:inline-flex"
          >
            Barcha kurslar
          </Link>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] animate-pulse rounded-[16px] bg-[#e4e7ea]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#e4e7ea] bg-white py-16 px-6 text-center">
            <p className="text-[15px] font-medium text-[#7c8490]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border border-[#7ea2d4]/40 px-4 py-2 text-[13px] font-medium text-[#2d5a8a] hover:bg-[#eef4fc]"
            >
              Qayta urinish
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-[#e4e7ea] bg-white py-16">
            <p className="text-[15px] font-medium text-[#7c8490]">Kurs topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {courses.map((course, i) => (
              <AiKursCourseCard key={course.slug} course={course} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
