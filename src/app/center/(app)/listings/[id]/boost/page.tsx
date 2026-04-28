"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Zap, Crown, Sparkles, Check, Wallet, AlertCircle } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";

type ClassType = "A" | "B";

const PRICING = {
  A: { perDay: 100000, label: "A-class", desc: "Bosh sahifadagi katta slider — eng yuqori ko'rinish", features: ["Bosh sahifada katta karussel", "Har 6 soniyada ko'rinadi", "Premium ko'rinish", "Eng yuqori e'tibor"] },
  B: { perDay: 50000, label: "B-class", desc: "Mashhur kurslar — doim aylanib turadigan slider", features: ["Bosh sahifa mashhur kurslar", "Doim aylanib turadi", "Professional ko'rinish", "Yuqori ko'rinish"] },
};

interface ListingData {
  id: number;
  title: string;
  status: "pending" | "active" | "paused" | "rejected";
  category: { id: number; name: string; slug: string };
}

interface BalanceData {
  balance: number;
}

export default function BoostPage() {
  const { config } = useDashboardTheme();
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);

  const [listing, setListing] = useState<ListingData | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [duration, setDuration] = useState(7);
  const [startDate, setStartDate] = useState<"now" | "later">("now");
  const [laterDate, setLaterDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [lRes, sRes] = await Promise.all([
          fetch(`/api/dashboard/listings/${listingId}`, { cache: "no-store" }),
          fetch("/api/dashboard/stats", { cache: "no-store" }),
        ]);
        const lData = await lRes.json();
        const sData: { user?: BalanceData } = await sRes.json();
        if (cancelled) return;
        if (lData.listing) setListing(lData.listing);
        setBalance(sData.user?.balance ?? 0);
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [listingId]);

  const pct = ((duration - 1) / 29) * 100;
  const price = selectedClass ? PRICING[selectedClass].perDay * duration : 0;
  const canAfford = price > 0 && price <= balance;

  const submit = async () => {
    if (!selectedClass) return;
    setError(null);
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        listingId,
        type: selectedClass === "A" ? "a_class" : "b_class",
        daysTotal: duration,
      };
      if (startDate === "later" && laterDate) body.startAt = new Date(laterDate).toISOString();
      const res = await fetch("/api/dashboard/boost", {
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
      router.push("/center/listings");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi, qayta urining");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-3 sm:px-5 md:px-8 py-16 text-center">
        <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
      </div>
    );
  }
  if (!listing) {
    return (
      <div className="px-3 sm:px-5 md:px-8 py-16 text-center">
        <p className="text-[16px] mb-3" style={{ color: config.text }}>E&apos;lon topilmadi</p>
        <Link href="/center/listings" className="text-[13px] text-[#7ea2d4]">Orqaga qaytish</Link>
      </div>
    );
  }
  if (listing.status !== "active") {
    return (
      <div className="px-3 sm:px-5 md:px-8 py-16 text-center">
        <p className="text-[16px] mb-2" style={{ color: config.text }}>E&apos;lon aktiv emas</p>
        <p className="text-[13px] mb-4" style={{ color: config.textMuted }}>Faqat aktiv e&apos;lonlarni boost qilish mumkin</p>
        <Link href="/center/listings" className="text-[13px] text-[#7ea2d4]">Orqaga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/center/boost" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Orqaga
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>E&apos;lonni ko&apos;tarish</h1>
      <p className="text-[14px] mb-6" style={{ color: config.textMuted }}>Ko&apos;proq ko&apos;rinish uchun boost yoqing</p>

      <div className="rounded-[14px] p-4 mb-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        <p className="text-[12px] mb-1" style={{ color: config.textDim }}>{listing.category.name}</p>
        <p className="text-[15px] font-semibold" style={{ color: config.text }}>{listing.title}</p>
      </div>

      <div className="mb-5">
        <p className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textMuted }}>Boost turi</p>
        <div className="space-y-3">
          <button
            onClick={() => setSelectedClass("A")}
            className="w-full text-left rounded-[16px] p-5 transition-all border-2"
            style={selectedClass === "A" ? { borderColor: config.accent, backgroundColor: config.hover } : { borderColor: config.surfaceBorder, backgroundColor: config.surface }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#7ea2d4] to-[#4a7ab5] flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[17px] font-bold" style={{ color: config.text }}>A-class</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7ea2d4] to-[#4a7ab5] text-white font-bold">PREMIUM</span>
                </div>
                <p className="text-[13px] mb-3" style={{ color: config.textMuted }}>{PRICING.A.desc}</p>
                <div className="space-y-1.5">
                  {PRICING.A.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[12px]" style={{ color: config.textMuted }}>
                      <Check className="w-3.5 h-3.5 shrink-0" />{f}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[14px]" style={{ color: config.text }}>
                  <span className="font-bold">{PRICING.A.perDay.toLocaleString()} so&apos;m</span>
                  <span style={{ color: config.textMuted }}> / kun</span>
                </div>
              </div>
              {selectedClass === "A" && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.accent }}>
                  <Check className="w-4 h-4" style={{ color: config.accentText }} />
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedClass("B")}
            className="w-full text-left rounded-[16px] p-5 transition-all border-2"
            style={selectedClass === "B" ? { borderColor: config.accent, backgroundColor: config.hover } : { borderColor: config.surfaceBorder, backgroundColor: config.surface }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#6b5b95] to-[#8b7bb5] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[17px] font-bold" style={{ color: config.text }}>B-class</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: config.active, color: config.textMuted }}>STANDART</span>
                </div>
                <p className="text-[13px] mb-3" style={{ color: config.textMuted }}>{PRICING.B.desc}</p>
                <div className="space-y-1.5">
                  {PRICING.B.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[12px]" style={{ color: config.textMuted }}>
                      <Check className="w-3.5 h-3.5 text-[#8b7bb5] shrink-0" />{f}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[14px]" style={{ color: config.text }}>
                  <span className="font-bold text-[#8b7bb5]">{PRICING.B.perDay.toLocaleString()} so&apos;m</span>
                  <span style={{ color: config.textMuted }}> / kun</span>
                </div>
              </div>
              {selectedClass === "B" && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.accent }}>
                  <Check className="w-4 h-4" style={{ color: config.accentText }} />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {selectedClass && (
        <>
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
              <input value={laterDate} onChange={(e) => setLaterDate(e.target.value)} type="date" className="mt-2 w-full h-[44px] px-4 rounded-[10px] text-[14px] focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
            )}
          </div>

          <div className="rounded-[16px] p-5 mb-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px]" style={{ color: config.textMuted }}>Boost turi</span>
              <span className="text-[14px] font-semibold" style={{ color: config.text }}>{PRICING[selectedClass].label}</span>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
              <span className="text-[13px]" style={{ color: config.textMuted }}>Kun</span>
              <span className="text-[14px] font-semibold" style={{ color: config.text }}>{duration}</span>
            </div>
            <div className="flex items-center justify-between py-2" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
              <span className="text-[13px]" style={{ color: config.textMuted }}>Har kun uchun</span>
              <span className="text-[14px] font-semibold" style={{ color: config.text }}>{PRICING[selectedClass].perDay.toLocaleString()} so&apos;m</span>
            </div>
            <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
              <span className="text-[14px] font-semibold" style={{ color: config.text }}>Jami</span>
              <span className="text-[20px] font-bold" style={{ color: config.text }}>{price.toLocaleString()} so&apos;m</span>
            </div>
          </div>

          <div className="rounded-[14px] p-4 mb-5 flex items-center justify-between" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
                {canAfford ? <Wallet className="w-5 h-5" style={{ color: config.textMuted }} /> : <AlertCircle className="w-5 h-5 text-[#ef4444]" />}
              </div>
              <div>
                <p className="text-[12px]" style={{ color: config.textMuted }}>Joriy balans</p>
                <p className="text-[15px] font-bold" style={{ color: config.text }}>{balance.toLocaleString()} so&apos;m</p>
              </div>
            </div>
            {!canAfford && (
              <Link href="/center/balance" className="h-[36px] px-4 rounded-[10px] text-[13px] font-medium leading-[36px]" style={{ backgroundColor: config.accent, color: config.accentText }}>
                To&apos;ldirish
              </Link>
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
            disabled={!canAfford || submitting}
            className="w-full h-[52px] rounded-[14px] text-[15px] font-semibold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
            style={canAfford && !submitting ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textDim }}
          >
            <Zap className="w-5 h-5" />
            {submitting ? "Yuborilmoqda..." : canAfford ? `${price.toLocaleString()} so'm to'lash va yuborish` : "Balans yetarli emas"}
          </button>

          <p className="text-[11px] text-center mt-3" style={{ color: config.textDim }}>
            So&apos;rov admin tomonidan ko&apos;rib chiqilgandan so&apos;ng aktivlashadi
          </p>
        </>
      )}
    </div>
  );
}
