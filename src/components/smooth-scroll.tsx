"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const isLocked = () => document.body.style.overflow === "hidden";

// Joriy Lenis nusxasi — Lenis yo'q sahifalarda (admin, landing) null.
let instance: Lenis | null = null;

// Sahifa tepasiga silliq qaytish: Lenis bo'lsa u orqali, bo'lmasa brauzerning o'zi.
export function scrollToTop() {
  if (instance) instance.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

// Sahifadagi bo'limga silliq o'tish (navbar havolalari). Bo'lim `scroll-margin-top` (scroll-mt-*)
// qadar navbar ostida to'xtaydi. Harakatni kamaytirish yoqilgan bo'lsa — darhol.
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = -(parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) {
    instance.scrollTo(el, { offset, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
}

// Elementni ekranning qoq o'rtasiga silliq olib kelish. Element ekrandan baland bo'lsa —
// tepasi navbar (88px) ostiga keladi.
export function scrollToCenter(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const NAV = 88;
  const free = window.innerHeight - NAV;
  const offset = rect.height < free ? -(NAV + (free - rect.height) / 2) : -NAV;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) {
    instance.scrollTo(el, { offset, duration: 1, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else {
    window.scrollTo({ top: window.scrollY + rect.top + offset, behavior: reduced ? "auto" : "smooth" });
  }
}

// Inertsiyali (yumshoq) g'ildirak scroll'i — faqat ochiq sahifalarda (MainShell).
// Sensorli ekranda brauzerning o'z scroll'i qoladi; `prefers-reduced-motion`
// yoqilgan bo'lsa Lenis o'zi o'chadi.
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      // Modal, filtr paneli, chat kabi ichki scroll'li bloklar o'zi scroll bo'ladi.
      allowNestedScroll: true,
      // Ichki havola bosilganda inertsiya to'xtaydi — yangi sahifa tepadan ochiladi.
      stopInertiaOnNavigate: true,
      // Modal va mobil menyu sahifani `body.style.overflow = "hidden"` bilan
      // qotiradi — shu paytda g'ildirak hodisalarini Lenis'ga o'tkazmaymiz.
      // `lenis.stop()` ISHLATILMAYDI: u <html> ga `overflow: clip` qo'yadi, natijada
      // body scroll konteynerga aylanib, sticky navbar sahifa tepasiga "qochadi".
      virtualScroll: () => !isLocked(),
    });

    instance = lenis;

    // Qotirilgan zahoti davom etayotgan inertsiyani ham to'xtatamiz.
    const sync = () => {
      if (isLocked()) lenis.scrollTo(window.scrollY, { immediate: true });
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);

  return null;
}
