"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, Mic, Send, Sparkles, Target } from "lucide-react";
import { AiKursChatPanel } from "@/components/ai/aikurs-chat-panel";
import { AiKursCoursesPanel } from "@/components/ai/aikurs-courses-panel";
import { useAiChat } from "@/components/ai/use-ai-chat";
import type { WebAiAction, WebAiUi } from "@/lib/web-ai";
import type { Course } from "@/data/courses";
import { apiListingToCourse, type ApiListing } from "@/lib/listing-mapper";

const AIKURS_SESSION_KEY = "darslinker_aikurs_session";

const LANDING_HEADING = "Kurs toping va AI bilan solishtiring";

async function fetchCoursesByIds(ids: number[]): Promise<Course[]> {
  if (!ids.length) return [];
  const res = await fetch(`/api/listings?ids=${ids.join(",")}`);
  if (!res.ok) throw new Error("API xato");
  const data = (await res.json()) as { listings?: ApiListing[] };
  return (data.listings ?? []).map(apiListingToCourse);
}

export function AiKursPageClient() {
  const [started, setStarted] = useState(false);
  const [landingInput, setLandingInput] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [coursesTitle, setCoursesTitle] = useState("Kurslar");

  const chat = useAiChat(AIKURS_SESSION_KEY);

  const isSplit = chat.ui?.kind === "courses";

  const loadPanelCourses = useCallback(async (ui: Extract<WebAiUi, { kind: "courses" }>) => {
    setCoursesTitle(ui.title.replace(/^[^\w\u0400-\u04FF]+/u, "").trim() || "Mos kurslar");
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
    if (chat.ui?.kind !== "courses") return;
    void loadPanelCourses(chat.ui);
  }, [chat.ui, loadPanelCourses]);

  useEffect(() => {
    if (!isSplit) return;
    document.body.style.backgroundColor = "#f0f2f3";
    document.documentElement.style.backgroundColor = "#f0f2f3";
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, [isSplit]);

  const startChat = async (action: WebAiAction, userLabel?: string) => {
    setStarted(true);
    await chat.ensureInit();
    chat.queueAction(action, userLabel);
  };

  const submitLanding = () => {
    const text = landingInput.trim();
    if (!text) return;
    setLandingInput("");
    void startChat({ type: "message", text }, text);
  };

  const backToLanding = () => {
    setStarted(false);
    setCourses([]);
    chat.setInput("");
  };

  if (isSplit) {
    return (
      <div className="aikurs-split-root flex h-[100dvh] flex-col overflow-hidden md:flex-row">
        <div className="aikurs-split-courses flex min-h-0 min-w-0 flex-1 flex-col">
          <AiKursCoursesPanel
            courses={courses}
            loading={coursesLoading}
            error={coursesError}
            title={coursesTitle}
            subtitle="AI filtri bo'yicha mos kurslar"
            compactHeader
          />
        </div>
        <aside className="aikurs-split-chat flex h-[45vh] min-h-[280px] w-full shrink-0 flex-col border-t border-[#dce6f2] md:h-full md:w-[32%] md:min-w-[300px] md:max-w-[400px] md:border-t-0 md:border-l">
          <AiKursChatPanel chat={chat} variant="split" coursesInSidebar />
        </aside>
      </div>
    );
  }

  if (started) {
    return (
      <div className="aikurs-chat-enter ai-landing ai-landing--day relative flex min-h-[100dvh] flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="ai-landing-glow absolute left-1/2 top-[30%] h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>
        <AiKursChatPanel chat={chat} variant="full" onBack={backToLanding} />
      </div>
    );
  }

  return (
    <div className="aikurs-landing-enter ai-landing ai-landing--day relative flex min-h-[100dvh] flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="ai-landing-glow absolute left-1/2 top-[38%] h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="ai-landing-glow-secondary absolute left-1/2 top-[55%] h-[380px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          aria-label="Asosiy sahifaga qaytish"
          className="ai-chrome-btn flex size-10 items-center justify-center rounded-full transition"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="ai-badge flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
          <Sparkles className="size-3.5 text-[#7ea2d4]" />
          AI + Kurslar
        </div>
        <div className="size-10" aria-hidden />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-28 pt-6 sm:px-6">
        <h1 className="ai-heading max-w-3xl text-center text-[clamp(1.6rem,4.5vw,2.6rem)] font-medium leading-tight tracking-tight">
          {LANDING_HEADING}
        </h1>
        <p className="ai-hint mt-3 max-w-lg text-center text-sm">
          Ingliz tili, IT, marketing va boshqa yo&apos;nalishlarda kurs qidiring — mos variantlar yon panelda chiqadi
        </p>

        <div className="mt-10 w-full max-w-2xl">
          <div className="ai-input-pill flex items-center gap-2 rounded-full px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2.5">
            <button
              type="button"
              onClick={() => void startChat({ type: "menu_match" }, "Mos kursni topish")}
              className="ai-pill-icon-btn flex size-9 shrink-0 items-center justify-center rounded-full transition"
              aria-label="Mos kursni topish"
            >
              <Target className="size-4" />
            </button>
            <span className="hidden size-2 shrink-0 rounded-full bg-[#7ea2d4] sm:block" aria-hidden />
            <input
              value={landingInput}
              onChange={e => setLandingInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitLanding();
                }
              }}
              placeholder="Masalan: ingliz tili boshlang'ich..."
              className="ai-pill-input min-w-0 flex-1 bg-transparent text-[15px] outline-none"
            />
            <button
              type="button"
              onClick={submitLanding}
              disabled={!landingInput.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2d5a8a] text-white transition hover:bg-[#3a6a9a] disabled:opacity-30"
            >
              <Send className="size-4" />
            </button>
            <button
              type="button"
              onClick={submitLanding}
              disabled={!landingInput.trim()}
              className="ai-pill-icon-btn flex size-9 shrink-0 sm:hidden"
              aria-label="Yuborish"
            >
              <Mic className="size-4" />
            </button>
          </div>
          <p className="ai-hint mt-4 text-center text-xs">
            «Python», «ingliz tili», «marketing» — yozing, AI mos kurslarni ko&apos;rsatadi
          </p>
        </div>
      </main>
    </div>
  );
}
