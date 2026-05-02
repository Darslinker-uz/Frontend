"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Zap, Crown, Sparkles, Check, AlertCircle, Gift } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type ClassType = "A" | "B";

const META = {
  A: { label: "A-class", desc: "Bosh sahifadagi katta slider — eng yuqori ko'rinish", icon: Crown, gradient: "from-[#7ea2d4] to-[#4a7ab5]" },
  B: { label: "B-class", desc: "Mashhur kurslar — doim aylanib turadigan slider", icon: Sparkles, gradient: "from-[#6b5b95] to-[#8b7bb5]" },
} as const;

interface ListingData {
  id: number;
  title: string;
  status: "pending" | "active" | "paused" | "rejected";
  category: { id: number; name: string; slug: string };
  user: { id: number; name: string; centerName: string | null };
}

export default function AdminBoostPage() {
  const { config } = useAdminTheme();
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);

  // Joriy foydalanuvchi roli — assistant bo'lsa "Boost so'rash" (pending), admin bo'lsa "Bepul boost"
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/me/permissions", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setRole(d.role); })
      .catch(() => {});
  }, []);
  const isAssistant = role === "assistant";

  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>("A");
  const [duration, setDuration] = useState(7);
  const [startDate, setStartDate] = useState<"now" | "later">("now");
  const [laterDate, setLaterDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/listings/${listingId}`, { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (data.listing) setListing(data.listing);
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [listingId]);

  const submit = async () => {
    if (!selectedClass) return;
    setError(null);
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        type: selectedClass === "A" ? "a_class" : "b_class",
        daysTotal: duration,
      };
      if (startDate === "later" && laterDate) body.startAt = new Date(laterDate).toISOString();
      const res = await fetch(`/api/admin/listings/${listingId}/boost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Xatolik");
        setSubmitting(false);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/admode/boosts"), 800);
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-5 md:px-8 py-16 text-center">
        <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
      </div>
    );
  }
  if (!listing) {
    return (
      <div className="px-5 md:px-8 py-16 text-center">
        <p className="text-[16px] mb-3" style={{ color: config.text }}>E&apos;lon topilmadi</p>
        <Link href="/admode/listings" className="text-[13px] text-[#7ea2d4]">Orqaga qaytish</Link>
      </div>
    );
  }
  if (listing.status !== "active") {
    return (
      <div className="px-5 md:px-8 py-16 text-center">
        <p className="text-[16px] mb-2" style={{ color: config.text }}>E&apos;lon aktiv emas</p>
        <p className="text-[13px] mb-4" style={{ color: config.textMuted }}>Faqat aktiv e&apos;lonlarni boost qilish mumkin. Avval e&apos;lonni tasdiqlang.</p>
        <Link href="/admode/listings" className="text-[13px] text-[#7ea2d4]">Orqaga qaytish</Link>
      </div>
    );
  }

  const pct = ((duration - 1) / 29) * 100;

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 max-w-[720px]">
      <Link href="/admode/listings" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Orqaga
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>
        {isAssistant ? "Boost so'rovi yuborish" : "E'lonni boost qilish"}
      </h1>
      <p className="text-[14px] mb-5" style={{ color: config.textMuted }}>
        {isAssistant
          ? "Boost so'rovi yuboriladi. Super admin tasdiqlagandan keyin aktivlashtiriladi."
          : "Admin sifatida bu e'lonni bepul boost qiling — to'g'ridan-to'g'ri active holatga o'tadi"}
      </p>

      {/* Listing info */}
      <div className="rounded-[14px] p-4 mb-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <p className="text-[12px] mb-1" style={{ color: config.textDim }}>{listing.category.name}</p>
        <p className="text-[15px] font-semibold" style={{ color: config.text }}>{listing.title}</p>
        <p className="text-[12px] mt-1" style={{ color: config.textMuted }}>
          {listing.user.centerName ?? listing.user.name}
        </p>
      </div>

      {/* Free grant notice */}
      <div className="rounded-[12px] p-3 mb-5 flex items-center gap-2.5" style={isAssistant
        ? { backgroundColor: "#f59e0b15", border: "1px solid #f59e0b33", color: "#f59e0b" }
        : { backgroundColor: "#22c55e15", border: "1px solid #22c55e33", color: "#22c55e" }
      }>
        <Gift className="w-4 h-4 shrink-0" />
        <p className="text-[12.5px]">
          {isAssistant
            ? "Boost so'rovi: super admin tasdiqlagandan keyin active bo'ladi."
            : "Bepul admin boost — provider balansidan yechilmaydi va darhol active bo'ladi."}
        </p>
      </div>

      {/* Boost type */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textMuted }}>Boost turi</p>
        <div className="space-y-3">
          {(["A", "B"] as ClassType[]).map((c) => {
            const m = META[c];
            const Icon = m.icon;
            const active = selectedClass === c;
            return (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className="w-full text-left rounded-[16px] p-5 transition-all border-2"
                style={active ? { borderColor: config.accent, backgroundColor: config.hover } : { borderColor: config.surfaceBorder, backgroundColor: config.surface }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${m.gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[17px] font-bold" style={{ color: config.text }}>{m.label}</span>
                    <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>{m.desc}</p>
                  </div>
                  {active && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.accent }}>
                      <Check className="w-4 h-4" style={{ color: config.accentText }} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-5 rounded-[16px] p-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: config.textMuted }}>Davomiylik</p>
          <span className="text-[11px]" style={{ color: config.textDim }}>1-30 kun</span>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[40px] font-bold leading-none" style={{ color: config.text }}>{duration}</span>
          <span className="text-[16px]" style={{ color: config.textMuted }}>kun</span>
        </div>
        <div className="relative h-[32px] flex items-center">
          <div className="absolute left-0 right-0 h-[6px] rounded-full" style={{ backgroundColor: config.hover }} />
          <div className="absolute h-[6px] rounded-full" style={{ width: `${pct}%`, backgroundColor: config.accent }} />
          <input
            type="range"
            min={1}
            max={30}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="absolute w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#16181a] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab"
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px]" style={{ color: config.textDim }}>
          <span>1</span><span>7</span><span>14</span><span>21</span><span>30</span>
        </div>
        <div className="flex items-center gap-1.5 mt-4">
          {[7, 14, 21, 30].map((d) => (
            <button key={d} onClick={() => setDuration(d)} className="flex-1 h-[32px] rounded-[8px] text-[12px] font-medium transition-all" style={duration === d ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textMuted }}>
              {d} kun
            </button>
          ))}
        </div>
      </div>

      {/* Start date */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textMuted }}>Boshlash vaqti</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setStartDate("now")} className="h-[52px] rounded-[12px] text-[14px] font-medium transition-all border-2" style={startDate === "now" ? { borderColor: config.accent, backgroundColor: config.hover, color: config.text } : { borderColor: config.surfaceBorder, backgroundColor: config.surface, color: config.textMuted }}>
            Darhol
          </button>
          <button onClick={() => setStartDate("later")} className="h-[52px] rounded-[12px] text-[14px] font-medium transition-all border-2" style={startDate === "later" ? { borderColor: config.accent, backgroundColor: config.hover, color: config.text } : { borderColor: config.surfaceBorder, backgroundColor: config.surface, color: config.textMuted }}>
            Keyinroq
          </button>
        </div>
        {startDate === "later" && (
          <input
            value={laterDate}
            onChange={(e) => setLaterDate(e.target.value)}
            type="date"
            className="mt-2 w-full h-[44px] px-4 rounded-[10px] text-[14px] focus:outline-none"
            style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-[10px] mb-4" style={{ backgroundColor: "#ef444414", border: "1px solid #ef444433", color: "#ef4444" }}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-[13px]">{error}</p>
        </div>
      )}

      <button
        onClick={submit}
        disabled={!selectedClass || submitting || done || (startDate === "later" && !laterDate)}
        className="w-full h-[52px] rounded-[14px] text-[15px] font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: config.accent, color: config.accentText }}
      >
        <Zap className="w-5 h-5" />
        {done
          ? (isAssistant ? "So'rov yuborildi ✓" : "Boost qo'yildi ✓")
          : submitting ? "Yuborilmoqda..."
          : (isAssistant ? "So'rov yuborish" : "Bepul boost qilish")}
      </button>

      <p className="text-[11px] text-center mt-3" style={{ color: config.textDim }}>
        Boost darhol active bo&apos;ladi. Provider Telegram orqali xabardor qilinadi.
      </p>
    </div>
  );
}
