"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, Send, Trash2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export function GptOziChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
  }, []);

  useEffect(() => {
    scrollDown();
  }, [messages, loading, scrollDown]);

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setInput("");
    setError(null);
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/gptozi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Xatolik");
        return;
      }
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply! }]);
      }
    } catch {
      setError("Tarmoq xatosi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-[#f0f2f3]">
      <header className="flex shrink-0 items-center gap-3 border-b border-[#e4e7ea] bg-white px-4 py-3">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-full border border-[#dce6f2] text-[#2d5a8a] hover:bg-[#eef4fc]"
          aria-label="Bosh sahifa"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-[#16181a]">GPT ozi</h1>
          <p className="text-[11px] text-[#6a7585]">Promptsiz — to&apos;g&apos;ridan-to&apos;g&apos;ri API</p>
        </div>
        <button
          type="button"
          onClick={clearChat}
          className="flex size-9 items-center justify-center rounded-full border border-[#dce6f2] text-[#6a7585] hover:bg-[#eef4fc]"
          aria-label="Chatni tozalash"
        >
          <Trash2 className="size-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !loading && (
          <p className="text-center text-sm text-[#6a7585]">Savolingizni yozing — javob shu yerda chiqadi.</p>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="mb-3 flex justify-end">
              <div className="max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[#2d5a8a] px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="mb-3 max-w-[95%] whitespace-pre-wrap text-[13px] leading-relaxed text-[#16181a]">
              {m.content}
            </div>
          )
        )}
        {loading && (
          <p className="animate-pulse text-[12px] text-[#6a7585]">Yozmoqda...</p>
        )}
        {error && <p className="text-[12px] text-red-600">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <footer className="shrink-0 border-t border-[#e4e7ea] bg-white p-3">
        <div className="mx-auto flex max-w-3xl gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={1}
            placeholder="Xabar..."
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-[#dce6f2] px-3 py-2.5 text-[14px] outline-none focus:border-[#7ea2d4]"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#2d5a8a] text-white disabled:opacity-40"
          >
            <Send className="size-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
