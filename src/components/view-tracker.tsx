"use client";

import { useEffect } from "react";

function getOrCreateSessionId(): string {
  try {
    const KEY = "darslinker:sid";
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = (crypto?.randomUUID?.() ?? `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

// Detail sahifa mount bo'lganda view'ni 1 ga oshiradi va event log'ga yozadi.
// Sessiya davomida bir e'lon faqat 1 marta hisoblanadi (sessionStorage'da dedup).
// Prefetch va StrictMode'dan ta'sirlanmaydi — faqat haqiqiy ko'rish.
// sessionId — localStorage'da saqlanadi, unique visitor hisobi uchun.
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const dedupKey = `darslinker:viewed:${slug}`;
    if (sessionStorage.getItem(dedupKey)) return;
    sessionStorage.setItem(dedupKey, "1");
    const sessionId = getOrCreateSessionId();
    const referrer = (() => {
      try { return document.referrer || null; } catch { return null; }
    })();
    fetch(`/api/listings/${slug}`, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, referrer }),
    }).catch(() => {
      sessionStorage.removeItem(dedupKey);
    });
  }, [slug]);

  return null;
}
