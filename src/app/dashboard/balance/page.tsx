"use client";

import { useState } from "react";
import { Wallet, ArrowUpRight, History, X, Check, CreditCard } from "lucide-react";

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
      <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
        <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-6">Balans</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Balance Card */}
          <div className="rounded-[16px] bg-gradient-to-br from-[#1e1f23] to-[#2a2b30] border border-white/[0.08] p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative">
              <div className="w-11 h-11 rounded-[12px] bg-white/10 flex items-center justify-center mb-5">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <p className="text-[13px] text-white/40 mb-1">Joriy balans</p>
              <p className="text-[32px] font-bold text-white">
                50,000 <span className="text-[16px] font-normal text-white/40">so&apos;m</span>
              </p>
              <button onClick={() => setTopupOpen(true)} className="mt-5 h-[42px] px-5 rounded-[10px] bg-white text-[#16181a] text-[14px] font-medium flex items-center gap-2 hover:bg-white/90 transition-colors">
                <ArrowUpRight className="h-4 w-4" /> To&apos;ldirish
              </button>
            </div>
          </div>

          {/* History */}
          <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <History className="h-5 w-5 text-white/20" />
              <h2 className="text-[16px] font-bold text-white">To&apos;lov tarixi</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-10 rounded-[12px] border border-dashed border-white/[0.08]">
              <p className="text-[14px] text-white/20">Hali to&apos;lovlar yo&apos;q</p>
            </div>
          </div>
        </div>
      </div>

      {/* To'ldirish modal */}
      {topupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTopupOpen(false)} />
          <div className="relative bg-[#16181a] rounded-[20px] border border-white/[0.08] w-full max-w-[480px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#16181a] border-b border-white/[0.06] px-6 pt-5 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-white">Balansni to&apos;ldirish</h2>
                <p className="text-[12px] text-white/40 mt-0.5">Summani tanlang va to&apos;lov usulini belgilang</p>
              </div>
              <button onClick={() => setTopupOpen(false)} className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center shrink-0">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Summa tanlash */}
              <div>
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">Summa</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePreset(p)}
                      className={`h-[44px] rounded-[10px] text-[13px] font-medium transition-all ${amount === p && !customInput ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"}`}
                    >
                      {p >= 1000000 ? `${p / 1000000}M` : `${p / 1000}K`}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => handleCustom(e.target.value)}
                    placeholder="Boshqa summa..."
                    className="w-full h-[48px] px-4 pr-16 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[16px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-white/30">so&apos;m</span>
                </div>
              </div>

              {/* To'lov usuli */}
              <div>
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">To&apos;lov usuli</p>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`w-full flex items-center gap-3 rounded-[12px] p-3 transition-all border ${method === m.id ? "bg-white/[0.08] border-white/20" : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06]"}`}
                    >
                      <div className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${m.colors} flex items-center justify-center text-white font-bold text-[16px]`}>
                        {m.text}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[14px] font-semibold text-white">{m.name}</p>
                        <p className="text-[11px] text-white/30">Bank kartalari bilan to&apos;lov</p>
                      </div>
                      {method === m.id && (
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-[#16181a]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Xulosa */}
              <div className="rounded-[14px] bg-white/[0.04] border border-white/[0.06] p-4 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-white">Jami to&apos;lov</span>
                <span className="text-[20px] font-bold text-white">{formatPrice(amount)} so&apos;m</span>
              </div>

              {/* Submit */}
              <button
                disabled={amount <= 0}
                className={`w-full h-[50px] rounded-[12px] text-[15px] font-semibold flex items-center justify-center gap-2 transition-all ${amount > 0 ? "bg-white text-[#16181a] hover:bg-white/90" : "bg-white/[0.06] text-white/30 cursor-not-allowed"}`}
              >
                <CreditCard className="w-4 h-4" />
                {formatPrice(amount)} so&apos;m to&apos;lash
              </button>

              <p className="text-[11px] text-white/25 text-center">
                To&apos;lov xavfsiz. Ma&apos;lumotlar uchinchi shaxslarga berilmaydi.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
