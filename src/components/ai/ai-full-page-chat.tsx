"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Mic, Plus, Send, Sparkles } from "lucide-react";
import { AiChatBody } from "@/components/ai/ai-chat-body";
import type { useAiChat } from "@/components/ai/use-ai-chat";

type ChatApi = ReturnType<typeof useAiChat>;

export function AiFullPageChat({ chat }: { chat: ChatApi }) {
  const { input, setInput, loading, ui, phone, onSubmitText } = chat;

  useEffect(() => {
    document.body.style.backgroundColor = "#000000";
    document.documentElement.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  const submit = () => {
    if (ui?.kind === "phone") {
      const p = (phone || input).trim();
      if (!p || loading) return;
      onSubmitText();
      return;
    }
    onSubmitText();
  };

  return (
    <div className="ai-chat-view flex h-[100dvh] flex-col bg-black">
      <header className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          aria-label="Asosiy sahifaga qaytish"
          className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-[#7ea2d4]/30 bg-[#7ea2d4]/10 px-3 py-1.5 text-xs font-medium text-[#b8cce8]">
          <Sparkles className="size-3.5 text-[#7ea2d4]" />
          Darslinker AI
        </div>
        <div className="size-10" aria-hidden />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
        <div className="mx-auto max-w-3xl py-2">
          <AiChatBody chat={chat} skin="gemini" />
        </div>
      </div>

      <footer className="shrink-0 px-4 pb-5 pt-2 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 rounded-full bg-[#2a2a2a] px-3 py-2.5 sm:px-4">
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#7ea2d4] hover:bg-white/5"
              aria-label="Mos kursni topish"
              onClick={() => void chat.send({ type: "menu_match" }, "Mos kursni topish")}
            >
              <Plus className="size-5" />
            </button>
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
              className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
            />
            <span className="hidden shrink-0 text-[11px] text-white/40 sm:inline">Maslahatchi</span>
            <button
              type="button"
              onClick={submit}
              disabled={loading || (ui?.kind === "phone" ? !(phone || input).trim() : !input.trim())}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2d5a8a] text-white disabled:opacity-30"
              aria-label="Yuborish"
            >
              <Send className="size-4" />
            </button>
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/45 sm:hidden"
              aria-label="Ovoz"
            >
              <Mic className="size-4" />
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] text-white/30">
            Darslinker AI xato qilishi mumkin.
          </p>
        </div>
      </footer>
    </div>
  );
}
