"use client";

import { useCallback, useEffect, useState } from "react";
import { AiKursMiniChatDock } from "@/components/ai/aikursmini-chat-dock";
import { AiKursMiniCoursesPanel } from "@/components/ai/aikursmini-courses-panel";
import { useAiChat } from "@/components/ai/use-ai-chat";
import type { WebAiUi } from "@/lib/web-ai";
import type { Course } from "@/data/courses";
import { apiListingToCourse, type ApiListing } from "@/lib/listing-mapper";

const AIKURSMINI_SESSION_KEY = "darslinker_aikursmini_session";

async function fetchCoursesByIds(ids: number[]): Promise<Course[]> {
  if (!ids.length) return [];
  const res = await fetch(`/api/listings?ids=${ids.join(",")}`);
  if (!res.ok) throw new Error("API xato");
  const data = (await res.json()) as { listings?: ApiListing[] };
  const byId = new Map((data.listings ?? []).map(l => [l.id, apiListingToCourse(l)]));
  return ids.map(id => byId.get(id)).filter((c): c is Course => Boolean(c));
}

async function fetchPopularCourses(): Promise<Course[]> {
  const res = await fetch("/api/listings?limit=24");
  if (!res.ok) return [];
  const data = (await res.json()) as { listings?: ApiListing[] };
  return (data.listings ?? []).map(apiListingToCourse);
}

export function AiKursMiniPageClient() {
  const [chatExpanded, setChatExpanded] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [coursesTitle, setCoursesTitle] = useState("Kurslar");
  const [coursesSubtitle, setCoursesSubtitle] = useState("Mashhur kurslar — AI bilan qidiring");
  const [isRanked, setIsRanked] = useState(false);

  const chat = useAiChat(AIKURSMINI_SESSION_KEY);
  const hasUserMessage = chat.messages.some(m => m.role === "user");
  const showMatchButton = !hasUserMessage;

  const loadPanelCourses = useCallback(async (ui: Extract<WebAiUi, { kind: "courses" }>) => {
    setCoursesTitle(ui.title.replace(/^[^\w\u0400-\u04FF]+/u, "").trim() || "Mos kurslar");
    setCoursesSubtitle(`${ui.total} ta kurs — eng moslari yuqorida`);
    setIsRanked(true);
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const ids = ui.resultIds?.length ? ui.resultIds : ui.courses.map(c => c.id);
      setCourses(await fetchCoursesByIds(ids));
    } catch {
      setCourses([]);
      setCoursesError("Kurslar yuklanmadi");
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    void chat.ensureInit();
  }, [chat.ensureInit]);

  useEffect(() => {
    if (chat.ui?.kind !== "courses") return;
    void loadPanelCourses(chat.ui);
  }, [chat.ui, loadPanelCourses]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setCoursesLoading(true);
      try {
        const popular = await fetchPopularCourses();
        if (!cancelled) {
          setCourses(popular);
          setIsRanked(false);
          setCoursesError(null);
        }
      } catch {
        if (!cancelled) setCoursesError("Kurslar yuklanmadi");
      } finally {
        if (!cancelled) setCoursesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#f0f2f3";
    document.documentElement.style.backgroundColor = "#f0f2f3";
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="aikursmini-root relative h-[100dvh] overflow-hidden bg-[#f0f2f3]">
      <AiKursMiniCoursesPanel
        courses={courses}
        loading={coursesLoading}
        error={coursesError}
        title={coursesTitle}
        subtitle={coursesSubtitle}
        ranked={isRanked && courses.length > 0}
      />
      <AiKursMiniChatDock
        chat={chat}
        expanded={chatExpanded}
        onToggleExpanded={() => setChatExpanded(v => !v)}
        showMatchButton={showMatchButton}
      />
    </div>
  );
}
