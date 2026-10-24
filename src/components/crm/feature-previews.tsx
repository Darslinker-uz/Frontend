import { Building2, Check, Send, ShieldCheck } from "lucide-react";

// Imkoniyat sahifalari uchun qo'shimcha interfeys namunalari (features-explorer'dagilar bilan bir uslubda,
// --a / --s ranglari ota elementdan). Ism va raqamlar — namuna, statistika emas.

const card = "w-full max-w-[360px] rounded-[18px] bg-white p-4 shadow-[0_18px_40px_-20px_rgba(22,24,26,0.35)]";

// Ota-onaga Telegram xabarlari (markaz o'zgartira oladigan matnlar).
export function TelegramPreview() {
  const msgs = [
    "Assalomu alaykum! Farzandingiz Aziz bugungi darsga (14:00) kelmadi.",
    "Noyabr oyi uchun 450 000 so'm to'lov qabul qilindi. Rahmat!",
  ];
  return (
    <div className="w-full max-w-[300px] rounded-[30px] bg-[#16181a] p-2 shadow-[0_24px_50px_-24px_rgba(22,24,26,0.6)]">
      <div className="rounded-[24px] bg-[#dfe7ef] p-3">
        <div className="flex items-center gap-2 rounded-[14px] bg-white px-3 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--a)]">
            <Send className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="text-[12px] font-semibold text-[#16181a]">Markaz boti</span>
        </div>
        <div className="mt-3 space-y-2">
          {msgs.map((m) => (
            <p key={m} className="max-w-[90%] rounded-[14px] rounded-tl-[4px] bg-white px-3 py-2 text-[12px] leading-snug text-[#16181a]">{m}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Telegram ichida mini ilova: Telegram sarlavhasi ostida Darslinker oynasi.
export function MiniAppPreview() {
  const tiles = [
    { t: "Davomat", d: "Bugun: keldi" },
    { t: "To'lovlar", d: "Noyabr: to'landi" },
    { t: "Xabarlar", d: "2 ta yangi" },
  ];
  return (
    <div className="w-full max-w-[260px] rounded-[30px] bg-[#16181a] p-2 shadow-[0_24px_50px_-24px_rgba(22,24,26,0.6)]">
      <div className="overflow-hidden rounded-[24px] bg-white">
        <div className="flex items-center justify-between bg-[#e8eef5] px-3 py-2.5">
          <span className="text-[11px] font-semibold text-[#5d6672]">Yopish</span>
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#16181a]">
            <Send className="h-3.5 w-3.5 text-[var(--a)]" /> Darslinker
          </span>
          <span className="w-8" />
        </div>
        <div className="space-y-2 p-3">
          <p className="text-[11px] font-semibold text-[#7c8490]">Aziz Rahimov · IELTS 7.0</p>
          {tiles.map((x) => (
            <div key={x.t} className="flex items-center justify-between rounded-[12px] bg-[#f6f7f8] px-3 py-2.5 text-[12px]">
              <span className="font-semibold text-[#16181a]">{x.t}</span>
              <span className="text-[#7c8490]">{x.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Support: markaz bilan Telegram yozishmasi (namuna, real suhbat emas).
export function SupportPreview() {
  const msgs: [boolean, string][] = [
    [false, "Assalomu alaykum! O'quvchilar ro'yxatini Excel'da yubordik."],
    [true, "Rahmat! Ro'yxatni ko'chirdik, guruhlar va jadvalni ham sozladik ✅"],
    [true, "Ertaga 11:00 da xodimlar uchun onlayn o'rgatish bo'ladi."],
  ];
  return (
    <div className="w-full max-w-[300px] rounded-[30px] bg-[#16181a] p-2 shadow-[0_24px_50px_-24px_rgba(22,24,26,0.6)]">
      <div className="rounded-[24px] bg-[#dfe7ef] p-3">
        <div className="flex items-center gap-2 rounded-[14px] bg-white px-3 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--a)]">
            <Send className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="text-[12px] font-semibold text-[#16181a]">Darslinker Support</span>
          <span className="ml-auto text-[10px] text-[#7c8490]">10:00–20:00</span>
        </div>
        <div className="mt-3 space-y-2">
          {msgs.map(([ours, m]) => (
            <p
              key={m}
              className={`max-w-[88%] rounded-[14px] px-3 py-2 text-[12px] leading-snug ${ours ? "rounded-tl-[4px] bg-white text-[#16181a]" : "ml-auto rounded-tr-[4px] bg-[var(--a)] text-white"}`}
            >
              {m}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// LMS: o'quvchi profilidagi o'quv natijalari (namuna).
export function LmsPreview() {
  const quizzes: [string, number][] = [["Present Simple", 940], ["Vocabulary 3", 870], ["Listening 2", 910]];
  return (
    <div className={card}>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--s)] text-[13px] font-bold text-[var(--a)]">A</span>
        <div>
          <p className="text-[14px] font-bold text-[#16181a]">Aziz Rahimov</p>
          <p className="text-[11px] text-[#7c8490]">IELTS 7.0 · Davomat 12/12</p>
        </div>
      </div>
      <p className="mt-4 text-[12px] font-semibold text-[#7c8490]">Quiz natijalari</p>
      <div className="mt-2 space-y-1.5">
        {quizzes.map(([t, s]) => (
          <div key={t} className="flex items-center justify-between rounded-[12px] bg-[#f6f7f8] px-3 py-2 text-[12px]">
            <span className="font-medium text-[#16181a]">{t}</span>
            <span className="font-semibold tabular-nums text-[var(--a)]">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Xavfsizlik: himoya holati paneli (namuna; faqat tasdiqlangan himoyalar).
export function SecurityPreview() {
  const rows = ["Kunlik zaxira nusxa", "Shifrlangan ulanish (HTTPS)", "Telefon raqami va parol bilan kirish", "Ma'lumotni yuklab olish"];
  return (
    <div className={card}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[var(--a)]">
          <ShieldCheck className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="text-[14px] font-bold text-[#16181a]">Ma&apos;lumotlar himoyasi</p>
          <p className="text-[11px] text-[#7c8490]">Oxirgi zaxira nusxa: bugun</p>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <div key={r} className="flex items-center justify-between rounded-[12px] bg-[#f6f7f8] px-3 py-2 text-[12px]">
            <span className="font-medium text-[#16181a]">{r}</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e3f4ec]">
              <Check className="h-3 w-3 text-[#1d6b4a]" strokeWidth={3} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Markazga moslash: logo, nom, dashboard rangi.
export function CustomizationPreview() {
  const colors = ["#3d444d", "#2d5a8a", "#1d6b4a", "#8f6cc0", "#b8933f"];
  return (
    <div className={card}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--a)] text-[15px] font-bold text-white">S</span>
        <div>
          <p className="text-[14px] font-bold text-[#16181a]">Sizning markazingiz</p>
          <p className="text-[11px] text-[#7c8490]">markaz.darslinker.app</p>
        </div>
      </div>
      <p className="mt-4 text-[12px] font-semibold text-[#7c8490]">Dashboard rangi</p>
      <div className="mt-2 flex gap-2">
        {colors.map((c, i) => (
          <span key={c} className={`flex h-8 w-8 items-center justify-center rounded-full ${i === 1 ? "ring-2 ring-offset-2 ring-[#2d5a8a]" : ""}`} style={{ background: c }}>
            {i === 1 && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
          </span>
        ))}
      </div>
      <p className="mt-4 text-[12px] font-semibold text-[#7c8490]">Ota-onaga xabar matni</p>
      <p className="mt-2 rounded-[10px] bg-[var(--s)] px-3 py-2 text-[12px] leading-snug text-[#16181a]">
        Hurmatli ota-ona, farzandingiz bugungi darsga kelmadi.
      </p>
    </div>
  );
}

// Filiallar: bitta tizimda bir nechta filial.
export function BranchesPreview() {
  const rows = ["Chilonzor filiali", "Yunusobod filiali", "Sergeli filiali"];
  return (
    <div className={card}>
      <p className="text-[12px] font-semibold text-[#7c8490]">Filiallar</p>
      <div className="mt-2 space-y-1.5">
        {rows.map((r, i) => (
          <div key={r} className={`flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[13px] font-medium ${i === 0 ? "bg-[var(--a)] text-white" : "bg-[#f6f7f8] text-[#16181a]"}`}>
            <Building2 className={`h-4 w-4 ${i === 0 ? "text-white/80" : "text-[var(--a)]"}`} />
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}
