"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import type { WebAiAction } from "@/lib/web-ai";
import { AiChatBody } from "@/components/ai/ai-chat-body";
import { useAiChat } from "@/components/ai/use-ai-chat";

export type AiChatHandle = {
  open: () => void;
  openAndSend: (text: string) => void;
  openAndAction: (action: WebAiAction, userLabel?: string) => void;
};

type AiChatWidgetProps = {
  theme?: "light" | "dark";
  variant?: "floating" | "panel";
  sessionKey?: string;
  className?: string;
};

export const AiChatWidget = forwardRef<AiChatHandle, AiChatWidgetProps>(function AiChatWidget(
  { theme = "light", variant = "floating", sessionKey, className = "" },
  ref
) {
  const isPanel = variant === "panel";
  const [floatingOpen, setFloatingOpen] = useState(false);
  const open = isPanel || floatingOpen;
  const chat = useAiChat(sessionKey);
  const { ensureInit, queueAction, input, setInput, phone, ui, loading, onSubmitText } = chat;

  useImperativeHandle(
    ref,
    () => ({
      open: () => setFloatingOpen(true),
      openAndSend: (text: string) => {
        setFloatingOpen(true);
        void ensureInit().then(() => queueAction({ type: "message", text }, text));
      },
      openAndAction: (action: WebAiAction, userLabel?: string) => {
        setFloatingOpen(true);
        void ensureInit().then(() => queueAction(action, userLabel));
      },
    }),
    [ensureInit, queueAction]
  );

  useEffect(() => {
    if (open) void ensureInit();
  }, [open, ensureInit]);

  const fabClass =
    theme === "dark"
      ? "fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5a8a] to-[#4a7ab8] text-white shadow-lg shadow-[#2d5a8a]/50 ring-1 ring-white/10 hover:scale-105 transition-transform"
      : "fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2d5a8a] to-[#4a7ab8] text-white shadow-lg shadow-[#2d5a8a]/40 hover:scale-105 transition-transform";

  const panelClass = isPanel
    ? `flex h-full min-h-0 w-full flex-col overflow-hidden border-[#dce6f2] bg-[#f4f7fb] ${className}`
    : "fixed bottom-5 right-5 z-[60] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-[#7ea2d4]/50 bg-[#f4f7fb] shadow-2xl shadow-black/30 h-[min(72vh,520px)]";

  return (
    <>
      {!isPanel && !floatingOpen && (
        <button
          type="button"
          onClick={() => setFloatingOpen(true)}
          aria-label="Darslinker AI"
          className={fabClass}
        >
          <Sparkles className="size-6" />
        </button>
      )}

      {open && (
        <div className={panelClass}>
          <header className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#2d5a8a] to-[#4a7ab8] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5" />
              <div>
                <p className="text-sm font-bold leading-tight">Darslinker AI</p>
                <p className="text-[10px] opacity-80">Kurs maslahatchi</p>
              </div>
            </div>
            {!isPanel && (
              <button type="button" onClick={() => setFloatingOpen(false)} className="rounded-full p-1 hover:bg-white/20">
                <X className="size-5" />
              </button>
            )}
          </header>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
            <AiChatBody chat={chat} skin="widget" />
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
});
