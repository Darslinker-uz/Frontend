"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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

// TODO(owner): arizalar qayerga tushishi hali hal qilinmagan (DB / Telegram / darslinker.app).
// Hal qilinguncha bu sahifa production'ga chiqarilmaydi — aks holda arizalar yo'qoladi.
async function submitCrmApplication(payload: Payload): Promise<void> {
  console.info("[crm-application]", payload);
}

type Ctx = { open: (plan: CrmPlan, ref: string) => void };
const CrmApplyContext = createContext<Ctx | null>(null);

export function CrmApplyProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<{ plan: CrmPlan; ref: string } | null>(null);
  const close = useCallback(() => setTarget(null), []);

  return (
    <CrmApplyContext.Provider value={{ open: (plan, ref) => setTarget({ plan, ref }) }}>
      {children}
      <Dialog
        open={target !== null}
        disablePointerDismissal
        onOpenChange={(open, details) => {
          if (!open && details.reason === "close-press") setTarget(null);
        }}
      >
        {/* z-[80]: navbar (z-[60]) ustida — mobilda oynaning tepasi navbar ostida qolmasin. */}
        <DialogContent
          showCloseButton={false}
          overlayClassName="z-[80] bg-[#0b1520]/50"
          className="fixed top-1/2 left-1/2 z-[80] grid max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-y-auto rounded-[22px] border-0 p-0 shadow-[0_24px_80px_-20px_rgba(9,25,43,.45)] data-open:animate-in data-open:zoom-in-95 data-closed:animate-out data-closed:zoom-out-95 sm:max-h-[min(88vh,820px)] sm:max-w-[860px] sm:rounded-[26px]"
        >
          {target && <ApplyForm key={`${target.plan}-${target.ref}`} plan={target.plan} refSource={target.ref} onClose={close} />}
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
          <p className="mt-4 max-w-[320px] text-[14px] leading-relaxed text-white/65">Arizangiz qabul qilindi. Tez orada markazingiz uchun tizimni ishga tushirish bo‘yicha bog‘lanamiz.</p>
        </aside>
        <div className="relative flex flex-col items-center justify-center bg-white px-5 pb-6 pt-8 sm:rounded-r-[26px] sm:px-8 sm:py-10">
          <span className="absolute right-4 top-4 hidden sm:inline-flex"><ModalClose /></span>
          <div className="py-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#7ea2d4]/20"><Check className="h-6 w-6 text-[#2d5a8a]" /></div>
            <DialogTitle className="text-[20px] font-bold text-[#16181a]">Ariza qabul qilindi</DialogTitle>
            <DialogDescription className="mt-2 text-[14px] text-[#6a7585]">Ma’lumotlaringizni oldik.</DialogDescription>
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
        <div className="mb-4 flex items-center justify-between sm:mb-6"><div><p className="text-[11px] font-semibold text-[#5b87c0] sm:text-[12px]">Boshlash uchun</p><h3 className="mt-1 text-[18px] font-bold text-[#16181a] sm:text-[20px]">Ma’lumotlaringiz</h3></div><span className="hidden sm:inline-flex"><ModalClose /></span></div>
        <form className="space-y-2.5 sm:space-y-3" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" autoComplete="name" className={`${input} h-[46px] sm:h-[50px]`} disabled={busy} />
          <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} className={`${input} h-[46px] sm:h-[50px]`} disabled={busy} />
          <input required value={centerName} onChange={(e) => setCenterName(e.target.value)} placeholder="O‘quv markaz nomi" autoComplete="organization" className={`${input} h-[46px] sm:h-[50px]`} disabled={busy} />
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

// "O'quvchilar soni": brauzerning tizim ro'yxati o'rniga forma uslubidagi ro'yxat — maydonning o'zi ostida
// (oqimda) ochiladi, shuning uchun oyna ichida scroll bo'lsa ham kesilmaydi va mobilda joyida turadi.
function StudentsSelect({ value, onChange, disabled, className }: { value: string; onChange: (v: string) => void; disabled?: boolean; className: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); setOpen(false); } };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey, true);
    // Ochilgach ro'yxat to'liq ko'rinsin (oyna ichida kerak bo'lsa ozgina scroll).
    const id = window.setTimeout(() => listRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 180);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey, true);
      window.clearTimeout(id);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="O‘quvchilar soni"
        onClick={() => setOpen((o) => !o)}
        className={cn(className, "flex cursor-pointer items-center justify-between text-left", !value && "text-[#8792a0]", open && "border-[#7ea2d4] ring-2 ring-[#7ea2d4]/20")}
      >
        <span>{value ? `${value} o‘quvchi` : "O‘quvchilar soni"}</span>
        <ChevronDown aria-hidden="true" className={cn("h-[18px] w-[18px] shrink-0 text-[#7c8490] transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-200 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <ul ref={listRef} role="listbox" aria-label="O‘quvchilar soni" className="mt-1.5 rounded-[12px] border border-[#e3e7ec] bg-white p-1.5">
            {STUDENT_RANGES.map((r) => {
              const selected = value === r;
              return (
                <li key={r}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={open ? 0 : -1}
                    onClick={() => { onChange(r); setOpen(false); }}
                    className={cn(
                      "flex h-11 w-full items-center justify-between rounded-[9px] px-3 text-left text-[15px] transition-colors",
                      selected ? "bg-[#eef3fa] font-semibold text-[#2d5a8a]" : "text-[#16181a] hover:bg-[#f4f6f8]",
                    )}
                  >
                    {r} o‘quvchi
                    {selected && <Check aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
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
