"use client";

import { useEffect } from "react";

/**
 * Sahifa ochilganda yuqoriga scroll qiladi.
 * Server component sahifalarga "ScrollToTop" qo'shilsa,
 * Next.js'ning Link scroll behaviori ishonchli ishlamaydigan
 * (force-dynamic, uzun sahifalar) holatlarda ishlatamiz.
 */
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return null;
}
