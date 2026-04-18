"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Crown, Sparkles, Check, Wallet, AlertCircle } from "lucide-react";

type ClassType = "A" | "B";

const PRICING = {
  A: { perDay: 100000, label: "A-class", desc: "Bosh sahifadagi katta slider — eng yuqori ko'rinish", features: ["Bosh sahifada katta karussel", "Har 6 soniyada ko'rinadi", "Premium ko'rinish", "Eng yuqori e'tibor"] },
  B: { perDay: 70000, label: "B-class", desc: "Mashhur kurslar — doim aylanib turadigan slider", features: ["Bosh sahifa mashhur kurslar", "Doim aylanib turadi", "Professional ko'rinish", "Yuqori ko'rinish"] },
};

const MOCK_LISTING = {
  title: "JavaScript & React Full-stack",
  category: "IT & Dasturlash",
  balance: 850000,
};

export default function BoostPage() {
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [duration, setDuration] = useState(7);
  const [startDate, setStartDate] = useState("now");

  const pct = ((duration - 1) / 29) * 100;

  const price = selectedClass ? PRICING[selectedClass].perDay * duration : 0;
  const canAfford = price <= MOCK_LISTING.balance;

  return (
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-[13px] text-[#7ea2d4] font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> E&apos;lonlar
      </Link>

      <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-1">E&apos;lonni ko&apos;tarish</h1>
      <p className="text-[14px] text-white/40 mb-6">Ko&apos;proq ko&apos;rinish uchun boost yoqing</p>

      {/* E'lon info */}
      <div className="rounded-[14px] bg-white/[0.04] border border-white/[0.06] p-4 mb-5">
        <p className="text-[12px] text-white/30 mb-1">{MOCK_LISTING.category}</p>
        <p className="text-[15px] font-semibold text-white">{MOCK_LISTING.title}</p>
      </div>

      {/* Class tanlash */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold text-white/60 uppercase tracking-wider mb-3">Boost turi</p>
        <div className="space-y-3">
          {/* A-class */}
          <button
            onClick={() => setSelectedClass("A")}
            className={`w-full text-left rounded-[16px] p-5 transition-all border-2 ${selectedClass === "A" ? "border-white bg-white/[0.08]" : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06]"}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#7ea2d4] to-[#4a7ab5] flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[17px] font-bold text-white">A-class</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7ea2d4] to-[#4a7ab5] text-white font-bold">PREMIUM</span>
                </div>
                <p className="text-[13px] text-white/50 mb-3">{PRICING.A.desc}</p>
                <div className="space-y-1.5">
                  {PRICING.A.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[12px] text-white/60">
                      <Check className="w-3.5 h-3.5 text-white/70 shrink-0" />{f}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[14px] text-white">
                  <span className="font-bold text-white">{PRICING.A.perDay.toLocaleString()} so&apos;m</span>
                  <span className="text-white/40"> / kun</span>
                </div>
              </div>
              {selectedClass === "A" && (
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#16181a]" />
                </div>
              )}
            </div>
          </button>

          {/* B-class */}
          <button
            onClick={() => setSelectedClass("B")}
            className={`w-full text-left rounded-[16px] p-5 transition-all border-2 ${selectedClass === "B" ? "border-white bg-white/[0.08]" : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06]"}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#6b5b95] to-[#8b7bb5] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[17px] font-bold text-white">B-class</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-medium">STANDART</span>
                </div>
                <p className="text-[13px] text-white/50 mb-3">{PRICING.B.desc}</p>
                <div className="space-y-1.5">
                  {PRICING.B.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[12px] text-white/60">
                      <Check className="w-3.5 h-3.5 text-[#8b7bb5] shrink-0" />{f}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[14px] text-white">
                  <span className="font-bold text-[#8b7bb5]">{PRICING.B.perDay.toLocaleString()} so&apos;m</span>
                  <span className="text-white/40"> / kun</span>
                </div>
              </div>
              {selectedClass === "B" && (
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#16181a]" />
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {selectedClass && (
        <>
          {/* Davomiylik slider */}
          <div className="mb-5 rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-semibold text-white/60 uppercase tracking-wider">Davomiylik</p>
              <span className="text-[11px] text-white/30">1-30 kun</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-[40px] font-bold text-white leading-none">{duration}</span>
              <span className="text-[16px] text-white/40">kun</span>
            </div>
            {/* Slider */}
            <div className="relative h-[32px] flex items-center">
              <div className="absolute left-0 right-0 h-[6px] rounded-full bg-white/[0.08]" />
              <div className="absolute h-[6px] rounded-full bg-white" style={{ width: `${pct}%` }} />
              <input
                type="range"
                min={1}
                max={30}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="absolute w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#16181a] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab"
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-white/25">
              <span>1</span>
              <span>7</span>
              <span>14</span>
              <span>21</span>
              <span>30</span>
            </div>
            {/* Tezkor tanlash */}
            <div className="flex items-center gap-1.5 mt-4">
              {[7, 14, 21, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 h-[32px] rounded-[8px] text-[12px] font-medium transition-all ${duration === d ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/40 hover:text-white/70"}`}
                >
                  {d} kun
                </button>
              ))}
            </div>
          </div>

          {/* Boshlash */}
          <div className="mb-5">
            <p className="text-[13px] font-semibold text-white/60 uppercase tracking-wider mb-3">Boshlash vaqti</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setStartDate("now")}
                className={`h-[52px] rounded-[12px] text-[14px] font-medium transition-all border-2 ${startDate === "now" ? "border-white bg-white/[0.08] text-white" : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/80"}`}
              >
                Darhol
              </button>
              <button
                onClick={() => setStartDate("later")}
                className={`h-[52px] rounded-[12px] text-[14px] font-medium transition-all border-2 ${startDate === "later" ? "border-white bg-white/[0.08] text-white" : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/80"}`}
              >
                Keyinroq
              </button>
            </div>
            {startDate === "later" && (
              <input type="date" className="mt-2 w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white focus:outline-none focus:border-[#7ea2d4]/40" />
            )}
          </div>

          {/* Xulosa */}
          <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 mb-5">
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-white/50">Boost turi</span>
              <span className="text-[14px] font-semibold text-white">{PRICING[selectedClass].label}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-white/[0.06]">
              <span className="text-[13px] text-white/50">Kun</span>
              <span className="text-[14px] font-semibold text-white">{duration}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-white/[0.06]">
              <span className="text-[13px] text-white/50">Har kun uchun</span>
              <span className="text-[14px] font-semibold text-white">{PRICING[selectedClass].perDay.toLocaleString()} so&apos;m</span>
            </div>
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-white/[0.1]">
              <span className="text-[14px] font-semibold text-white">Jami</span>
              <span className="text-[20px] font-bold text-white">{price.toLocaleString()} so&apos;m</span>
            </div>
          </div>

          {/* Balans */}
          <div className="rounded-[14px] p-4 mb-5 flex items-center justify-between bg-white/[0.04] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-white/[0.08]">
                {canAfford ? <Wallet className="w-5 h-5 text-white/70" /> : <AlertCircle className="w-5 h-5 text-white/70" />}
              </div>
              <div>
                <p className="text-[12px] text-white/40">Joriy balans</p>
                <p className="text-[15px] font-bold text-white">{MOCK_LISTING.balance.toLocaleString()} so&apos;m</p>
              </div>
            </div>
            {!canAfford && (
              <Link href="/dashboard/balance" className="h-[36px] px-4 rounded-[10px] bg-white text-[#16181a] text-[13px] font-medium">
                To&apos;ldirish
              </Link>
            )}
          </div>

          {/* Submit */}
          <button
            disabled={!canAfford}
            className={`w-full h-[52px] rounded-[14px] text-[15px] font-semibold flex items-center justify-center gap-2 transition-all ${canAfford ? "bg-white text-[#16181a] hover:bg-white/90" : "bg-white/[0.06] text-white/30 cursor-not-allowed"}`}
          >
            <Zap className="w-5 h-5" />
            {canAfford ? `${price.toLocaleString()} so'm to'lash va yoqish` : "Balans yetarli emas"}
          </button>
        </>
      )}
    </div>
  );
}
