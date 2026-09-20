"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { X, ArrowUpRight } from "lucide-react";
import { InstagramIcon, TelegramIcon } from "@/components/social-icons";

const INSTAGRAM_URL = "https://www.instagram.com/darslinker";
const TELEGRAM_URL = "https://t.me/darslinker";

// Trigger qoidalari (foydalanuvchi bilan kelishilgan):
//  - kirgandan keyin dastlabki 10 soniyada hech qachon chiqmaydi
//  - "time": 2-sahifaga o'tgan va shu sahifada 20 soniya turgan
//  - "scroll": sahifaning yarmigacha aylantirgan
//  - "exit": (faqat kompyuter) saytdan chiqmoqchi bo'lgan
//  - ariza formasi/boshqa modal ochiq yoki matn kiritilayotgan bo'lsa kutadi
//  - har sessiyada ko'pi bilan 1 marta; ijtimoiy tarmoqqa o'tgan odamga 90 kun ko'rsatilmaydi
const MIN_SESSION_MS = 10_000;
const PAGE_DWELL_MS = 20_000;
const INPUT_QUIET_MS = 60_000;
const SCROLL_RATIO = 0.5;
const MIN_SCROLLABLE_PX = 300;
const CONVERTED_HIDE_DAYS = 90;
const CLOSE_MS = 320;

const IG_GRADIENT = "linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 78%, #515bd4 100%)";
const TG_GRADIENT = "linear-gradient(135deg, #37aee2 0%, #1e96c8 100%)";

const VISITOR_KEY = "dl_cta_vid";
const DONE_KEY = "dl_cta_done";
const SESSION_SHOWN = "dl_cta_shown";
const SESSION_T0 = "dl_cta_t0";
const SESSION_PAGES = "dl_cta_pages";
const SESSION_LAST = "dl_cta_last";

type Trigger = "time" | "scroll" | "exit";
type EventType = "shown" | "closed" | "click_instagram" | "click_telegram";
type ModalState = { impressionId: string; trigger: Trigger | "preview" };

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = newId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return newId();
  }
}

function isRecentlyConverted(): boolean {
  try {
    const t = Number(localStorage.getItem(DONE_KEY));
    return t > 0 && Date.now() - t < CONVERTED_HIDE_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

function sessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function sessionSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode — jimgina o'tkazamiz */
  }
}

function getDevice(): "mobile" | "desktop" {
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

function sendEvent(payload: {
  impressionId: string;
  eventType: EventType;
  trigger?: Trigger;
  path?: string;
  device?: "mobile" | "desktop";
}) {
  fetch("/api/cta-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, visitorId: getVisitorId() }),
    keepalive: true,
  }).catch(() => {});
}

export function SocialCtaModal() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isStaff = role === "admin" || role === "assistant";

  const [modal, setModal] = useState<ModalState | null>(null);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const titleId = useId();

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Sinash rejimi: ?cta=preview — hech narsa yozilmaydi va cheklovlar e'tiborga olinmaydi.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("cta") === "preview") {
      const t = window.setTimeout(() => setModal({ impressionId: "preview", trigger: "preview" }), 0);
      return () => window.clearTimeout(t);
    }
  }, []);

  // Sessiya soati va sahifalar sonini hisoblash (yo'l o'zgargandagina — StrictMode'da ikki marta sanamaydi).
  useEffect(() => {
    if (!sessionGet(SESSION_T0)) sessionSet(SESSION_T0, String(Date.now()));
    if (sessionGet(SESSION_LAST) !== pathname) {
      sessionSet(SESSION_LAST, pathname);
      sessionSet(SESSION_PAGES, String(Number(sessionGet(SESSION_PAGES) ?? 0) + 1));
    }
  }, [pathname]);

  // Trigger dvigateli.
  useEffect(() => {
    if (status === "loading" || isStaff || modal) return;
    if (isRecentlyConverted() || sessionGet(SESSION_SHOWN)) return;

    const t0 = Number(sessionGet(SESSION_T0)) || Date.now();
    const pageEnterAt = Date.now();
    let scrolled = false;
    let exitIntent = false;
    let lastInputAt = 0;

    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - window.innerHeight;
      if (scrollable >= MIN_SCROLLABLE_PX && window.scrollY / scrollable >= SCROLL_RATIO) {
        scrolled = true;
      }
    };
    const onInput = () => {
      lastInputAt = Date.now();
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) exitIntent = true;
    };
    const onEnter = () => {
      exitIntent = false;
    };

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const root = document.documentElement;
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("input", onInput, true);
    if (canHover) {
      root.addEventListener("mouseleave", onLeave);
      root.addEventListener("mouseenter", onEnter);
    }

    const isSuppressed = () => {
      if (document.visibilityState !== "visible") return true;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return true;
      const ae = document.activeElement as HTMLElement | null;
      if (
        ae &&
        (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.tagName === "SELECT" || ae.isContentEditable)
      ) {
        return true;
      }
      return Date.now() - lastInputAt < INPUT_QUIET_MS;
    };

    const timer = window.setInterval(() => {
      const now = Date.now();
      if (now - t0 < MIN_SESSION_MS || isSuppressed()) return;

      const pages = Number(sessionGet(SESSION_PAGES) ?? 1);
      let trigger: Trigger | null = null;
      if (pages >= 2 && now - pageEnterAt >= PAGE_DWELL_MS) trigger = "time";
      else if (scrolled) trigger = "scroll";
      else if (exitIntent) trigger = "exit";
      if (!trigger) return;

      window.clearInterval(timer);
      const impressionId = newId();
      sessionSet(SESSION_SHOWN, "1");
      setModal({ impressionId, trigger });
      sendEvent({ impressionId, eventType: "shown", trigger, path: pathname, device: getDevice() });
    }, 1000);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("input", onInput, true);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
    };
  }, [pathname, status, isStaff, modal]);

  // Modal ochilganda: fon aylanmasin, fokus dialogga (animatsiyani CSS bajaradi).
  useEffect(() => {
    if (!modal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [modal]);

  if (!modal) return null;

  const isPreview = modal.impressionId === "preview";

  // Hodisa darhol yuboriladi; oyna esa yumshoq animatsiya bilan yopiladi.
  const startClose = () => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setModal(null);
      setClosing(false);
    }, CLOSE_MS);
  };

  const handleClose = () => {
    if (closing) return;
    if (!isPreview) sendEvent({ impressionId: modal.impressionId, eventType: "closed" });
    startClose();
  };

  const handleLink = (kind: "instagram" | "telegram") => {
    if (closing) return;
    if (!isPreview) {
      sendEvent({
        impressionId: modal.impressionId,
        eventType: kind === "instagram" ? "click_instagram" : "click_telegram",
      });
      try {
        localStorage.setItem(DONE_KEY, String(Date.now()));
      } catch {
        /* ahamiyatsiz */
      }
    }
    startClose();
  };

  const closingAttr = closing ? "true" : "false";
  const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

  return (
    <div
      data-closing={closingAttr}
      className="dlcta-backdrop fixed inset-0 z-[90] flex items-center justify-center bg-[#0b0d10]/60 p-4 backdrop-blur-[3px]"
    >
      <style>{CTA_CSS}</style>

      <div
        ref={dialogRef}
        data-closing={closingAttr}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="dlcta-card relative max-h-[calc(100dvh-2rem)] w-full max-w-[420px] overflow-y-auto overscroll-contain rounded-[28px] bg-white shadow-[0_30px_80px_-20px_rgba(11,13,16,0.55)] outline-none"
      >
        {/* Yumshoq fon nuri: chapda Instagram, o'ngda Telegram ranglari */}
        <span
          aria-hidden="true"
          className="dlcta-blob pointer-events-none absolute -left-12 -top-14 h-44 w-44 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #fd5949 0%, #d6249f 70%)" }}
        />
        <span
          aria-hidden="true"
          className="dlcta-blob pointer-events-none absolute -right-14 -top-12 h-44 w-44 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #37aee2 0%, #7ea2d4 70%)", animationDelay: "-4s" }}
        />

        <button
          type="button"
          onClick={handleClose}
          aria-label="Yopish"
          className="absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-[#5b636d] shadow-sm ring-1 ring-black/5 backdrop-blur transition-all duration-300 hover:rotate-90 hover:bg-white hover:text-[#16181a]"
        >
          <X className="h-[18px] w-[18px]" />
        </button>

        <div className="relative px-5 pb-6 pt-12 sm:px-8">
          <div className="dlcta-rise flex justify-center" style={delay(0.15)}>
            <span className="inline-flex items-center rounded-full bg-[#eef3fa] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#16181a]">
              Rasmiy sahifalarimiz
            </span>
          </div>

          <h2
            id={titleId}
            className="dlcta-rise mt-4 text-center text-[21px] font-bold leading-snug tracking-[-0.01em] text-[#16181a] min-[360px]:text-[24px] sm:text-[27px]"
            style={delay(0.22)}
          >
            <span className="block">{"Darslinker'ni ijtimoiy"}</span>
            <span className="block">{"tarmoqlarda kuzating"}</span>
          </h2>

          <div className="mt-7 space-y-3">
            <SocialButton
              href={INSTAGRAM_URL}
              label="Instagramga o'tish"
              handle="@darslinker"
              gradient={IG_GRADIENT}
              icon={<InstagramIcon className="h-[22px] w-[22px] text-white" />}
              onClick={() => handleLink("instagram")}
              style={delay(0.34)}
            />
            <SocialButton
              href={TELEGRAM_URL}
              label="Telegramga o'tish"
              handle="@darslinker"
              gradient={TG_GRADIENT}
              icon={<TelegramIcon className="h-[22px] w-[22px] text-white" />}
              onClick={() => handleLink("telegram")}
              style={delay(0.42)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({
  href,
  label,
  handle,
  gradient,
  icon,
  onClick,
  style,
}: {
  href: string;
  label: string;
  handle: string;
  gradient: string;
  icon: ReactNode;
  onClick: () => void;
  style: CSSProperties;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="dlcta-rise group relative flex h-[62px] w-full items-center gap-3 overflow-hidden rounded-[18px] px-3 text-white shadow-[0_10px_22px_-10px_rgba(22,24,26,0.5)] transition-[translate,box-shadow,scale] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgba(22,24,26,0.55)] active:translate-y-0 active:scale-[0.985]"
      style={{ ...style, background: gradient }}
    >
      <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100" />
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white/20 ring-1 ring-white/20">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col text-left leading-tight">
        <span className="text-[15px] font-semibold">{label}</span>
        <span className="text-[12px] text-white/80">{handle}</span>
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </a>
  );
}

// Animatsiyalar shu komponentga tegishli (dlcta- prefiksi) — globals.css'ga tegilmaydi.
// "backwards" fill: animatsiya tugagach hover (translate/scale) effektlari ishlashda davom etadi.
const CTA_CSS = `
.dlcta-backdrop{animation:dlcta-fade .32s ease-out backwards}
.dlcta-backdrop[data-closing="true"]{animation:dlcta-fade-out ${CLOSE_MS}ms ease-in forwards}
.dlcta-card{animation:dlcta-card-in .6s cubic-bezier(.16,1,.3,1) backwards}
.dlcta-card[data-closing="true"]{animation:dlcta-card-out ${CLOSE_MS}ms cubic-bezier(.4,0,1,1) forwards}
.dlcta-rise{animation:dlcta-rise .55s cubic-bezier(.16,1,.3,1) var(--d,0s) backwards}
.dlcta-blob{animation:dlcta-blob 9s ease-in-out infinite}
@keyframes dlcta-fade{from{opacity:0}to{opacity:1}}
@keyframes dlcta-fade-out{from{opacity:1}to{opacity:0}}
@keyframes dlcta-card-in{from{opacity:0;transform:translateY(30px) scale(.92)}to{opacity:1;transform:none}}
@keyframes dlcta-card-out{from{opacity:1;transform:none}to{opacity:0;transform:translateY(16px) scale(.95)}}
@keyframes dlcta-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes dlcta-blob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(16px,-12px) scale(1.14)}}
@media (prefers-reduced-motion:reduce){
.dlcta-backdrop,.dlcta-card,.dlcta-rise,.dlcta-blob{animation:none!important}
}
`;
