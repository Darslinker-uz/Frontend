"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

type Slide = { id: string; eyebrow: React.ReactNode; render: () => React.ReactNode };

function IGMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GoogleMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden>
      <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
    </svg>
  );
}

function GPTMark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.786a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function CountUp({
  end,
  prefix = "",
  suffix = "",
  duration = 1600,
  delay = 0,
  formatComma = false,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  formatComma?: boolean;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    let startedAt = 0;
    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const elapsed = now - startedAt - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, delay]);
  const formatted = formatComma ? value.toLocaleString("ru-RU") : String(value);
  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

const SLIDES: Slide[] = [
  {
    id: "intro",
    eyebrow: null,
    render: () => null,
  },
  {
    id: "hero",
    eyebrow: "◆ Правда, о которой не говорят",
    render: () => (
      <>
        <h1 className="text-[42px] sm:text-[64px] md:text-[88px] lg:text-[104px] font-bold leading-[0.95] tracking-[-0.04em]">
          <span className="anim-fade-up inline-block" style={{ animationDelay: "0.05s" }}>
            Ваш учебный&nbsp;
          </span>
          <span className="anim-fade-up inline-block" style={{ animationDelay: "0.15s" }}>
            центр
          </span>
          <br />
          <span
            className="anim-handwrite inline-block font-[family-name:var(--font-kalam)] italic font-normal text-[#7ea2d4]"
            style={{ animationDelay: "0.4s" }}
          >
            ищут
          </span>
          <span className="anim-fade-up inline-block" style={{ animationDelay: "1.65s" }}>
            , но
          </span>
          <br />
          <span
            className="anim-fade-up inline-block text-white/30 text-[26px] sm:text-[64px] md:text-[88px] lg:text-[104px] whitespace-nowrap"
            style={{ animationDelay: "2.1s", animationDuration: "1.1s" }}
          >
            не находят.
          </span>
        </h1>
        <p
          className="anim-fade-up text-[15px] sm:text-[17px] md:text-[20px] text-white/60 mt-6 md:mt-10 max-w-[640px] leading-[1.55]"
          style={{ animationDelay: "3.1s" }}
        >
          Каждый месяц тысячи родителей ищут в Google «IELTS в Ташкенте», «курсы программирования»,
          «английский язык». Они находят не вас, а ваших конкурентов.
        </p>
      </>
    ),
  },
  {
    id: "shift",
    eyebrow: "Рынок меняется",
    render: () => (
      <div className="max-w-[1200px] w-full">
        <div className="flex items-center gap-3 md:gap-5 mb-8 md:mb-12">
          <div
            className="anim-fade-up text-[13px] md:text-[16px] font-semibold text-white/35 tabular-nums"
            style={{ animationDelay: "0.05s" }}
          >
            2020
          </div>
          <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
            <div
              className="anim-draw-right absolute inset-0 bg-gradient-to-r from-white/20 to-white/50 origin-left"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
          <div
            className="anim-fade-up text-[13px] md:text-[16px] font-semibold text-white/60 tabular-nums"
            style={{ animationDelay: "0.7s" }}
          >
            2025
          </div>
          <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
            <div
              className="anim-draw-right absolute inset-0 bg-gradient-to-r from-white/50 to-[#7ea2d4] origin-left"
              style={{ animationDelay: "0.95s" }}
            />
          </div>
          <div
            className="anim-fade-up text-[13px] md:text-[16px] font-semibold text-[#7ea2d4] tabular-nums"
            style={{ animationDelay: "1.5s" }}
          >
            2026+
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 md:gap-10">
          <div className="anim-fade-up relative overflow-hidden" style={{ animationDelay: "0.2s" }}>
            <IGMark
              className="anim-ghost absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 text-white/[0.08] pointer-events-none"
              style={{ animationDelay: "0.6s" } as React.CSSProperties}
            />
            <div className="relative z-10">
              <h3 className="text-[20px] sm:text-[24px] md:text-[32px] font-semibold leading-[1.2] tracking-[-0.02em] text-white/45 pr-20 sm:pr-0">
                Instagram-баннер
              </h3>
              <ul className="mt-4 md:mt-5 space-y-2 md:space-y-2.5 text-white/35 text-[13px] md:text-[15px]">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                  Замечали в ленте
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                  Случайный охват
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                  ROI приблизительный
                </li>
              </ul>
            </div>
          </div>
          <div
            className="anim-fade-up relative overflow-hidden sm:pl-6 md:pl-8 sm:border-l border-white/10 pt-5 sm:pt-0 border-t sm:border-t-0 border-white/10"
            style={{ animationDelay: "0.85s" }}
          >
            <GoogleMark
              className="anim-ghost absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 text-white/[0.08] pointer-events-none"
              style={{ animationDelay: "1.25s" } as React.CSSProperties}
            />
            <div className="relative z-10">
              <h3 className="text-[20px] sm:text-[24px] md:text-[32px] font-semibold leading-[1.2] tracking-[-0.02em] text-white/75 pr-20 sm:pr-0">
                Поиск в Google
              </h3>
              <ul className="mt-4 md:mt-5 space-y-2 md:space-y-2.5 text-white/55 text-[13px] md:text-[15px]">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/50 flex-shrink-0" />
                  Активно ищут
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/50 flex-shrink-0" />
                  Целевой клиент
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-white/50 flex-shrink-0" />
                  Намерение ясное
                </li>
              </ul>
            </div>
          </div>
          <div
            className="anim-fade-left relative overflow-hidden sm:pl-6 md:pl-8 sm:border-l border-white/10 pt-5 sm:pt-0 border-t sm:border-t-0 border-white/10"
            style={{ animationDelay: "1.6s" }}
          >
            <GPTMark
              className="anim-ghost absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 text-white/[0.08] pointer-events-none"
              style={{ animationDelay: "2s" } as React.CSSProperties}
            />
            <div className="relative z-10">
              <h3 className="text-[20px] sm:text-[24px] md:text-[32px] font-semibold leading-[1.2] tracking-[-0.02em] text-white pr-20 sm:pr-0">
                AI-рекомендации
              </h3>
              <ul className="mt-4 md:mt-5 space-y-2 md:space-y-2.5 text-white/70 text-[13px] md:text-[15px]">
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#7ea2d4] flex-shrink-0" />
                  ChatGPT и Gemini рекомендуют
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#7ea2d4] flex-shrink-0" />
                  Персональный ответ
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#7ea2d4] flex-shrink-0" />
                  Максимальная конверсия
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "numbers",
    eyebrow: "Цифры",
    render: () => (
      <div className="grid sm:grid-cols-3 gap-8 md:gap-12 max-w-[1100px] w-full">
        {[
          {
            big: <CountUp end={10000} formatComma suffix="+" duration={1800} />,
            l: "Поисковых запросов в месяц",
            d: "Реальный объём поиска в Google &mdash; растёт год от года.",
            delay: 0.05,
          },
          {
            big: <CountUp end={93} suffix="%" duration={1500} delay={250} />,
            l: "Учитывают отзывы",
            d: "BrightLocal 2025: при выборе клиенты ориентируются на онлайн-отзывы.",
            delay: 0.25,
          },
          {
            big: <span>1-4 недели</span>,
            l: "Появитесь в Google",
            d: "Создать сайт и SEO &mdash; 3-6 месяцев. В Darslinker &mdash; 1-4 недели.",
            delay: 0.45,
          },
        ].map((s, i) => (
          <div key={i} className="anim-fade-up" style={{ animationDelay: `${s.delay}s` }}>
            <div className="text-[48px] sm:text-[58px] md:text-[80px] font-bold leading-[0.95] tracking-[-0.04em] text-[#7ea2d4] tabular-nums">
              {s.big}
            </div>
            <div className="text-[16px] md:text-[19px] font-semibold mt-4">{s.l}</div>
            <p
              className="text-[13px] md:text-[14px] text-white/50 mt-2 md:mt-3 leading-[1.6]"
              dangerouslySetInnerHTML={{ __html: s.d }}
            />
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "stakes",
    eyebrow: "Выбор",
    render: () => (
      <>
        <h2 className="text-[32px] sm:text-[48px] md:text-[72px] font-bold leading-[1.05] tracking-[-0.03em] max-w-[1000px]">
          <span className="anim-fade-up inline-block" style={{ animationDelay: "0.05s" }}>
            Каждый день вас не находят &mdash;&nbsp;
          </span>
          <span className="anim-fade-up inline-block" style={{ animationDelay: "0.55s" }}>
            находят&nbsp;
          </span>
          <span
            className="anim-handwrite inline-block font-[family-name:var(--font-kalam)] italic font-normal text-[#7ea2d4]"
            style={{ animationDelay: "1.05s" }}
          >
            конкурента
          </span>
          <span className="anim-fade-up inline-block" style={{ animationDelay: "2.3s" }}>
            .
          </span>
        </h2>
        <p
          className="anim-fade-up text-[15px] sm:text-[17px] md:text-[20px] text-white/55 mt-6 md:mt-10 max-w-[640px] leading-[1.55]"
          style={{ animationDelay: "2.8s" }}
        >
          Создать сайт и попасть в топ Google &mdash; 3-6 месяцев и большие расходы. На рекламу &mdash;
          каждый месяц новые инвестиции. А Darslinker уже сегодня показывает вас клиентам.
        </p>
      </>
    ),
  },
  {
    id: "verb-1",
    eyebrow: "Darslinker · 1 / 3",
    render: () => <VerbSlide word="Вас ищут." body="Домен готов, schema markup готов, SEO готов. Вы только заполняете профиль — Google вас видит." />,
  },
  {
    id: "verb-2",
    eyebrow: "Darslinker · 2 / 3",
    render: () => <VerbSlide word="Вас находят." body="Фильтры: направление, район, цена, формат. Ученик доходит точно до вашего курса." />,
  },
  {
    id: "verb-3",
    eyebrow: "Darslinker · 3 / 3",
    render: () => <VerbSlide word="С вами связываются." body="Заявка попадает в CRM, в Telegram приходит мгновенно, телефон виден." />,
  },
  {
    id: "pricing",
    eyebrow: (
      <>
        <span className="text-white/40">Присоединиться к </span>Darslinker
      </>
    ),
    render: () => <PricingSlide />,
  },
  {
    id: "cta",
    eyebrow: "Не завтра",
    render: () => (
      <>
        <h2 className="text-[44px] sm:text-[64px] md:text-[96px] lg:text-[120px] font-bold leading-[0.95] tracking-[-0.04em]">
          <span className="anim-fade-up inline-block" style={{ animationDelay: "0.05s" }}>
            Начните&nbsp;
          </span>
          <span
            className="anim-handwrite inline-block font-[family-name:var(--font-kalam)] italic font-normal text-[#7ea2d4]"
            style={{ animationDelay: "0.5s" }}
          >
            сегодня
          </span>
          <span className="anim-pop inline-block" style={{ animationDelay: "1.7s" }}>
            .
          </span>
        </h2>
        <p
          className="anim-fade-up text-[15px] sm:text-[17px] md:text-[20px] text-white/55 mt-6 md:mt-10 max-w-[600px] leading-[1.55]"
          style={{ animationDelay: "2s" }}
        >
          Оставляете заявку &mdash; менеджер свяжется в течение 24 часов. Профиль готов за 1 день.
          Первые заявки &mdash; через 1-4 недели.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10 md:mt-14">
          <Link
            href="/hamkorlik"
            className="anim-fade-up group inline-flex items-center gap-3 text-[18px] sm:text-[22px] md:text-[28px] font-semibold border-b-2 border-[#7ea2d4] pb-2 hover:gap-5 transition-all"
            style={{ animationDelay: "2.6s" }}
          >
            <span>Стать партнёром</span>
            <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-[#7ea2d4] group-hover:rotate-12 transition-transform" />
          </Link>
          <Link
            href="/"
            className="anim-fade-up group inline-flex items-center gap-2 text-[15px] sm:text-[17px] md:text-[20px] font-medium text-white/60 hover:text-white pb-2 transition-colors"
            style={{ animationDelay: "2.85s" }}
          >
            <span>На основной сайт</span>
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
      </>
    ),
  },
];

const PRICING_FEATURES = [
  "Профиль и неограниченное число курсов",
  "Полная индексация в Google",
  "Показ в AI-рекомендациях",
  "CRM-кабинет + Telegram-бот",
  "Заявки в реальном времени + телефон",
  "Рейтинг, отзывы, статистика",
];

function CheckIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#7ea2d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PricingNumbersVariant() {
  return (
    <div className="max-w-[1100px] w-full">
      <h2 className="anim-fade-up text-[28px] sm:text-[40px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.03em]" style={{ animationDelay: "0.05s" }}>
        Два варианта.
      </h2>
      <p className="anim-fade-up text-[13px] md:text-[16px] text-white/45 mt-2 md:mt-3" style={{ animationDelay: "0.2s" }}>
        Одинаковые возможности, разные сроки.
      </p>
      <div className="grid grid-cols-2 gap-6 sm:gap-10 md:gap-20 mt-8 md:mt-14">
        <div className="anim-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">3 месяца</div>
          <div className="text-[48px] sm:text-[72px] md:text-[112px] font-bold mt-2 leading-none tracking-[-0.04em] tabular-nums">
            $200
          </div>
        </div>
        <div className="anim-fade-up relative" style={{ animationDelay: "0.55s" }}>
          <div className="absolute -top-1 sm:-top-2 right-0 px-2 py-0.5 md:py-1 bg-[#7ea2d4] text-[#0a0c10] text-[9px] md:text-[10px] font-bold tracking-[0.15em] rounded">
            РЕКОМЕНДУЕМ
          </div>
          <div className="text-[10px] md:text-[12px] font-semibold uppercase tracking-[0.2em] text-[#7ea2d4]">6 месяцев</div>
          <div className="text-[48px] sm:text-[72px] md:text-[112px] font-bold mt-2 leading-none tracking-[-0.04em] tabular-nums text-[#7ea2d4]">
            $300
          </div>
          <div className="text-[12px] md:text-[14px] text-[#fbbf24] mt-2 md:mt-3 tabular-nums font-medium opacity-50">Скидка 25%</div>
        </div>
      </div>
      <div className="mt-8 md:mt-14 grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2 md:gap-y-3 pt-6 md:pt-8 border-t border-white/10">
        {PRICING_FEATURES.map((f, i) => (
          <div key={i} className="anim-fade-up flex items-center gap-2.5 text-[12px] md:text-[14px] text-white/60" style={{ animationDelay: `${0.7 + i * 0.05}s` }}>
            <CheckIcon className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingSlide() {
  return <PricingNumbersVariant />;
}

function IntroSlide({ next }: { next: () => void }) {
  useEffect(() => {
    const t = setTimeout(next, 3000);
    return () => clearTimeout(t);
  }, [next]);

  return (
    <div className="max-w-[1280px] w-full">
      <div
        className="anim-fade-up text-[11px] md:text-[12px] font-medium tracking-[0.2em] uppercase text-[#7ea2d4] mb-6 md:mb-10"
        style={{ animationDelay: "0s" }}
      >
        ◆ Демо
      </div>
      <h1
        className="anim-fade-up text-[44px] sm:text-[72px] md:text-[104px] lg:text-[128px] font-bold leading-[0.95] tracking-[-0.04em]"
        style={{ animationDelay: "0.15s" }}
      >
        Почему{" "}
        <span className="text-[#7ea2d4]">Darslinker</span>?
      </h1>
      <p
        className="anim-fade-up text-[16px] sm:text-[20px] md:text-[24px] text-white/50 mt-6 md:mt-10"
        style={{ animationDelay: "0.55s" }}
      >
        Ответ за 3 минуты.
      </p>
      <div
        className="anim-fade-up mt-12 md:mt-20 flex items-center gap-4 md:gap-6 max-w-[640px]"
        style={{ animationDelay: "0.9s" }}
      >
        <div className="flex-1 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
          <div className="anim-fill-bar absolute inset-y-0 left-0 bg-[#7ea2d4] rounded-full" />
        </div>
        <button
          onClick={next}
          className="text-[12px] md:text-[14px] text-white/50 hover:text-white transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          Начать
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function VerbSlide({ word, body }: { word: string; body: string }) {
  return (
    <div className="relative pl-5 md:pl-8">
      <span
        className="anim-draw-down absolute left-0 top-0 bottom-0 w-[2px] md:w-[4px] bg-[#7ea2d4] origin-top"
        style={{ animationDelay: "0.25s" }}
      />
      <h2
        className="anim-scale-in text-[56px] sm:text-[88px] md:text-[140px] lg:text-[180px] font-bold leading-[0.9] tracking-[-0.04em]"
        style={{ animationDelay: "0.45s" }}
      >
        {word}
      </h2>
      <p
        className="anim-fade-up text-[15px] sm:text-[17px] md:text-[20px] text-white/55 mt-6 md:mt-10 max-w-[720px] leading-[1.55] min-h-[78px] sm:min-h-[88px] md:min-h-[104px]"
        style={{ animationDelay: "1.05s" }}
      >
        {body}
      </p>
    </div>
  );
}

export function VariantBRu() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  useEffect(() => {
    let startX = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) {
        if (dx < 0) next();
        else prev();
      }
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  const slide = SLIDES[current];
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const isIntro = slide.id === "intro";

  return (
    <div className="fixed inset-0 bg-[#0a0c10] text-white overflow-hidden flex flex-col">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes handwrite {
          from { clip-path: inset(-0.1em 100% -0.1em 0); }
          to { clip-path: inset(-0.1em -0.2em -0.1em 0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88); letter-spacing: -0.02em; }
          to { opacity: 1; transform: scale(1); letter-spacing: -0.04em; }
        }
        @keyframes drawDown {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes drawRight {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0); }
          60% { transform: scale(1.25); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ghostIn {
          from { opacity: 0; transform: scale(0.7) rotate(-8deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes fillBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .anim-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; opacity: 0; }
        .anim-fade-left { animation: fadeLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; opacity: 0; }
        .anim-handwrite { animation: handwrite 1.2s cubic-bezier(0.45, 0, 0.55, 1) both; clip-path: inset(-0.1em -0.2em -0.1em 0); padding-right: 0.15em; }
        .anim-scale-in { animation: scaleIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; opacity: 0; }
        .anim-draw-down { animation: drawDown 0.8s ease-out both; transform: scaleY(0); }
        .anim-draw-right { animation: drawRight 0.9s cubic-bezier(0.45, 0, 0.15, 1) both; transform: scaleX(0); transform-origin: left; }
        .anim-pop { animation: popIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; opacity: 0; }
        .anim-ghost { animation: ghostIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) both; opacity: 0; }
        .anim-fill-bar { animation: fillBar 3s linear forwards; width: 0%; }
      `}</style>

      <header className="flex-shrink-0 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-4 md:py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DarslinkerLogo size={36} />
            <span className="text-[18px] md:text-[20px] font-semibold tracking-tight">Darslinker</span>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            {!isIntro && (
              <>
                <div className="hidden sm:flex items-center gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Слайд ${i + 1}`}
                      className={`h-1 rounded-full transition-all ${
                        i === current ? "w-6 bg-[#7ea2d4]" : "w-1.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[11px] md:text-[12px] tabular-nums text-white/50 font-medium hidden sm:block">
                  <span className="text-white">{String(current + 1).padStart(2, "0")}</span>
                  <span className="text-white/30"> / {String(total).padStart(2, "0")}</span>
                </div>
              </>
            )}
            <Link
              href="/hamkorlik"
              className="group inline-flex items-center gap-1.5 md:gap-2 h-[36px] md:h-[40px] px-4 md:px-5 rounded-full bg-[#7ea2d4] text-[#0a0c10] text-[12px] md:text-[13px] font-semibold hover:bg-white transition-colors"
            >
              <span>Заявка</span>
              <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col justify-center">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 w-full">
          {!isIntro && slide.eyebrow && (
            <div
              key={`eb-${current}`}
              className="anim-fade-up text-[11px] md:text-[12px] font-medium tracking-[0.2em] uppercase text-[#7ea2d4] mb-6 md:mb-10"
              style={{ animationDelay: "0s" }}
            >
              {slide.eyebrow}
            </div>
          )}
          {slide.id.startsWith("verb-") && (
            <div className="text-[18px] md:text-[24px] text-white/50 mb-4 md:mb-6">
              Ваш центр в Darslinker:
            </div>
          )}
          <div key={`c-${current}`}>
            {isIntro ? <IntroSlide next={next} /> : slide.render()}
          </div>
        </div>
      </main>

      {!isIntro && (
      <footer className="flex-shrink-0 border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-4 md:py-5 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={isFirst}
            className={`group inline-flex items-center gap-2 md:gap-3 h-[44px] md:h-[48px] px-4 md:px-5 rounded-full border border-white/10 text-[13px] md:text-[14px] font-medium transition-all ${
              isFirst ? "opacity-30 cursor-not-allowed" : "hover:border-white/30 hover:bg-white/5"
            }`}
            aria-label="Назад"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Назад</span>
          </button>

          <button
            onClick={next}
            disabled={isLast}
            className={`group inline-flex items-center gap-2 md:gap-3 h-[44px] md:h-[48px] px-4 md:px-5 rounded-full border text-[13px] md:text-[14px] font-medium transition-all ${
              isLast
                ? "opacity-30 cursor-not-allowed border-white/10"
                : "border-[#7ea2d4] bg-[#7ea2d4] text-[#16181a] hover:bg-[#7ea2d4]/90"
            }`}
            aria-label="Далее"
          >
            <span className="hidden sm:inline">Далее</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </footer>
      )}
    </div>
  );
}
