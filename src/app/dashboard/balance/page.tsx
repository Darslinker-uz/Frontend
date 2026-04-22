"use client";

import { useState } from "react";
import { Wallet, ArrowUpRight, History, X, Check, CreditCard } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";

const PRESETS = [50000, 100000, 250000, 500000, 1000000];

const PAYMENT_METHODS = [
  { id: "payme", name: "Payme", colors: "from-[#00c7ff] to-[#00a8e8]", text: "P" },
  { id: "click", name: "Click", colors: "from-[#2db7fc] to-[#1995d8]", text: "C" },
  { id: "uzum", name: "Uzum Bank", colors: "from-[#7b4ae8] to-[#5a32c4]", text: "U" },
];

function formatPrice(v: number) {
  return v.toLocaleString("uz-UZ").replace(/\s/g, ",");
}

export default function BalancePage() {
  const { config } = useDashboardTheme();
  const [topupOpen, setTopupOpen] = useState(false);
  const [amount, setAmount] = useState(100000);
  const [customInput, setCustomInput] = useState("");
  const [method, setMethod] = useState("payme");

  const handlePreset = (v: number) => {
    setAmount(v);
    setCustomInput("");
  };

  const handleCustom = (v: string) => {
    setCustomInput(v);
    const num = Number(v.replace(/[^0-9]/g, ""));
    if (num > 0) setAmount(num);
  };

  return (
    <>
      <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
        <h1 className="text-[22px] md:text-[26px] font-bold mb-6" style={{ color: config.text }}>Balans</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Balance Card */}
          <div
            className="rounded-[16px] bg-gradient-to-br from-[#1e1f23] to-[#2a2b30] p-6 md:p-8 relative overflow-hidden"
            style={{ border: `1px solid ${config.surfaceBorder}` }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative">
              <div className="w-11 h-11 rounded-[12px] bg-white/10 flex items-center justify-center mb-5">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <p className="text-[13px] text-white/40 mb-1">Joriy balans</p>
              <p className="text-[32px] font-bold text-white">
                50,000 <span className="text-[16px] font-normal text-white/40">so&apos;m</span>
              </p>
              <button
                onClick={() => setTopupOpen(true)}
                className="mt-5 h-[42px] px-5 rounded-[10px] text-[14px] font-medium flex items-center gap-2 transition-colors"
                style={{ backgroundColor: config.accent, color: config.accentText }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = config.accentHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = config.accent; }}
              >
                <ArrowUpRight className="h-4 w-4" /> To&apos;ldirish
              </button>
            </div>
          </div>

          {/* History */}
          <div
            className="rounded-[16px] p-6 md:p-8"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
          >
            <div className="flex items-center gap-2 mb-5">
              <History className="h-5 w-5" style={{ color: config.textDim }} />
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>To&apos;lov tarixi</h2>
            </div>
            <div
              className="flex flex-col items-center justify-center py-10 rounded-[12px] border border-dashed"
              style={{ borderColor: config.surfaceBorder }}
            >
              <p className="text-[14px]" style={{ color: config.textDim }}>Hali to&apos;lovlar yo&apos;q</p>
            </div>
          </div>
        </div>
      </div>

      {/* To'ldirish modal */}
      {topupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTopupOpen(false)} />
          <div
            className="relative rounded-[20px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}
          >
            {/* Header */}
            <div
              className="sticky top-0 px-6 pt-5 pb-4 flex items-center justify-between"
              style={{ backgroundColor: config.sidebar, borderBottom: `1px solid ${config.surfaceBorder}` }}
            >
              <div>
                <h2 className="text-[18px] font-bold" style={{ color: config.text }}>Balansni to&apos;ldirish</h2>
                <p className="text-[12px] mt-0.5" style={{ color: config.textMuted }}>Summani tanlang va to&apos;lov usulini belgilang</p>
              </div>
              <button
                onClick={() => setTopupOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: config.hover }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = config.active; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = config.hover; }}
              >
                <X className="w-4 h-4" style={{ color: config.textMuted }} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Summa tanlash */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textDim }}>Summa</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                  {PRESETS.map((p) => {
                    const selected = amount === p && !customInput;
                    return (
                      <button
                        key={p}
                        onClick={() => handlePreset(p)}
                        className="h-[44px] rounded-[10px] text-[13px] font-medium transition-all"
                        style={{
                          backgroundColor: selected ? config.accent : config.hover,
                          color: selected ? config.accentText : config.textMuted,
                        }}
                        onMouseEnter={(e) => {
                          if (!selected) e.currentTarget.style.backgroundColor = config.active;
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) e.currentTarget.style.backgroundColor = config.hover;
                        }}
                      >
                        {p >= 1000000 ? `${p / 1000000}M` : `${p / 1000}K`}
                      </button>
                    );
                  })}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => handleCustom(e.target.value)}
                    placeholder="Boshqa summa..."
                    className="w-full h-[48px] px-4 pr-16 rounded-[10px] text-[16px] placeholder:text-white/20 focus:outline-none"
                    style={{
                      backgroundColor: config.hover,
                      border: `1px solid ${config.surfaceBorder}`,
                      color: config.text,
                    }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: config.textDim }}>so&apos;m</span>
                </div>
              </div>

              {/* To'lov usuli */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textDim }}>To&apos;lov usuli</p>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => {
                    const selected = method === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className="w-full flex items-center gap-3 rounded-[12px] p-3 transition-all"
                        style={{
                          backgroundColor: selected ? config.active : config.surface,
                          border: `1px solid ${config.surfaceBorder}`,
                        }}
                        onMouseEnter={(e) => {
                          if (!selected) e.currentTarget.style.backgroundColor = config.hover;
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) e.currentTarget.style.backgroundColor = config.surface;
                        }}
                      >
                        <div className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${m.colors} flex items-center justify-center text-white font-bold text-[16px]`}>
                          {m.text}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[14px] font-semibold" style={{ color: config.text }}>{m.name}</p>
                          <p className="text-[11px]" style={{ color: config.textDim }}>Bank kartalari bilan to&apos;lov</p>
                        </div>
                        {selected && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: config.accent }}
                          >
                            <Check className="w-4 h-4" style={{ color: config.accentText }} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Xulosa */}
              <div
                className="rounded-[14px] p-4 flex items-center justify-between"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <span className="text-[14px] font-semibold" style={{ color: config.text }}>Jami to&apos;lov</span>
                <span className="text-[20px] font-bold" style={{ color: config.text }}>{formatPrice(amount)} so&apos;m</span>
              </div>

              {/* Submit */}
              <button
                disabled={amount <= 0}
                className="w-full h-[50px] rounded-[12px] text-[15px] font-semibold flex items-center justify-center gap-2 transition-all"
                style={
                  amount > 0
                    ? { backgroundColor: config.accent, color: config.accentText, cursor: "pointer" }
                    : { backgroundColor: config.hover, color: config.textDim, cursor: "not-allowed" }
                }
                onMouseEnter={(e) => {
                  if (amount > 0) e.currentTarget.style.backgroundColor = config.accentHover;
                }}
                onMouseLeave={(e) => {
                  if (amount > 0) e.currentTarget.style.backgroundColor = config.accent;
                }}
              >
                <CreditCard className="w-4 h-4" />
                {formatPrice(amount)} so&apos;m to&apos;lash
              </button>

              <p className="text-[11px] text-center" style={{ color: config.textDim }}>
                To&apos;lov xavfsiz. Ma&apos;lumotlar uchinchi shaxslarga berilmaydi.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
