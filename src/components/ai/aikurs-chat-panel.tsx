"use client";

import Link from "next/link";
import { ChevronLeft, MessageCircle, Send, Sparkles, Target } from "lucide-react";
import { AiChatBody } from "@/components/ai/ai-chat-body";
import type { useAiChat } from "@/components/ai/use-ai-chat";

type ChatApi = ReturnType<typeof useAiChat>;

type Props = {
  chat: ChatApi;
  variant: "full" | "split";
  coursesInSidebar?: boolean;
  onBack?: () => void;
};

export function AiKursChatPanel({ chat, variant, coursesInSidebar = false, onBack }: Props) {
  const { input, setInput, loading, ui, phone, onSubmitText } = chat;
  const isSplit = variant === "split";

  const submit = () => {
    if (ui?.kind === "phone") {
      const p = (phone || input).trim();
      if (!p || loading) return;
      onSubmitText();
      return;
    }
    onSubmitText();
  };

  if (isSplit) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[#f8fafb]">
        <header className="flex shrink-0 items-center gap-2 border-b border-[#e4e7ea] bg-white px-3 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5a8a] to-[#4a7ab8] text-white">
            <MessageCircle className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#16181a]">Darslinker AI</p>
            <p className="text-[10px] text-[#6a7585]">Maslahatchi</p>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <AiChatBody chat={chat} skin="aikurs" coursesInSidebar={coursesInSidebar} />
        </div>

        <footer className="shrink-0 border-t border-[#e4e7ea] bg-white p-2">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => void chat.send({ type: "menu_match" }, "Mos kursni topish")}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#dce6f2] text-[#2d5a8a] hover:bg-[#eef4fc]"
              title="Mos kursni topish"
            >
              <Target className="size-4" />
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), submit())}
              placeholder={ui?.kind === "phone" ? "Telefon..." : "Xabar..."}
              className="min-w-0 flex-1 rounded-lg border border-[#dce6f2] px-2.5 py-2 text-[13px] outline-none focus:border-[#7ea2d4]"
            />
            <button
              type="button"
              onClick={submit}
              disabled={
                loading ||
                (ui?.kind === "phone" ? !(phone || input).trim() : !input.trim())
              }
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2d5a8a] text-white disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="ai-landing ai-landing--day relative flex min-h-[100dvh] flex-col">
      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="ai-chrome-btn flex size-10 items-center justify-center rounded-full transition"
            aria-label="Orqaga"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <Link
            href="/"
            aria-label="Asosiy sahifaga"
            className="ai-chrome-btn flex size-10 items-center justify-center rounded-full transition"
          >
            <ChevronLeft className="size-5" />
          </Link>
        )}
        <div className="ai-badge flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
          <Sparkles className="size-3.5 text-[#7ea2d4]" />
          AI + Kurslar
        </div>
        <div className="size-10" aria-hidden />
      </header>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col px-4 pb-4 sm:px-6">
        <div className="min-h-0 flex-1 overflow-y-auto py-2">
          <AiChatBody chat={chat} skin="aikurs" />
        </div>
        <footer className="shrink-0 pb-4 pt-2">
          <div className="ai-input-pill flex items-center gap-2 rounded-full px-3 py-2 sm:px-4">
            <button
              type="button"
              onClick={() => void chat.send({ type: "menu_match" }, "Mos kursni topish")}
              className="ai-pill-icon-btn flex size-9 shrink-0 items-center justify-center rounded-full"
              title="Mos kursni topish"
            >
              <Target className="size-4" />
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), submit())}
              placeholder="Darslinker AI ga yozing..."
              className="ai-pill-input min-w-0 flex-1 bg-transparent text-[15px] outline-none"
            />
            <button
              type="button"
              onClick={submit}
              disabled={
                loading ||
                (ui?.kind === "phone" ? !(phone || input).trim() : !input.trim())
              }
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2d5a8a] text-white disabled:opacity-30"
            >
              <Send className="size-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
