"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PhoneInput } from "@/components/phone-input";
import { cn } from "@/lib/utils";

// CRM/LMS ariza formasi. SPEC kontraktidagi darslinker.app/register tayyor
// bo'lguncha "Sinab ko'rish" / tarif tugmalari shu modalni ochadi.
// Keyin tugmalarni kontrakt manzillariga almashtirish uchun faqat shu fayl o'zgaradi.

export type CrmPlan = "minimal" | "standart" | "biznes" | "korporativ" | "individual";

const STUDENT_RANGES = ["100 gacha", "100–250", "250–600", "600–1500", "1500 dan ko'p"];

type Payload = {
  name: string;
  phone: string;
  centerName: string;
  students: string;
  plan: CrmPlan;
  ref: string;
};

// Ariza Telegram'ga boradi (/api/crm-applications). Yetkazilmasa xato — forma "qayta urining" deydi.
async function submitCrmApplication(payload: Payload): Promise<void> {
  const res = await fetch("/api/crm-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, phone: `+998 ${payload.phone}` }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

type Ctx = { open: (plan: CrmPlan, ref: string) => void };
const CrmApplyContext = createContext<Ctx | null>(null);

export function CrmApplyProvider({ children }: { children: ReactNode }) {
  // `open` va forma ma'lumoti alohida: yopilganda forma yopilish animatsiyasi tugaguncha ko'rinib turadi
  // (aks holda oyna bo'sh bo'lib yopilardi). `n` — har ochilishda yangi forma (eski holat qolmasin).
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<{ plan: CrmPlan; ref: string; n: number } | null>(null);
  const close = useCallback(() => setOpen(false), []);

  return (
    <CrmApplyContext.Provider
      value={{
        open: (plan, ref) => {
          setTarget((prev) => ({ plan, ref, n: (prev?.n ?? 0) + 1 }));
          setOpen(true);
        },
      }}
    >
      {children}
      <Dialog
        open={open}
        disablePointerDismissal
        onOpenChange={(next, details) => {
          if (!next && details.reason === "close-press") setOpen(false);
        }}
      >
        {/* z-[80]: navbar (z-[60]) ustida — mobilda oynaning tepasi navbar ostida qolmasin.
            Fon: ekrandan 160px tashqariga cho'zilgan (-inset-y-40) — Telegram va boshqa ilova brauzerlarida
            manzil/asboblar paneli yig'ilganda ham tepa va past xiralashmay qolmasin; xiralash kuchliroq.
            Ochilish/yopilish: fon 300ms'da so'nadi, oyna pastdan ko'tarilib kattalashadi (va teskari). */}
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[80] -inset-y-40 bg-[#0b1520]/55 backdrop-blur-md supports-backdrop-filter:backdrop-blur-md duration-300 ease-out"
          className="fixed top-1/2 left-1/2 z-[80] grid max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-y-auto rounded-[22px] border-0 p-0 shadow-[0_24px_80px_-20px_rgba(9,25,43,.45)] duration-300 ease-[cubic-bezier(.22,1,.36,1)] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-[0.96] data-open:slide-in-from-bottom-6 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-[0.96] data-closed:slide-out-to-bottom-6 motion-reduce:animate-none sm:max-h-[min(88vh,820px)] sm:max-w-[860px] sm:rounded-[26px]"
        >
          {target && <ApplyForm key={target.n} plan={target.plan} refSource={target.ref} onClose={close} />}
        </DialogContent>
      </Dialog>
    </CrmApplyContext.Provider>
  );
}

export function CrmApplyButton({
  plan = "minimal",
  refSource,
  className,
  children,
}: {
  plan?: CrmPlan;
  refSource: string;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(CrmApplyContext);
  return (
    <button type="button" onClick={() => ctx?.open(plan, refSource)} className={className}>
      {children}
    </button>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

const AUTO_CLOSE_MS = 5000;

function ApplyForm({ plan: initialPlan, refSource, onClose }: { plan: CrmPlan; refSource: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [centerName, setCenterName] = useState("");
  const [students, setStudents] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim() !== "" && phone.replace(/\D/g, "").length === 9 && centerName.trim() !== "";

  const submit = async () => {
    setError(null);
    if (!canSubmit) {
      setError("Ism, telefon va markaz nomi majburiy");
      return;
    }
    setStatus("submitting");
    try {
      await submitCrmApplication({ name: name.trim(), phone, centerName: centerName.trim(), students, plan: initialPlan, ref: refSource });
      setStatus("success");
    } catch {
      setError("Xatolik yuz berdi, qayta urining");
      setStatus("error");
    }
  };

  // Ariza yuborilgach oyna 5 soniyada o'zi yopiladi (pastdagi chiziq qolgan vaqtni ko'rsatadi).
  useEffect(() => {
    if (status !== "success") return;
    const id = window.setTimeout(onClose, AUTO_CLOSE_MS);
    return () => window.clearTimeout(id);
  }, [status, onClose]);

  if (status === "success") {
    return (
      <div className="grid sm:min-h-[460px] sm:grid-cols-[0.82fr_1.18fr]">
        <aside className="rounded-t-[22px] bg-[#0f2236] px-6 py-7 text-white sm:flex sm:flex-col sm:justify-center sm:rounded-l-[26px] sm:rounded-tr-none sm:px-8 sm:py-10">
          <div className="flex items-start justify-between">
            <span className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-[#c9d9ef]">BEPUL SINOV</span>
            <span className="-mr-2 -mt-1 sm:hidden"><ModalClose tone="dark" /></span>
          </div>
          <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9fbce3]">Darslinker bilan</p>
          <p className="mt-3 max-w-[320px] text-[26px] font-bold leading-[1.08] tracking-[-0.035em] sm:text-[28px]">Markaz boshqaruvi bir joyda.</p>
          <p className="mt-4 max-w-[320px] text-[14px] leading-relaxed text-white/65">Arizangiz qabul qilindi. Tez orada markazingiz uchun tizimni ishga tushirish bo&apos;yicha bog&apos;lanamiz.</p>
        </aside>
        <div className="relative flex flex-col items-center justify-center bg-white px-5 pb-6 pt-8 sm:rounded-r-[26px] sm:px-8 sm:py-10">
          <span className="absolute right-4 top-4 hidden sm:inline-flex"><ModalClose /></span>
          <div className="py-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#7ea2d4]/20"><Check className="h-6 w-6 text-[#2d5a8a]" /></div>
            <DialogTitle className="text-[20px] font-bold text-[#16181a]">Ariza qabul qilindi</DialogTitle>
            <DialogDescription className="mt-2 text-[14px] text-[#6a7585]">Ma&apos;lumotlaringizni oldik.</DialogDescription>
          </div>
          <div className="mt-2 w-full max-w-[220px]">
            <div className="h-1 overflow-hidden rounded-full bg-[#eef1f4]">
              <div className="h-full origin-left rounded-full bg-[#7ea2d4] motion-safe:animate-[apply-countdown_5s_linear_forwards]" />
            </div>
            <p className="mt-2 text-center text-[12px] text-[#8993a0]">Oyna 5 soniyada yopiladi</p>
          </div>
          <style>{"@keyframes apply-countdown { from { transform: scaleX(1) } to { transform: scaleX(0) } }"}</style>
        </div>
      </div>
    );
  }

  const input = "w-full h-[50px] px-4 text-[16px] rounded-[12px] bg-[#f7f8fa] border border-[#e3e7ec] text-[#16181a] placeholder:text-[#8792a0] focus:outline-none focus:border-[#7ea2d4] focus:ring-2 focus:ring-[#7ea2d4]/20 transition-colors";
  const busy = status === "submitting";

  return (
    <div className="grid sm:min-h-[500px] sm:grid-cols-[0.82fr_1.18fr]">
      <aside className="relative overflow-hidden rounded-t-[22px] bg-[#0f2236] px-5 pb-4 pt-5 text-white sm:rounded-l-[26px] sm:rounded-tr-none sm:px-8 sm:py-10">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#7ea2d4]/20 blur-2xl" />
        <div className="relative flex items-start justify-between"><span className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-[#c9d9ef]">BEPUL SINOV</span><span className="sm:hidden"><ModalClose /></span></div>
        <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9fbce3] sm:mt-16 sm:text-[12px]">Darslinker bilan</p>
        <DialogTitle className="relative mt-2 block max-w-[320px] text-[23px] font-bold leading-[1.08] tracking-[-0.035em] text-white sm:mt-3 sm:text-[28px]">Markaz boshqaruvi bir joyda.</DialogTitle>
        <DialogDescription className="relative mt-2 block max-w-[320px] text-[13px] leading-relaxed text-white/65 sm:mt-4 sm:text-[14px]">Ariza qoldiring. Markazingizga mos tizimni birga ishga tushiramiz.</DialogDescription>
      </aside>
      <div className="bg-white px-5 py-5 sm:px-8 sm:py-9">
        <div className="mb-4 flex items-center justify-between sm:mb-6"><div><p className="text-[11px] font-semibold text-[#5b87c0] sm:text-[12px]">Boshlash uchun</p><h3 className="mt-1 text-[18px] font-bold text-[#16181a] sm:text-[20px]">Ma&apos;lumotlaringiz</h3></div><span className="hidden sm:inline-flex"><ModalClose /></span></div>
        <form className="space-y-2.5 sm:space-y-3" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" autoComplete="name" className={`${input} h-[46px] sm:h-[50px]`} disabled={busy} />
          <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} className={`${input} h-[46px] sm:h-[50px]`} disabled={busy} />
          <input required value={centerName} onChange={(e) => setCenterName(e.target.value)} placeholder="O'quv markaz nomi" autoComplete="organization" className={`${input} h-[46px] sm:h-[50px]`} disabled={busy} />
          <StudentsSelect value={students} onChange={setStudents} disabled={busy} className={`${input} h-[46px] sm:h-[50px]`} />
          {error && <p className="text-center text-[13px] text-red-600">{error}</p>}
          <button type="submit" disabled={busy || !canSubmit} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#2d5a8a] text-[15px] font-semibold text-white transition-colors hover:bg-[#244c76] disabled:cursor-not-allowed disabled:opacity-40">
            {busy ? "Yuborilmoqda..." : <>Ariza qoldirish <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="text-center text-[12px] text-[#8993a0]">14 kun bepul · karta kerak emas</p>
        </form>
      </div>
    </div>
  );
}

// "O'quvchilar soni": maydon bosilganda ariza oynasi ustida alohida kichik oyna ochiladi (mobilda pastdan
// chiquvchi panel, kompyuterda markazda). Variant tanlanishi bilan oyna yopilib, qiymat maydonga tushadi.
// Ichma-ich Dialog — fokus va "orqa fon bosilmaydi" qoidalarini base-ui o'zi to'g'ri boshqaradi.
function StudentsSelect({ value, onChange, disabled, className }: { value: string; onChange: (v: string) => void; disabled?: boolean; className: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="O'quvchilar soni"
        onClick={() => setOpen(true)}
        className={cn(className, "flex cursor-pointer items-center justify-between text-left", !value && "text-[#8792a0]", open && "border-[#7ea2d4] ring-2 ring-[#7ea2d4]/20")}
      >
        <span>{value ? `${value} o'quvchi` : "O'quvchilar soni"}</span>
        <ChevronDown aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-[#7c8490]" />
      </button>
      <DialogContent
        showCloseButton={false}
        forceOverlay
        overlayClassName="z-[90] -inset-y-40 bg-[#0b1520]/35 duration-300 ease-out"
        className="fixed z-[90] w-full max-w-none gap-0 rounded-none bg-transparent p-0 ring-0 duration-300 ease-[cubic-bezier(.22,1,.36,1)] max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 data-open:animate-in data-open:fade-in-0 max-sm:data-open:slide-in-from-bottom-full sm:max-w-[400px] sm:data-open:zoom-in-[0.96] data-closed:animate-out data-closed:fade-out-0 max-sm:data-closed:slide-out-to-bottom-full sm:data-closed:zoom-out-[0.96] motion-reduce:animate-none"
      >
        <div className="rounded-t-[24px] bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_60px_-20px_rgba(9,25,43,.4)] sm:rounded-[22px] sm:p-5">
          <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#dfe3e8] sm:hidden" />
          <div className="flex items-center justify-between px-1">
            <DialogTitle className="text-[17px] font-bold text-[#16181a]">O&apos;quvchilar soni</DialogTitle>
            <DialogClose render={<button type="button" aria-label="Yopish" className="grid h-9 w-9 place-items-center rounded-full text-[#7c8490] transition hover:bg-[#f0f2f3] hover:text-[#16181a]" />}>
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
          <DialogDescription className="px-1 text-[13px] text-[#7c8490]">Markazingizda taxminan nechta o&apos;quvchi bor?</DialogDescription>
          <ul role="listbox" aria-label="O'quvchilar soni" className="mt-3 space-y-1.5">
            {STUDENT_RANGES.map((r) => {
              const selected = value === r;
              return (
                <li key={r}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => { onChange(r); setOpen(false); }}
                    className={cn(
                      "flex h-[52px] w-full items-center justify-between rounded-[14px] px-4 text-left text-[16px] transition-colors",
                      selected ? "bg-[#eef3fa] font-semibold text-[#2d5a8a] ring-1 ring-[#7ea2d4]/50" : "bg-[#f7f8fa] text-[#16181a] hover:bg-[#eef1f4]",
                    )}
                  >
                    {r}{" "}o&apos;quvchi
                    {selected && <Check aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.5} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModalClose({ tone = "light" }: { tone?: "light" | "dark" }) {
  const color = tone === "dark" ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-[#7c8490] hover:bg-[#f0f2f3] hover:text-[#16181a]";
  return (
    <DialogClose render={<button type="button" aria-label="Modalni yopish" className={`grid h-9 w-9 place-items-center rounded-full transition ${color}`} />}>
      <X className="h-4 w-4" />
    </DialogClose>
  );
}
