"use client";

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Phone,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { WebAiUi, WebCourseDetail } from "@/lib/web-ai";
import { PhoneInput } from "@/components/phone-input";
import type { useAiChat } from "@/components/ai/use-ai-chat";
import { AI_QUESTION_KEYS } from "@/components/ai/use-ai-chat";

type ChatApi = ReturnType<typeof useAiChat>;

type Props = {
  chat: ChatApi;
  skin?: "widget" | "gemini" | "aikurs" | "aikursmini";
  /** Kurslar chap panelda — chatda faqat sarlavha va sahifalash */
  coursesInSidebar?: boolean;
};

export function AiChatBody({ chat, skin = "widget", coursesInSidebar = false }: Props) {
  const { messages, ui, loading, error, send, phone, setPhone, bottomRef } = chat;
  const isGemini = skin === "gemini";
  const isAikurs = skin === "aikurs" || skin === "aikursmini";
  const hideMatchMenu = skin === "aikurs";
  const menuButtons =
    ui?.kind === "menu"
      ? hideMatchMenu
        ? ui.buttons.filter(b => b.id !== "menu_match")
        : ui.buttons
      : [];

  const userBubble = (content: string, key: number) =>
    isGemini ? (
      <div key={key} className="mb-8 flex justify-end">
        <div className="max-w-[85%] rounded-full bg-[#2a2a2a] px-5 py-3 text-[15px] leading-snug text-white">
          {content}
        </div>
      </div>
    ) : isAikurs ? (
      <div key={key} className="mb-4 flex justify-end">
        <div className="max-w-[88%] rounded-2xl rounded-br-md bg-[#2d5a8a] px-3.5 py-2.5 text-[13px] leading-snug text-white shadow-sm">
          {content}
        </div>
      </div>
    ) : (
      <div
        key={key}
        className="ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-[#2d5a8a] px-3 py-2 text-[13px] leading-snug text-white"
      >
        {content}
      </div>
    );

  const assistantBlock = (content: string, key: number) =>
    isGemini ? (
      <div key={key} className="mb-10 max-w-3xl">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-white">{content}</p>
        <div className="mt-3 flex items-center gap-1 text-white/40">
          <button type="button" className="rounded-full p-2 hover:bg-white/10" aria-label="Yoqdi">
            <ThumbsUp className="size-4" />
          </button>
          <button type="button" className="rounded-full p-2 hover:bg-white/10" aria-label="Yoqmadi">
            <ThumbsDown className="size-4" />
          </button>
          <button type="button" className="rounded-full p-2 hover:bg-white/10" aria-label="Qayta">
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Nusxa olish"
            onClick={() => void navigator.clipboard?.writeText(content)}
          >
            <Copy className="size-4" />
          </button>
          <button type="button" className="rounded-full p-2 hover:bg-white/10" aria-label="Ko'proq">
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>
    ) : isAikurs ? (
      <div key={key} className="mb-4 max-w-[95%]">
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[#16181a]">{content}</p>
      </div>
    ) : (
      <div
        key={key}
        className="max-w-[90%] rounded-2xl rounded-bl-md border border-[#dce6f2] bg-white px-3 py-2 text-[13px] leading-snug text-[#16181a]"
      >
        {content}
      </div>
    );

  const uiShell = (children: React.ReactNode) =>
    isGemini ? (
      <div className="mb-8 max-w-3xl text-white">{children}</div>
    ) : isAikurs ? (
      <div className="mb-3">{children}</div>
    ) : (
      <div>{children}</div>
    );

  const renderCourses = (c: Extract<WebAiUi, { kind: "courses" }>) => {
    if (coursesInSidebar) {
      return uiShell(
        <>
          <p className="text-sm font-semibold text-[#2d5a8a]">{c.title}</p>
          <p className="mt-1 text-xs text-[#6a7585]">
            {c.total} ta kurs chapda · {c.page * 5 + 1}–{Math.min((c.page + 1) * 5, c.total)}
          </p>
          {(c.page > 0 || c.page < c.totalPages - 1) && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.page > 0 && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void send({ type: "courses_page", page: c.page - 1 })}
                  className="inline-flex items-center gap-1 rounded-full border border-[#dce6f2] bg-white px-2.5 py-1 text-[11px] text-[#2d5a8a]"
                >
                  <ChevronLeft className="size-3" /> Oldingi
                </button>
              )}
              {c.page < c.totalPages - 1 && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void send({ type: "courses_page", page: c.page + 1 })}
                  className="inline-flex items-center gap-1 rounded-full border border-[#dce6f2] bg-white px-2.5 py-1 text-[11px] text-[#2d5a8a]"
                >
                  Keyingi <ChevronRight className="size-3" />
                </button>
              )}
            </div>
          )}
        </>
      );
    }

    return uiShell(
      <>
        <p className={`text-sm font-semibold ${isGemini ? "text-[#b8cce8]" : "text-[#2d5a8a]"}`}>
          {c.title}
        </p>
        <p className={`mt-1 text-xs ${isGemini ? "text-white/45" : "text-[#6a7585]"}`}>
          {c.page * 5 + 1}–{Math.min((c.page + 1) * 5, c.total)} / {c.total} ta
        </p>
        <ol className="mt-3 space-y-2">
          {c.courses.map((course, i) => (
            <li key={course.id}>
              <button
                type="button"
                disabled={loading}
                onClick={() => void send({ type: "course_open", index: i }, `${i + 1}. ${course.title}`)}
                className={
                  isGemini
                    ? "w-full rounded-2xl border border-white/10 bg-[#2a2a2a] px-4 py-3 text-left transition hover:bg-[#333]"
                    : "w-full rounded-lg border border-[#7ea2d4]/35 bg-white/90 px-2.5 py-2 text-left transition hover:bg-[#eef4fc]"
                }
              >
                <span className={`block text-sm font-semibold ${isGemini ? "text-white" : "text-[#16181a]"}`}>
                  {c.page * 5 + i + 1}. {course.title}
                </span>
                <span className={`block text-xs ${isGemini ? "text-white/50" : "text-[#6a7585]"}`}>
                  {course.price} · {course.format}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          {c.page > 0 && (
            <button
              type="button"
              disabled={loading}
              onClick={() => void send({ type: "courses_page", page: c.page - 1 })}
              className={
                isGemini
                  ? "inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
                  : "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] text-[#2d5a8a]"
              }
            >
              <ChevronLeft className="size-3" /> Oldingi
            </button>
          )}
          {c.page < c.totalPages - 1 && (
            <button
              type="button"
              disabled={loading}
              onClick={() => void send({ type: "courses_page", page: c.page + 1 })}
              className={
                isGemini
                  ? "inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
                  : "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] text-[#2d5a8a]"
              }
            >
              Keyingi <ChevronRight className="size-3" />
            </button>
          )}
        </div>
      </>
    );
  };

  const renderCourse = (course: WebCourseDetail) =>
    uiShell(
      <div
        className={
          isGemini
            ? "rounded-2xl border border-white/10 bg-[#2a2a2a] p-4 text-sm"
            : "mt-2 rounded-xl border border-[#7ea2d4]/40 bg-white p-3 text-[12px]"
        }
      >
        <p className={`font-bold ${isGemini ? "text-white" : "text-[#16181a]"}`}>{course.title}</p>
        <p className={isGemini ? "mt-2 text-white/70" : ""}>🏫 {course.centerName}</p>
        <p className={isGemini ? "text-white/70" : ""}>🏷 {course.categoryName} · {course.format}</p>
        <p className={isGemini ? "text-white/70" : ""}>💰 {course.price}</p>
        {course.duration && <p className={isGemini ? "text-white/70" : ""}>⏳ {course.duration}</p>}
        {course.level && <p className={isGemini ? "text-white/70" : ""}>📊 {course.level}</p>}
        {course.description && (
          <p className={`mt-2 line-clamp-3 ${isGemini ? "text-white/50" : "text-[#6a7585]"}`}>
            {course.description}
          </p>
        )}
        <div className="mt-3 flex flex-col gap-2">
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 font-medium hover:underline ${isGemini ? "text-[#7ea2d4]" : "text-[#2d5a8a]"}`}
          >
            Saytda ochish <ExternalLink className="size-3" />
          </a>
          <button
            type="button"
            disabled={loading}
            onClick={() => void send({ type: "course_inquiry", listingId: course.id }, "Qo'shimcha ma'lumot")}
            className="inline-flex items-center justify-center gap-1 rounded-full bg-[#2d5a8a] px-4 py-2 text-xs font-medium text-white"
          >
            <Phone className="size-3" /> Qo&apos;shimcha ma&apos;lumot olish
          </button>
        </div>
      </div>
    );

  return (
    <>
      {messages.map((m, i) =>
        m.role === "user" ? userBubble(m.content, i) : assistantBlock(m.content, i)
      )}

      {loading && (
        <div className={`animate-pulse px-2 ${isGemini ? "mb-6 text-sm text-white/40" : "text-[12px] text-[#6a7585]"}`}>
          Yozmoqda...
        </div>
      )}

      {error && (
        <p className={`px-1 ${isGemini ? "mb-4 text-sm text-red-400" : "text-[12px] text-red-600"}`}>{error}</p>
      )}

      {menuButtons.length > 0 &&
        uiShell(
          <div className="flex flex-col gap-2">
            {menuButtons.map(b => (
              <button
                key={b.id}
                type="button"
                disabled={loading}
                onClick={() => {
                  if (b.id === "menu_match") void send({ type: "menu_match" }, b.label);
                }}
                className={
                  isGemini
                    ? "rounded-full border border-white/10 bg-[#2a2a2a] px-4 py-3 text-left text-sm text-white hover:bg-[#333]"
                    : "rounded-xl border border-[#7ea2d4]/50 bg-white px-3 py-2.5 text-left text-[13px] font-medium text-[#2d5a8a] hover:bg-[#eef4fc]"
                }
              >
                {b.label}
              </button>
            ))}
          </div>
        )}

      {ui?.kind === "quiz" && uiShell(
        <div className="space-y-3">
          <p className={`text-sm font-semibold ${isGemini ? "text-white" : "text-[#16181a]"}`}>{ui.question}</p>
          <p className={`text-xs ${isGemini ? "text-white/45" : "text-[#6a7585]"}`}>
            Savol {ui.step}/{ui.total}
          </p>
          <div className="flex flex-col gap-2">
            {ui.options.map(opt => (
              <button
                key={opt.id}
                type="button"
                disabled={loading}
                onClick={() =>
                  void send(
                    { type: "quiz_answer", key: AI_QUESTION_KEYS[ui.step - 1], value: opt.id },
                    opt.label
                  )
                }
                className={
                  isGemini
                    ? "rounded-2xl border border-white/10 bg-[#2a2a2a] px-4 py-3 text-left text-sm text-white hover:bg-[#333]"
                    : "rounded-lg border border-[#dce6f2] bg-white px-3 py-2 text-left text-[12px] hover:border-[#7ea2d4]"
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {ui?.kind === "courses" && renderCourses(ui)}
      {ui?.kind === "course" && renderCourse(ui.course)}
      {ui?.kind === "phone" && uiShell(
        <div className={`space-y-3 rounded-2xl border p-4 ${isGemini ? "border-white/10 bg-[#2a2a2a]" : "border-[#7ea2d4]/40 bg-white"}`}>
          <p className={`text-sm font-medium ${isGemini ? "text-white" : ""}`}>{ui.courseTitle}</p>
          <PhoneInput value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
      )}

      <div ref={bottomRef} />
    </>
  );
}
