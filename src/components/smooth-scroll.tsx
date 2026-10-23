"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  // Maqsad aniq son sifatida hisoblanadi: Lenis elementga scroll qilganda scroll-margin'ni o'zi ham
  // qo'shadi — element berilsa margin ikki marta hisoblanib, bo'lim navbar'dan uzoqda to'xtardi.
  const top = window.scrollY + el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) {
    instance.scrollTo(Math.max(0, top), { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
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
    instance.scrollTo(Math.max(0, window.scrollY + rect.top + offset), { duration: 1, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else {
    window.scrollTo({ top: window.scrollY + rect.top + offset, behavior: reduced ? "auto" : "smooth" });
  }
}

// Element ekranning qoq o'rtasiga kelishi uchun kerakli scrollY (joriy joylashuv bo'yicha).
// Element ekrandan baland bo'lsa — tepasi navbar (88px) ostiga keladi.
export function centerTarget(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const NAV = 88;
  const free = window.innerHeight - NAV;
  return Math.max(0, window.scrollY + rect.top - (rect.height < free ? NAV + (free - rect.height) / 2 : NAV));
}

// Berilgan scrollY'ga tez va silliq o'tish (Lenis bo'lsa u orqali).
export function scrollToY(y: number, duration = 0.45) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) {
    instance.scrollTo(y, { duration, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else {
    window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  }
}

// Ochilayotgan kartani ochilish animatsiyasi bilan BIR VAQTDA, tez (0.4s) ekran o'rtasiga olib kelish.
// Yakuniy holat oldindan hisoblanadi: finalHeight — karta ochilgandagi balandligi, shiftAbove —
// yuqorida yopilayotgan karta bo'shatadigan joy (karta shuncha yuqoriga suriladi).
export function scrollToFutureCenter(el: HTMLElement, finalHeight: number, shiftAbove = 0) {
  const NAV = 88;
  const free = window.innerHeight - NAV;
  const top = window.scrollY + el.getBoundingClientRect().top - shiftAbove;
  const target = Math.max(0, finalHeight < free ? top - NAV - (free - finalHeight) / 2 : top - NAV);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) {
    instance.scrollTo(target, { duration: 0.4, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else {
    window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
  }
}

// Yig'iluvchi panelning (grid 0fr → 1fr) ochilganda qo'shiladigan balandligi.
// Panel ichidagi birinchi bola overflow-hidden — uning scrollHeight'i to'liq kontent balandligi.
export function panelGrowth(panel: HTMLElement | null) {
  const inner = panel?.firstElementChild as HTMLElement | null;
  if (!panel || !inner) return 0;
  return inner.scrollHeight - panel.offsetHeight;
}

// Inertsiyali (yumshoq) g'ildirak scroll'i — faqat ochiq sahifalarda (MainShell).
// Sensorli ekranda brauzerning o'z scroll'i qoladi; `prefers-reduced-motion`
// yoqilgan bo'lsa Lenis o'zi o'chadi.
// body qotirig'i (modal / mobil menyu) olinishini kutib, so'ng `fn` ni chaqiradi (eng ko'pi ~1 soniya).
function whenUnlocked(fn: () => void) {
  let tries = 0;
  const tick = () => {
    if (!isLocked() || tries++ > 60) requestAnimationFrame(fn);
    else requestAnimationFrame(tick);
  };
  tick();
}

// Boshqa sahifadan "/sahifa#bo'lim" havolasi bosilganda — yangi sahifa tepadan ochilib, so'ng bo'limga
// silliq tushish uchun maqsad shu yerda saqlanadi (Next'ning o'zi hash'ga keskin sakraydi).
const PENDING_KEY = "dl_scroll_to";

export function SmoothScroll() {
  const pathname = usePathname();
  const router = useRouter();

  // Butun sayt bo'yicha: navbar, footer, hero va boshqa joydagi "#bo'lim" havolalari doim silliq scroll.
  // Capture bosqichida — Next <Link> o'z onClick'ida hash'ga keskin sakrashidan oldin ushlaymiz
  // (preventDefault'dan keyin Link navigatsiya qilmaydi; navbar'ning o'z onClick'i menyuni yopishda davom etadi).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      e.preventDefault();
      if (url.pathname === window.location.pathname) {
        window.history.replaceState(null, "", `#${id}`);
        // Mobil menyu ochiq bo'lsa (body qotirilgan) — qotirig'i haqiqatda olinguncha kutamiz (aks holda
        // qotirish sinxroni scroll'ni yarim yo'lda to'xtatadi); keyin bir kadr kutib boshlaymiz.
        whenUnlocked(() => scrollToSection(id));
      } else {
        try { window.sessionStorage.setItem(PENDING_KEY, id); } catch {}
        router.push(url.pathname + url.search);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // Yangi sahifaga o'tilgach: saqlangan bo'lim bo'lsa — sahifa chizilib bo'lgach unga silliq tushamiz.
  useEffect(() => {
    let id: string | null = null;
    try {
      id = window.sessionStorage.getItem(PENDING_KEY);
      window.sessionStorage.removeItem(PENDING_KEY);
    } catch {}
    if (!id) return;
    const target = id;
    // Next yangi sahifani tepaga o'tkazib, kontent joylashib bo'lgach (rasm/shriftlar) boshlaymiz —
    // erta boshlansa Next'ning "tepaga" scroll'i animatsiyani yarim yo'lda to'xtatadi.
    const timer = window.setTimeout(() => {
      window.history.replaceState(null, "", `#${target}`);
      scrollToSection(target);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [pathname]);

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
