"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, Mic, Send, Sparkles, Target } from "lucide-react";
import { AiChatWidget, type AiChatHandle } from "@/components/ai/ai-chat-widget";

const HEADINGS = [
  "Bugun qanday kurs izlayapsiz?",
  "Qaysi yo'nalishda o'rganmoqchisiz?",
  "Sizga mos kurs topishga yordam beraman",
];

export function AiPageClient() {
  const chatRef = useRef<AiChatHandle>(null);
  const [input, setInput] = useState("");
  const heading = HEADINGS[0];

  const submit = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    chatRef.current?.openAndSend(text);
  };

  return (
    <div className="ai-landing relative flex min-h-[100dvh] flex-col">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="ai-landing-glow absolute left-1/2 top-[38%] h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="ai-landing-glow-secondary absolute left-1/2 top-[55%] h-[380px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      {/* Top bar */}
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
          Darslinker AI
        </div>

        <div className="size-10" aria-hidden />
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-28 pt-6 sm:px-6">
        <h1 className="ai-heading max-w-3xl text-center text-[clamp(1.75rem,5vw,2.75rem)] font-medium leading-tight tracking-tight">
          {heading}
        </h1>

        {/* Gemini-style input pill */}
        <div className="mt-10 w-full max-w-2xl">
          <div className="ai-input-pill flex items-center gap-2 rounded-full px-3 py-2 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2.5">
            <button
              type="button"
              onClick={() => chatRef.current?.openAndAction({ type: "menu_match" }, "Mos kursni topish")}
              className="ai-pill-icon-btn flex size-9 shrink-0 items-center justify-center rounded-full transition"
              aria-label="Mos kursni topish"
              title="Mos kursni topish"
            >
              <Target className="size-4" />
            </button>

            <span className="hidden size-2 shrink-0 rounded-full bg-[#7ea2d4] sm:block" aria-hidden />

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Darslinker AI ga yozing..."
              className="ai-pill-input min-w-0 flex-1 bg-transparent text-[15px] outline-none"
            />

            <span className="ai-pill-tag hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] sm:inline">
              Maslahatchi
            </span>

            <button
              type="button"
              onClick={submit}
              disabled={!input.trim()}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2d5a8a] text-white transition hover:bg-[#3a6a9a] disabled:opacity-30"
              aria-label="Yuborish"
            >
              <Send className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => chatRef.current?.open()}
              className="ai-pill-icon-btn flex size-9 shrink-0 items-center justify-center rounded-full transition sm:hidden"
              aria-label="Chat ochish"
            >
              <Mic className="size-4" />
            </button>
          </div>

          <p className="ai-hint mt-4 text-center text-xs">
            Masalan: «ingliz tili boshlang&apos;ich», «Python kursi», «marketing»
          </p>
        </div>
      </main>

      <AiChatWidget ref={chatRef} />
    </div>
  );
}
