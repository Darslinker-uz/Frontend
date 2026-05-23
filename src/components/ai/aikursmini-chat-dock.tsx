"use client";

import { ChevronDown, ChevronUp, MessageCircle, Send, Sparkles, Target } from "lucide-react";
import { AiChatBody } from "@/components/ai/ai-chat-body";
import type { useAiChat } from "@/components/ai/use-ai-chat";

type ChatApi = ReturnType<typeof useAiChat>;

type Props = {
  chat: ChatApi;
  expanded: boolean;
  onToggleExpanded: () => void;
  /** Birinchi foydalanuvchi xabaridan keyin yashiriladi */
  showMatchButton: boolean;
};

export function AiKursMiniChatDock({ chat, expanded, onToggleExpanded, showMatchButton }: Props) {
  const { input, setInput, loading, ui, phone, onSubmitText } = chat;

  const submit = () => {
    if (ui?.kind === "phone") {
      const p = (phone || input).trim();
      if (!p || loading) return;
      onSubmitText();
      return;
    }
    onSubmitText();
  };

  if (!expanded) {
    return (
      <div className="aikursmini-dock shrink-0 border-t border-[#dce6f2] bg-white px-4 py-2.5">
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex w-full items-center gap-3 rounded-2xl border border-[#dce6f2] bg-[#f8fafb] px-4 py-3 text-left shadow-sm transition hover:border-[#7ea2d4]/50"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5a8a] to-[#4a7ab8] text-white">
            <Sparkles className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-[#16181a]">Darslinker AI</span>
            <span className="block truncate text-[12px] text-[#6a7585]">
              Kurs qidiring yoki savol bering...
            </span>
          </span>
          <ChevronUp className="size-5 shrink-0 text-[#6a7585]" />
        </button>
      </div>
    );
  }

  return (
    <div className="aikursmini-dock flex h-[min(42vh,380px)] min-h-[260px] max-h-[480px] shrink-0 flex-col border-t border-[#dce6f2] bg-[#f8fafb] shadow-[0_-8px_32px_rgba(45,90,138,0.08)]">
      <header className="flex shrink-0 items-center gap-2 border-b border-[#e4e7ea] bg-white px-3 py-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5a8a] to-[#4a7ab8] text-white">
          <MessageCircle className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#16181a]">Darslinker AI</p>
          <p className="text-[10px] text-[#6a7585]">Maslahatchi</p>
        </div>
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex size-8 items-center justify-center rounded-full text-[#6a7585] hover:bg-[#eef4fc]"
          aria-label="Chatni yig'ish"
        >
          <ChevronDown className="size-5" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <AiChatBody chat={chat} skin="aikursmini" coursesInSidebar />
      </div>

      <footer className="shrink-0 border-t border-[#e4e7ea] bg-white p-2">
        <div className="flex gap-1.5">
          {showMatchButton && (
            <button
              type="button"
              onClick={() => void chat.send({ type: "menu_match" }, "Mos kursni topish")}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#dce6f2] text-[#2d5a8a] hover:bg-[#eef4fc]"
              title="Mos kursni topish"
            >
              <Target className="size-4" />
            </button>
          )}
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), submit())}
            placeholder={ui?.kind === "phone" ? "Telefon..." : "Masalan: python, marketing..."}
            className="min-w-0 flex-1 rounded-lg border border-[#dce6f2] px-2.5 py-2 text-[13px] outline-none focus:border-[#7ea2d4]"
          />
          <button
            type="button"
            onClick={submit}
            disabled={
              loading || (ui?.kind === "phone" ? !(phone || input).trim() : !input.trim())
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
