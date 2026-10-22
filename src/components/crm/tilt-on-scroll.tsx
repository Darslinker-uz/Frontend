"use client";

import { useEffect, useRef, type ReactNode } from "react";

const NAVBAR_H = 62;
const DROP = 190; // px — kartalar joylashganda pastga tushadigan masofa
const XL = "(min-width: 1280px)";
const TRIGGER = 0.5; // hero'ning 50% i scroll qilinganda kartalar o'zi joylashadi
const RESET = 0.1; // shundan yuqoriga qaytilganda asl holatga qaytadi (oraliq — titrashning oldini oladi)
const DURATION = 1200; // ms — joylashish animatsiyasi
const RETURN_DURATION = 1800; // ms — asl holatga qaytish (sekinroq, hamma karta birga)

// Ichidagi `[data-tilt-card]` kartalar `--tilt` burchagida qiyshiq turadi. Scroll TRIGGER chegarasidan
// o'tganda ular scroll'ni kutmasdan, o'zi "magnit" bilan joylashadi: avval pastga tortilib biroz
// o'tib ketadi va qaytadi, keyin tik turadi. O'ngdan chapga navbat bilan. Tepaga qaytilganda hammasi
// birga, sekinroq va silliq asl holatga qaytadi.

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
const easeOutBack = (x: number) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);

type Pose = { rotate: number; y: number; scale: number };

function pose(p: number, i: number, n: number, tilt: number): Pose {
  const local = clamp01((p - (n - 1 - i) * 0.08) / 0.76);
  const drop = easeOutBack(clamp01(local / 0.7));
  const straighten = easeOutCubic(clamp01((local - 0.35) / 0.65));
  return {
    rotate: tilt * (1 - straighten),
    y: DROP * drop,
    scale: 1,
  };
}

// `behind` — kartalar ortida turadigan qatlam (masalan, ochiladigan matn); unga va kartalarga
// scroll progressi `--p` CSS o'zgaruvchisi sifatida beriladi.
export function TiltOnScroll({ className, behind, children }: { className?: string; behind?: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-tilt-card]"));
    const tilts = cards.map((c) => parseFloat(c.style.getPropertyValue("--tilt")) || 0);
    const xl = window.matchMedia(XL);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let target = 0; // 0 — asl holat, 1 — joylashgan
    let dir = 0; // hozirgi animatsiya yo'nalishi: 1 — joylashish, 0 — qaytish
    let u = 1; // hozirgi animatsiya progressi (1 — tugagan)
    let last = 0;
    const origin = (i: number): Pose => ({ rotate: tilts[i], y: 0, scale: 1 });
    // Har kartaning hozirgi va animatsiya boshidagi holati — yo'nalish o'zgarganda sakrashsiz davom etish uchun.
    let current: Pose[] = cards.map((_, i) => origin(i));
    let start: Pose[] = current;

    const scrollProgress = () => {
      const docTop = el.getBoundingClientRect().top + window.scrollY;
      return window.scrollY / Math.max(docTop - NAVBAR_H, 1);
    };

    const poseAt = (i: number): Pose => {
      const o = origin(i);
      const s = start[i];
      if (dir === 1) {
        // Magnit joylashish; boshlang'ich farq (agar qaytish o'rtasida bo'lsa) asta yo'qoladi.
        const m = pose(u, i, cards.length, tilts[i]);
        const k = 1 - easeOutCubic(u);
        return { rotate: m.rotate + (s.rotate - o.rotate) * k, y: m.y + (s.y - o.y) * k, scale: m.scale + (s.scale - o.scale) * k };
      }
      // Qaytish: hamma karta bir vaqtda, bir xil silliq egri bilan.
      const e = easeInOutCubic(u);
      return { rotate: s.rotate + (o.rotate - s.rotate) * e, y: s.y + (o.y - s.y) * e, scale: s.scale + (o.scale - s.scale) * e };
    };

    const render = () => {
      el.style.setProperty("--p", String(target));
      current = cards.map((c, i) => {
        const p = poseAt(i);
        c.style.rotate = `${p.rotate.toFixed(3)}deg`;
        c.style.transform = `translate3d(0, ${p.y.toFixed(2)}px, 0) scale(${p.scale.toFixed(4)})`;
        return p;
      });
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = last ? now - last : 0;
      last = now;
      u = Math.min(u + dt / (dir === 1 ? DURATION : RETURN_DURATION), 1);
      render();
      if (u < 1) frame = requestAnimationFrame(tick);
      else last = 0;
    };

    // Yangi yo'nalishda animatsiyani hozirgi holatdan boshlash.
    const go = (to: number) => {
      target = to;
      dir = to;
      start = current;
      u = reduced.matches ? 1 : 0;
      if (u === 1) render();
      else if (!frame) frame = requestAnimationFrame(tick);
    };

    const check = () => {
      if (!xl.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        target = dir = 0; // xl'ga qaytilganda CSS'dagi asl holatdan qayta boshlanadi
        u = 1;
        current = start = cards.map((_, i) => origin(i));
        el.style.removeProperty("--p");
        cards.forEach((c) => { c.style.rotate = ""; c.style.transform = ""; });
        return;
      }
      const sp = scrollProgress();
      if (sp >= TRIGGER && target !== 1) go(1);
      else if (sp <= RESET && target !== 0) go(0);
    };

    // Sahifa scroll chegarasidan pastda ochilsa ham, kartalar odatdagi joylashish animatsiyasini bajaradi.
    if (xl.matches) {
      if (scrollProgress() >= TRIGGER) {
        target = dir = 1;
        start = current;
        u = reduced.matches ? 1 : 0;
      }
      render();
      if (target === 1 && u < 1) frame = requestAnimationFrame(tick);
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {behind}
      <div className={`relative z-10 ${className ?? ""}`}>{children}</div>
    </div>
  );
}
