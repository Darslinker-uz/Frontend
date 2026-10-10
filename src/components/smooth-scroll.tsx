"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

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
    });

    // Modal va mobil menyu sahifani `body.style.overflow = "hidden"` bilan
    // qotiradi — shu paytda Lenis ham to'xtashi kerak, aks holda orqa sahifa siljiydi.
    const sync = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  return null;
}
