"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WebAiAction, WebAiResponse, WebAiUi, AiChatSurface } from "@/lib/web-ai-types";

export type ChatMsg = { role: "user" | "assistant"; content: string };

const DEFAULT_SESSION_KEY = "darslinker_ai_session";

function surfaceFromSessionKey(sessionKey: string): AiChatSurface {
  return sessionKey === "darslinker_aikurs_session" ? "aikurs" : "web";
}

async function callAi(
  sessionId: string,
  action: WebAiAction,
  surface: AiChatSurface
): Promise<WebAiResponse> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, action, surface }),
  });
  return res.json();
}

export function useAiChat(sessionKey = DEFAULT_SESSION_KEY) {
  const surface = surfaceFromSessionKey(sessionKey);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [ui, setUi] = useState<WebAiUi | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ action: WebAiAction; userLabel?: string } | null>(
    null
  );
  const [ready, setReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initStarted = useRef(false);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
  }, []);

  const applyResponse = useCallback(
    (data: WebAiResponse) => {
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
    },
    [scrollDown]
  );

  const send = useCallback(
    async (action: WebAiAction, userLabel?: string) => {
      setLoading(true);
      setError(null);
      if (userLabel) {
        setMessages(prev => [...prev, { role: "user", content: userLabel }]);
      }
      try {
        const sid =
          sessionId ||
          (typeof window !== "undefined" ? localStorage.getItem(sessionKey) : null) ||
          "";
        const data = await callAi(sid, action, surface);
        if (data.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem(sessionKey, data.sessionId);
        }
        applyResponse(data);
      } catch {
        setError("Tarmoq xatosi");
      } finally {
        setLoading(false);
      }
    },
    [sessionId, applyResponse, sessionKey, surface]
  );

  const ensureInit = useCallback(async () => {
    const stored = localStorage.getItem(sessionKey);
    if (stored) {
      setSessionId(stored);
      setReady(true);
      return stored;
    }
    if (initStarted.current) return sessionId;
    initStarted.current = true;
    setLoading(true);
    try {
      const data = await callAi("", { type: "init" }, surface);
      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(sessionKey, data.sessionId);
      }
      applyResponse(data);
      setReady(true);
      return data.sessionId;
    } catch {
      setError("Tarmoq xatosi");
      return null;
    } finally {
      setLoading(false);
    }
  }, [sessionId, applyResponse, sessionKey, surface]);

  const queueAction = useCallback((action: WebAiAction, userLabel?: string) => {
    setPendingAction({ action, userLabel });
  }, []);

  useEffect(() => {
    if (!pendingAction || loading) return;
    if (!sessionId && !localStorage.getItem(sessionKey)) return;
    const { action, userLabel } = pendingAction;
    setPendingAction(null);
    void send(action, userLabel);
  }, [pendingAction, sessionId, loading, send, sessionKey]);

  useEffect(() => {
    scrollDown();
  }, [messages, ui, scrollDown]);

  const onSubmitText = useCallback(() => {
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
  }, [loading, ui, phone, input, send]);

  return {
    sessionId,
    messages,
    ui,
    input,
    setInput,
    phone,
    setPhone,
    loading,
    error,
    ready,
    bottomRef,
    send,
    ensureInit,
    queueAction,
    onSubmitText,
  };
}

export { AI_QUESTION_KEYS, AIKURS_QUIZ_KEYS } from "@/lib/web-ai-types";
