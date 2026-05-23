"use client";

import { MessageCircle, Send, Sparkles, Target, X } from "lucide-react";
import { AiChatBody } from "@/components/ai/ai-chat-body";
import type { useAiChat } from "@/components/ai/use-ai-chat";

type ChatApi = ReturnType<typeof useAiChat>;

type Props = {
  chat: ChatApi;
  expanded: boolean;
  onToggleExpanded: () => void;
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

  return (
    <div className="aikursmini-fab-root pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
      {expanded && (
        <div
          className="aikursmini-fab-panel pointer-events-auto flex w-[min(calc(100vw-2rem),340px)] flex-col overflow-hidden rounded-2xl border border-[#7ea2d4]/40 bg-[#f8fafb] shadow-2xl shadow-[#2d5a8a]/20"
          style={{ height: "min(72vh, 420px)" }}
        >
          <header className="flex shrink-0 items-center gap-2 bg-gradient-to-r from-[#2d5a8a] to-[#4a7ab8] px-3 py-2.5 text-white">
            <MessageCircle className="size-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight">Darslinker AI</p>
              <p className="text-[10px] opacity-85">Kurs maslahatchi</p>
            </div>
            <button
              type="button"
              onClick={onToggleExpanded}
              className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-white/20"
              aria-label="Chatni yopish"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-2">
            <AiChatBody chat={chat} skin="aikursmini" coursesInSidebar />
          </div>

          <footer className="shrink-0 border-t border-[#e4e7ea] bg-white p-2">
            <div className="flex gap-1.5">
              {showMatchButton && (
                <button
                  type="button"
                  onClick={() => void chat.send({ type: "menu_match" }, "Mos kursni topish")}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#dce6f2] text-[#2d5a8a] hover:bg-[#eef4fc]"
                  title="Mos kursni topish"
                >
                  <Target className="size-3.5" />
                </button>
              )}
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), submit())}
                placeholder={ui?.kind === "phone" ? "Telefon..." : "Kimyo, tarix, IT..."}
                className="min-w-0 flex-1 rounded-lg border border-[#dce6f2] px-2 py-1.5 text-[12px] outline-none focus:border-[#7ea2d4]"
              />
              <button
                type="button"
                onClick={submit}
                disabled={
                  loading || (ui?.kind === "phone" ? !(phone || input).trim() : !input.trim())
                }
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2d5a8a] text-white disabled:opacity-40"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </footer>
        </div>
      )}

      <button
        type="button"
        onClick={onToggleExpanded}
        aria-label={expanded ? "AI chatni yopish" : "Darslinker AI"}
        className="aikursmini-fab-btn pointer-events-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5a8a] to-[#4a7ab8] text-white shadow-lg shadow-[#2d5a8a]/35 ring-2 ring-white transition hover:scale-105"
      >
        {expanded ? <X className="size-6" /> : <Sparkles className="size-6" />}
      </button>
    </div>
  );
}
