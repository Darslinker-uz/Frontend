"use client";

import { useEffect } from "react";

// Detail sahifa mount bo'lganda view'ni 1 ga oshiradi.
// Sessiya davomida bir e'lon faqat 1 marta hisoblanadi (sessionStorage'da dedup).
// Prefetch va StrictMode'dan ta'sirlanmaydi — faqat haqiqiy ko'rish.
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `darslinker:viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/listings/${slug}`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      sessionStorage.removeItem(key);
    });
  }, [slug]);

  return null;
}
