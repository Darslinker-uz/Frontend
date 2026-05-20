"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, ChevronLeft, ChevronRight, ExternalLink, Phone } from "lucide-react";
import type { WebAiAction, WebAiResponse, WebAiUi, WebCourseDetail } from "@/lib/web-ai";
import { PhoneInput } from "@/components/phone-input";

type ChatMsg = { role: "user" | "assistant"; content: string };

const SESSION_KEY = "darslinker_ai_session";

async function callAi(sessionId: string, action: WebAiAction): Promise<WebAiResponse> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, action }),
  });
  return res.json();
}

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [ui, setUi] = useState<WebAiUi | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollDown = () => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const applyResponse = useCallback((data: WebAiResponse) => {
    if (!data.ok) {
      setError(data.error ?? "Xatolik");
      return;
    }
    setError(null);
    if (data.sessionId) setSessionId(data.sessionId);
    if (data.assistantMessages?.length) {
      setMessages(prev => [
        ...prev,
        ...data.assistantMessages.map(content => ({ role: "assistant" as const, content })),
      ]);
    }
    setUi(data.ui ?? null);
    scrollDown();
  }, []);

  const send = async (action: WebAiAction, userLabel?: string) => {
    if (!sessionId && action.type !== "init") return;
    setLoading(true);
    setError(null);
    if (userLabel) {
      setMessages(prev => [...prev, { role: "user", content: userLabel }]);
    }
    try {
      const sid = sessionId || (typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) : null) || "";
      const data = await callAi(sid, action);
      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(SESSION_KEY, data.sessionId);
      }
      applyResponse(data);
    } catch {
      setError("Tarmoq xatosi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setSessionId(stored);
      return;
    }
    if (sessionId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await callAi("", { type: "init" });
        if (cancelled) return;
        if (data.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem(SESSION_KEY, data.sessionId);
        }
        applyResponse(data);
      } catch {
        if (!cancelled) setError("Tarmoq xatosi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, sessionId, applyResponse]);

  useEffect(() => {
    scrollDown();
  }, [messages, ui, open]);

  const onSubmitText = () => {
    if (loading) return;
    if (ui?.kind === "phone") {
      const p = (phone || input).trim();
      if (!p) return;
      setInput("");
      setPhone("");
      void send({ type: "inquiry_phone", phone: p, listingId: ui.listingId }, p);
      return;
    }
    const t = input.trim();
    if (!t) return;
    setInput("");
    void send({ type: "message", text: t }, t);
  };

  const renderCourses = (c: Extract<WebAiUi, { kind: "courses" }>) => (
    <div className="mt-2 space-y-2">
      <p className="text-[11px] font-semibold text-[#2d5a8a]">{c.title}</p>
      <p className="text-[10px] text-[#6a7585]">
        {c.page * 5 + 1}–{Math.min((c.page + 1) * 5, c.total)} / {c.total} ta
      </p>
      <ol className="space-y-1.5">
        {c.courses.map((course, i) => (
          <li key={course.id}>
            <button
              type="button"
              disabled={loading}
              onClick={() => void send({ type: "course_open", index: i }, `${i + 1}. ${course.title}`)}
              className="w-full text-left rounded-lg border border-[#7ea2d4]/35 bg-white/90 px-2.5 py-2 hover:bg-[#eef4fc] transition-colors"
            >
              <span className="text-[12px] font-semibold text-[#16181a]">
                {c.page * 5 + i + 1}. {course.title}
              </span>
              <span className="block text-[11px] text-[#6a7585]">
                {course.price} · {course.format}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="flex gap-1 flex-wrap">
        {c.page > 0 && (
          <button
            type="button"
            disabled={loading}
            onClick={() => void send({ type: "courses_page", page: c.page - 1 })}
            className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] text-[#2d5a8a]"
          >
            <ChevronLeft className="size-3" /> Oldingi
          </button>
        )}
        {c.page < c.totalPages - 1 && (
          <button
            type="button"
            disabled={loading}
            onClick={() => void send({ type: "courses_page", page: c.page + 1 })}
            className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] text-[#2d5a8a]"
          >
            Keyingi <ChevronRight className="size-3" />
          </button>
        )}
      </div>
    </div>
  );

  const renderCourse = (course: WebCourseDetail) => (
    <div className="mt-2 rounded-xl border border-[#7ea2d4]/40 bg-white p-3 text-[12px] space-y-1.5">
      <p className="font-bold text-[#16181a]">{course.title}</p>
      <p>🏫 {course.centerName}</p>
      <p>🏷 {course.categoryName} · {course.format}</p>
      <p>💰 {course.price}</p>
      {course.duration && <p>⏳ {course.duration}</p>}
      {course.level && <p>📊 {course.level}</p>}
      {course.description && (
        <p className="text-[#6a7585] line-clamp-3">{course.description}</p>
      )}
      <div className="flex flex-col gap-1.5 pt-1">
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#2d5a8a] font-medium hover:underline"
        >
          Saytda ochish <ExternalLink className="size-3" />
        </a>
        <button
          type="button"
          disabled={loading}
          onClick={() => void send({ type: "course_inquiry", listingId: course.id }, "Qo'shimcha ma'lumot")}
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#2d5a8a] text-white px-3 py-2 text-[11px] font-medium"
        >
          <Phone className="size-3" /> Qo'shimcha ma'lumot olish
        </button>
      </div>
    </div>
  );

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Darslinker AI"
          className="fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5a8a] to-[#4a7ab8] text-white shadow-lg shadow-[#2d5a8a]/40 hover:scale-105 transition-transform"
        >
          <Sparkles className="size-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-[60] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-[#7ea2d4]/50 bg-[#f4f7fb] shadow-2xl shadow-[#2d5a8a]/25 h-[min(72vh,520px)]">
          <header className="flex items-center justify-between bg-gradient-to-r from-[#2d5a8a] to-[#4a7ab8] px-4 py-3 text-white shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              <div>
                <p className="text-sm font-bold leading-tight">Darslinker AI</p>
                <p className="text-[10px] opacity-80">Kurs maslahatchi</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/20">
              <X className="size-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
                  m.role === "user"
                    ? "ml-auto bg-[#2d5a8a] text-white rounded-br-md"
                    : "bg-white border border-[#dce6f2] text-[#16181a] rounded-bl-md"
                }`}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="text-[12px] text-[#6a7585] animate-pulse px-2">Yozmoqda...</div>
            )}

            {error && <p className="text-[12px] text-red-600 px-1">{error}</p>}

            {ui?.kind === "menu" && (
              <div className="flex flex-col gap-2">
                {ui.buttons.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (b.id === "menu_match") void send({ type: "menu_match" }, b.label);
                    }}
                    className="rounded-xl border border-[#7ea2d4]/50 bg-white px-3 py-2.5 text-left text-[13px] font-medium text-[#2d5a8a] hover:bg-[#eef4fc]"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}

            {ui?.kind === "quiz" && (
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-[#16181a]">{ui.question}</p>
                <p className="text-[10px] text-[#6a7585]">
                  Savol {ui.step}/{ui.total}
                </p>
                <div className="flex flex-col gap-1.5">
                  {ui.options.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        void send(
                          {
                            type: "quiz_answer",
                            key: QUESTION_KEYS[ui.step - 1],
                            value: opt.id,
                          },
                          opt.label
                        )
                      }
                      className="rounded-lg border border-[#dce6f2] bg-white px-3 py-2 text-left text-[12px] hover:border-[#7ea2d4]"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ui?.kind === "courses" && renderCourses(ui)}
            {ui?.kind === "course" && renderCourse(ui.course)}
            {ui?.kind === "phone" && (
              <div className="rounded-lg border border-[#7ea2d4]/40 bg-white p-2 space-y-2">
                <p className="text-[12px] font-medium">{ui.courseTitle}</p>
                <PhoneInput value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <footer className="shrink-0 border-t border-[#dce6f2] bg-white p-2">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSubmitText())}
                placeholder={
                  ui?.kind === "phone" ? "Telefon yoki pastdagi maydandan" : "Xabar yozing..."
                }
                className="flex-1 rounded-xl border border-[#dce6f2] px-3 py-2 text-[13px] outline-none focus:border-[#7ea2d4]"
              />
              <button
                type="button"
                onClick={onSubmitText}
                disabled={
                  loading ||
                  (ui?.kind === "phone" ? !(phone || input).trim() : !input.trim())
                }
                className="flex size-10 items-center justify-center rounded-xl bg-[#2d5a8a] text-white disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

const QUESTION_KEYS = ["goal", "direction", "level", "time", "budget"];
