"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { scrollToCenter } from "@/components/smooth-scroll";
import { Users, CalendarDays, ClipboardCheck, Wallet, KanbanSquare, LayoutDashboard, FileSpreadsheet, ShieldCheck, Trophy, Check, AlertTriangle, ChevronDown, type LucideIcon } from "lucide-react";

// "Darslinker imkoniyatlari" — 9 ta asosiy CRM/LMS imkoniyati (MVP), sticky scroll ko'rinishida:
// chapda namuna sahnasi yopishib turadi, o'ngdagi ro'yxat bo'ylab scroll qilganda almashadi.
// Mobil/planshet (lg'dan kichik): "Papka" — rangli varaqlar ustma-ust, bosilganda ochiladi (MobileFolder).
// Butun blok ortida to'liq kenglikdagi och polosa.
// Barcha matn DOM'da (SEO uchun). Namunadagi ism/raqamlar — statistika emas.

type Feature = {
  id: string;
  Icon: LucideIcon;
  title: string;
  points: string[];
  Preview: () => ReactNode;
};

const FEATURES: Feature[] = [
  {
    id: "students",
    Icon: Users,
    title: "O'quvchilar",
    points: ["Holatlar: sinov → faol → ketgan", "Har o'quvchining davomati va to'lovlari bir joyda", "Quiz natijalari ham shu yerda ko'rinadi"],
    Preview: StudentsPreview,
  },
  {
    id: "schedule",
    Icon: CalendarDays,
    title: "Guruhlar va jadval",
    points: ["Kurslar, guruhlar, xonalar va o'qituvchilar", "Xona yoki o'qituvchi bandligi", "Dam olish kunlari hisobga olinadi"],
    Preview: SchedulePreview,
  },
  {
    id: "attendance",
    Icon: ClipboardCheck,
    title: "Davomat",
    points: ["O'qituvchi darsda telefondan belgilaydi", "Kelmagan o'quvchining ota-onasiga Telegram xabar", "Ilova o'rnatish shart emas"],
    Preview: AttendancePreview,
  },
  {
    id: "gamification",
    Icon: Trophy,
    title: "Gamifikatsiya",
    points: ["Jonli quiz: o'quvchilar PIN bilan telefondan qo'shiladi", "Taymer va ballar — reyting jonli yangilanadi", "Dars o'yinga aylanadi, o'quvchi zerikmaydi"],
    Preview: QuizPreview,
  },
  {
    id: "payments",
    Icon: Wallet,
    title: "To'lov va qarzdorlik",
    points: ["Naqd, karta yoki o'tkazma — chek bilan", "Kalendar yoki modul bo'yicha avtomatik qarz", "Qarzdorlar ro'yxati doim tayyor"],
    Preview: PaymentsPreview,
  },
  {
    id: "leads",
    Icon: KanbanSquare,
    title: "Lidlar",
    points: ["Kanban doska: har bir murojaat ko'z oldida", "Lidni bir bosishda o'quvchiga aylantirish"],
    Preview: LeadsPreview,
  },
  {
    id: "dashboard",
    Icon: LayoutDashboard,
    title: "Dashboard",
    points: ["8 ta asosiy ko'rsatkich", "Faol o'quvchidan qarzdorgacha", "Sinovdan keyin ketganlar alohida ko'rinadi"],
    Preview: DashboardPreview,
  },
  {
    id: "import",
    Icon: FileSpreadsheet,
    title: "Excel import",
    points: ["Mavjud ro'yxatni Excel'dan ko'chirish", "Pullik tariflarda importga yordam beramiz"],
    Preview: ImportPreview,
  },
  {
    id: "roles",
    Icon: ShieldCheck,
    title: "Rollar va huquqlar",
    points: ["Rahbar, administrator, o'qituvchi, kassir", "Har rolga faqat kerakli bo'limlar", "Ota-onalar — Telegram orqali"],
    Preview: RolesPreview,
  },
];

// Yagona rang (grafit): --a — urg'u, --s — och fon. Namunalar ham shu o'zgaruvchilardan foydalanadi.
const COLORS = { "--a": "#3d444d", "--s": "#eceef1" } as CSSProperties;

export function FeaturesExplorer() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Sarlavha o'ralganda ham namuna uning ostida, ekran ichida qoladi.
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const resize = new ResizeObserver(() => {
      sectionRef.current?.style.setProperty("--preview-top", `${88 + heading.offsetHeight + 20}px`);
    });
    resize.observe(heading);
    return () => resize.disconnect();
  }, []);

  // Faol matn va namuna kartaning haqiqiy markaziga birga bog'langan.
  useEffect(() => {
    let frame = 0;
    const updateActive = () => {
      frame = 0;
      const preview = previewRef.current;
      if (!preview || preview.getClientRects().length === 0) return;
      const rect = preview.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      let closest = 0;
      let distance = Infinity;

      items.current.forEach((item, index) => {
        if (!item) return;
        const bounds = item.getBoundingClientRect();
        // Birinchi maqola bo'limga kelganda allaqachon markazda turadi va tez o'tib ketadi —
        // uning pastki chegarasi ekran balandligining 10% iga uzaytiriladi (joylashuv o'zgarmaydi;
        // teng masofada birinchisi g'olib, chunki taqqoslash qat'iy `<`).
        const bottom = index === 0 ? bounds.bottom + window.innerHeight * 0.1 : bounds.bottom;
        // Markaz chizig'ini kesib turgan maqola; chetlarda eng yaqin maqola.
        const nextDistance = Math.max(bounds.top - center, center - bottom, 0);
        if (nextDistance < distance) {
          closest = index;
          distance = nextDistance;
        }
      });
      setActive((previous) => previous === closest ? previous : closest);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    };
    const resize = new ResizeObserver(schedule);
    [sectionRef.current, headingRef.current, previewRef.current, ...items.current].forEach(
      (element) => element && resize.observe(element),
    );
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="imkoniyatlar" aria-labelledby="features-title" style={COLORS} className="scroll-mt-24 max-w-[1600px] mx-auto bg-[var(--s)] px-5 md:px-20 py-16 md:py-24 shadow-[0_0_0_100vmax_var(--s)] [clip-path:inset(0_-100vmax)] [--preview-top:240px]">
      <div ref={headingRef} className="relative z-20 lg:sticky lg:top-[88px] flex flex-col gap-3 bg-[var(--s)] py-3 shadow-[0_-88px_0_var(--s)] md:flex-row md:items-end md:justify-between md:gap-6">
        {/* Pastdan yaqinlashgan kontent blur + gradient orqali sarlavha ortida yo'qoladi. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-full hidden h-16 backdrop-blur-[8px] lg:block [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          style={{ background: "linear-gradient(to bottom, var(--s), transparent)" }}
        />
        <div className="max-w-[640px]">
          <h2 id="features-title" className="text-[28px] md:text-[40px] font-bold tracking-[-0.035em] leading-[1.05] text-[#16181a]">
            Darslinker imkoniyatlari
          </h2>
        </div>
        <p className="max-w-[420px] text-[14px] md:text-[16px] text-[#5d6672] font-light leading-relaxed md:text-right">
          Qabulxonadan kassagacha — markazning har kungi ishi bitta tizimda.
        </p>
      </div>

      {/* Sarlavha va imkoniyatlar bir xil, uzluksiz fonda. */}
      <MobileFolder />

      <div className="mt-10 hidden py-10 md:py-14 lg:block">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] xl:gap-16">
          {/* Sahna: chapda yopishib turadi, imkoniyatlar orasida namuna silliq almashadi */}
          <div className="hidden lg:block">
            <div
              ref={previewRef}
              aria-hidden="true"
              className="sticky top-[var(--preview-top)] h-[min(520px,calc(100dvh-var(--preview-top)-24px))] overflow-hidden rounded-[32px] bg-white bg-[radial-gradient(color-mix(in_srgb,var(--a)_35%,transparent)_1px,transparent_1px)] bg-[size:20px_20px] ring-1 ring-black/[0.04]"
            >
              {FEATURES.map((f, i) => (
                <div
                  key={f.id}
                  className={`absolute inset-0 flex items-center justify-center p-10 transition-all duration-500 ${i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
                >
                  <f.Preview />
                </div>
              ))}
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
                {FEATURES.map((f, i) => (
                  <span key={f.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-[var(--a)]" : "w-1.5 bg-[#16181a]/15"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Ro'yxat: faol imkoniyat to'liq, qolganlari xira; mobilda har biri o'z namunasi bilan.
              Yuqori padding = namuna balandligining yarmi − maqola yarmi (150px): birinchi maqolaning
              markazi namuna markazi bilan bir chiziqda boshlanadi. Aks holda faol chiziq bo'limga
              kelganda birinchi maqolaning pastki chetida turib, u ~40px scroll'da o'tib ketardi. */}
          <div className="lg:pt-[max(0px,calc(min(520px,100dvh_-_var(--preview-top)_-_24px)/2_-_150px))]">
            {FEATURES.map((f, i) => (
              <article
                key={f.id}
                ref={(el) => { items.current[i] = el; }}
                data-index={i}
                className={`flex flex-col justify-center border-b border-[#16181a]/10 py-8 transition-opacity duration-300 last:border-b-0 lg:min-h-[300px] ${i === active ? "lg:opacity-100" : "lg:opacity-35"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white">
                    <f.Icon className="h-5 w-5 text-[var(--a)]" />
                  </span>
                  <span className="text-[13px] font-semibold tabular-nums text-[var(--a)]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 text-[26px] font-bold tracking-[-0.03em] text-[#16181a] md:text-[32px]">{f.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-[#3d444d] md:text-[16px]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--a)]" strokeWidth={3} />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Mobil "Papka": 9 ta varaq och kulrang-ko'kdan to'q ko'kka qarab to'qlashadi — ustma-ust qatlamlar
// bir-biridan ajralib tursin. Och varaqlarda matn to'q, to'qlarida oq. Bittasi ochiq (boshida — birinchisi).
const FOLDER_TONES = ["#e6ebf2", "#d8e1ec", "#c8d5e6", "#b5c7de", "#9db4d2", "#7f9cc3", "#6283b0", "#486b9c", "#36598a"];
const FOLDER_DARK_FROM = 5; // shu indeksdan boshlab matn oq

function MobileFolder() {
  const [open, setOpen] = useState(-1); // boshida hammasi yopiq
  const cards = useRef<(HTMLElement | null)[]>([]);

  // Ochilgan varaq ochilish animatsiyasi (500ms) tugagach ekranning qoq o'rtasiga silliq keladi —
  // shu paytda yuqoridagi yopilgan varaq ham joyini bo'shatib bo'lgan bo'ladi.
  const toggle = (i: number) => {
    const next = open === i ? -1 : i;
    setOpen(next);
    if (next === -1) return;
    window.setTimeout(() => {
      const el = cards.current[next];
      if (el) scrollToCenter(el);
    }, 520);
  };

  return (
    <div className="mt-8 lg:hidden">
      {FEATURES.map((f, i) => {
        const on = i === open;
        const dark = i >= FOLDER_DARK_FROM;
        return (
          <article
            key={f.id}
            ref={(el) => { cards.current[i] = el; }}
            className={`relative rounded-[24px] shadow-[0_-10px_24px_-14px_rgba(22,24,26,0.35)] ${i > 0 ? "-mt-5" : ""}`}
            style={{ zIndex: i + 1, background: FOLDER_TONES[i] }}
          >
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`feature-folder-${f.id}`}
                onClick={() => toggle(i)}
                className={`flex w-full items-center gap-3 px-5 pt-5 text-left transition-[padding] duration-500 ${on ? "pb-4" : "pb-8"} ${dark ? "text-white" : "text-[#16181a]"}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] ${dark ? "bg-white/15" : "bg-white/70"}`}>
                  <f.Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
                <span className={`text-[12px] font-semibold tabular-nums ${dark ? "text-white/60" : "text-[#16181a]/45"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[18px] font-semibold tracking-[-0.02em]">{f.title}</span>
                <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 transition-transform duration-300 ${on ? "rotate-180" : ""}`} />
              </button>
            </h3>
            <div id={`feature-folder-${f.id}`} className={`grid transition-[grid-template-rows] duration-500 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="px-5 pb-9">
                  <ul className="space-y-2">
                    {f.points.map((p) => (
                      <li key={p} className={`flex gap-2.5 text-[14px] leading-relaxed ${dark ? "text-white/85" : "text-[#3d444d]"}`}>
                        <Check className="mt-1 h-3.5 w-3.5 shrink-0" strokeWidth={3} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div aria-hidden="true" className="mt-5 flex items-center justify-center rounded-[20px] bg-white/80 p-5">
                    <f.Preview />
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ——— Interfeys namunalari: oq kartalar, urg'u — --a / --s ———

const card = "w-full max-w-[360px] rounded-[18px] bg-white p-4 shadow-[0_18px_40px_-20px_rgba(22,24,26,0.35)]";

function StudentsPreview() {
  const rows: [string, string, string][] = [
    ["Aziz Rahimov", "Faol", "bg-[#e3f4ec] text-[#1d6b4a]"],
    ["Madina Karimova", "Sinov", "bg-[var(--s)] text-[var(--a)]"],
    ["Javohir Tursunov", "Faol", "bg-[#e3f4ec] text-[#1d6b4a]"],
    ["Laylo Nazarova", "Ketgan", "bg-[#f0f2f3] text-[#7c8490]"],
  ];
  return (
    <div className={card}>
      <p className="text-[12px] font-semibold text-[#7c8490]">O&apos;quvchilar · IELTS 7.0</p>
      <div className="mt-2 divide-y divide-[#f0f2f3]">
        {rows.map(([n, s, c]) => (
          <div key={n} className="flex items-center justify-between py-2.5 text-[13px]">
            <span className="flex items-center gap-2.5 font-medium text-[#16181a]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--s)] text-[11px] font-bold text-[var(--a)]">{n[0]}</span>
              {n}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${c}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SchedulePreview() {
  const days = ["Du", "Se", "Ch", "Pa", "Ju"];
  const filled = [0, 2, 4, 6, 10, 12];
  return (
    <div className={card}>
      <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] font-semibold text-[#7c8490]">
        {days.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className={`h-9 rounded-[9px] ${i === 8 ? "bg-[#fbecd8] ring-2 ring-[#d4a537]" : filled.includes(i) ? "bg-[var(--a)] opacity-80" : "bg-[#f3f4f6]"}`}
          />
        ))}
      </div>
      <p className="mt-3 flex items-center gap-2 rounded-[10px] bg-[#fbf3e2] px-3 py-2 text-[12px] font-medium text-[#7a5a10]">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        2-xona shu vaqtda band
      </p>
    </div>
  );
}

function AttendancePreview() {
  const rows = [["Aziz", true], ["Madina", false], ["Javohir", true], ["Sevara", true]] as const;
  return (
    <div className="w-full max-w-[230px] rounded-[30px] bg-[#16181a] p-2 shadow-[0_24px_50px_-24px_rgba(22,24,26,0.6)]">
      <div className="rounded-[24px] bg-white p-3">
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[#e4e7ea]" />
        <p className="text-[11px] font-semibold text-[#7c8490]">Bugun · 14:00</p>
        <div className="mt-2 space-y-1.5">
          {rows.map(([n, here]) => (
            <div key={n} className="flex items-center justify-between rounded-[12px] bg-[#f6f7f8] px-3 py-2 text-[13px]">
              <span className="font-medium text-[#16181a]">{n}</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full ${here ? "bg-[var(--a)]" : "border-2 border-[#d6dbe1]"}`}>
                {here && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 rounded-[10px] bg-[var(--s)] px-2 py-1.5 text-center text-[10px] font-medium text-[var(--a)]">Madina — ota-onasiga xabar ketdi</p>
      </div>
    </div>
  );
}

function QuizPreview() {
  const rows: [string, number][] = [["Madina", 940], ["Aziz", 870], ["Javohir", 810], ["Sevara", 760]];
  return (
    <div className={card}>
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-semibold text-[#7c8490]">Jonli quiz · PIN 4821</span>
        <span className="rounded-full bg-[var(--s)] px-2.5 py-0.5 font-semibold tabular-nums text-[var(--a)]">0:12</span>
      </div>
      <p className="mt-3 text-[13px] font-semibold text-[#16181a]">Reyting</p>
      <div className="mt-2 space-y-1.5">
        {rows.map(([n, score], i) => (
          <div key={n} className={`flex items-center justify-between rounded-[12px] px-3 py-2 text-[13px] ${i === 0 ? "bg-[var(--a)] text-white" : "bg-[#f6f7f8] text-[#16181a]"}`}>
            <span className="flex items-center gap-2.5 font-medium">
              <span className={`w-4 text-[11px] font-bold tabular-nums ${i === 0 ? "text-white/70" : "text-[#7c8490]"}`}>{i + 1}</span>
              {n}
            </span>
            <span className="font-semibold tabular-nums">{score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsPreview() {
  return (
    <div className={card}>
      <div className="flex items-center justify-between text-[12px]">
        <span className="font-semibold text-[#7c8490]">Chek № 1042</span>
        <span className="rounded-full bg-[#e3f4ec] px-2.5 py-0.5 font-semibold text-[#1d6b4a]">To&apos;landi</span>
      </div>
      <p className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-[#16181a]">450 000 <span className="text-[16px] font-semibold text-[#7c8490]">so&apos;m</span></p>
      <div className="mt-3 space-y-2 border-t border-dashed border-[#e4e7ea] pt-3 text-[12px] text-[#5d6672]">
        <p className="flex justify-between"><span>O&apos;quvchi</span><span className="font-medium text-[#16181a]">Aziz Rahimov</span></p>
        <p className="flex justify-between"><span>Usul</span><span className="font-medium text-[#16181a]">Karta</span></p>
        <p className="flex justify-between"><span>Davr</span><span className="font-medium text-[#16181a]">Noyabr</span></p>
      </div>
      <p className="mt-3 rounded-[10px] bg-[var(--s)] px-3 py-2 text-[12px] font-medium text-[var(--a)]">Keyingi to&apos;lov: 1-dekabr</p>
    </div>
  );
}

function LeadsPreview() {
  const cols = [["Yangi", ["Bekzod", "Nilufar", "Sevara"]], ["Sinov darsi", ["Javohir", "Kamola"]], ["O'quvchi", ["Aziz"]]] as const;
  return (
    <div className="grid w-full max-w-[440px] grid-cols-3 gap-2">
      {cols.map(([c, names], ci) => (
        <div key={c} className="rounded-[16px] bg-white/80 p-2.5 shadow-[0_12px_30px_-22px_rgba(22,24,26,0.4)]">
          <p className="flex items-center justify-between text-[11px] font-semibold text-[#7c8490]">
            {c}
            <span className="rounded-full bg-[var(--s)] px-1.5 text-[10px] text-[var(--a)]">{names.length}</span>
          </p>
          <div className="mt-2 space-y-1.5">
            {names.map((n) => (
              <span key={n} className={`block rounded-[10px] px-2.5 py-2 text-[12px] font-medium ${ci === 2 ? "bg-[var(--a)] text-white" : "bg-white text-[#16181a] ring-1 ring-[#eef0f2]"}`}>{n}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardPreview() {
  const m = ["Faol o'quvchi", "Faol lid", "Guruhlar", "Qarzdorlar", "Sinovda", "Shu oy to'lagan", "Guruhni tark etgan", "Sinovdan keyin ketgan"];
  return (
    <div className="grid w-full max-w-[440px] grid-cols-2 gap-2">
      {m.map((t, i) => (
        <div key={t} className={`rounded-[14px] px-3 py-2.5 shadow-[0_10px_24px_-20px_rgba(22,24,26,0.4)] ${i === 0 ? "bg-[var(--a)] text-white" : "bg-white text-[#16181a]"}`}>
          <p className={`text-[11px] ${i === 0 ? "text-white/70" : "text-[#7c8490]"}`}>{t}</p>
          <span className={`mt-2 block h-2 rounded-full ${i === 0 ? "w-14 bg-white/50" : "w-10 bg-[var(--s)]"}`} />
        </div>
      ))}
    </div>
  );
}

function ImportPreview() {
  return (
    <div className="flex w-full max-w-[400px] items-center gap-3">
      <div className="flex h-24 w-20 shrink-0 flex-col items-center justify-center rounded-[16px] bg-white shadow-[0_18px_40px_-20px_rgba(22,24,26,0.35)]">
        <FileSpreadsheet className="h-8 w-8 text-[var(--a)]" />
        <span className="mt-1 text-[10px] font-semibold text-[#7c8490]">.xlsx</span>
      </div>
      <span className="h-px flex-1 border-t-2 border-dashed border-[var(--a)] opacity-40" />
      <div className={`${card} max-w-[210px]`}>
        {["Aziz Rahimov", "Madina Karimova", "Javohir Tursunov", "Sevara Aliyeva"].map((n) => (
          <div key={n} className="flex items-center gap-2 py-1.5 text-[12px] text-[#16181a]">
            <Check className="h-3.5 w-3.5 text-[var(--a)]" strokeWidth={3} />
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

function RolesPreview() {
  const cols = ["Lid", "To'lov", "Davomat", "Sozlama"];
  const rows: [string, boolean[]][] = [
    ["Rahbar", [true, true, true, true]],
    ["Administrator", [true, true, true, false]],
    ["O'qituvchi", [false, false, true, false]],
    ["Kassir", [false, true, false, false]],
  ];
  return (
    <div className={`${card} max-w-[420px]`}>
      <div className="grid grid-cols-[1.4fr_repeat(4,1fr)] items-center gap-y-3 text-[11px]">
        <span />
        {cols.map((c) => <span key={c} className="text-center font-semibold text-[#7c8490]">{c}</span>)}
        {rows.map(([r, perms]) => (
          <div key={r} className="contents">
            <span className="text-[12px] font-medium text-[#16181a]">{r}</span>
            {perms.map((p, i) => (
              <span key={i} className="flex justify-center">
                {p ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--a)]">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                ) : (
                  <span className="h-5 w-5 rounded-full bg-[#f0f2f3]" />
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
