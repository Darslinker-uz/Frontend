"use client";

import { useEffect, useState } from "react";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";
import { AiKursCoursesPanel } from "@/components/ai/aikurs-courses-panel";
import type { Course } from "@/data/courses";
import { apiListingToCourse, type ApiListing } from "@/lib/listing-mapper";

const AIKURS_SESSION_KEY = "darslinker_aikurs_session";

export function AiKursPageClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/listings?limit=12");
        if (!res.ok) throw new Error("API xato");
        const data = (await res.json()) as { listings?: ApiListing[] };
        if (!cancelled) {
          setCourses((data.listings ?? []).map(apiListingToCourse));
          setCoursesError(null);
        }
      } catch {
        if (!cancelled) {
          setCourses([]);
          setCoursesError("Kurslar yuklanmadi. DATABASE_URL sozlamasini tekshiring.");
        }
      } finally {
        if (!cancelled) setCoursesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden md:flex-row">
      <aside className="flex h-[42vh] min-h-[300px] w-full shrink-0 flex-col border-b border-[#dce6f2] md:h-full md:w-[30%] md:min-w-[280px] md:max-w-[420px] md:border-b-0 md:border-r">
        <AiChatWidget variant="panel" sessionKey={AIKURS_SESSION_KEY} className="h-full" />
      </aside>
      <AiKursCoursesPanel courses={courses} loading={coursesLoading} error={coursesError} />
    </div>
  );
}
