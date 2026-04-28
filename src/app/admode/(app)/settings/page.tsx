"use client";

import { useAdminTheme, THEMES, type AdminTheme } from "@/context/admin-theme-context";
import { Palette, Check, Percent, Bell, Shield } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const { theme, config, setTheme } = useAdminTheme();
  const [leadPrice, setLeadPrice] = useState(15000);
  const [aClassPrice, setAClassPrice] = useState(100000);
  const [bClassPrice, setBClassPrice] = useState(70000);
  const [commission, setCommission] = useState(15);

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>Sozlamalar</h1>
      <p className="text-[14px] mb-6" style={{ color: config.textMuted }}>Platforma va interfeys sozlamalari</p>

      <div className="space-y-4">
        {/* TEMA */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <Palette className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Panel rangi</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>O&apos;zingizga yoqqanini tanlang</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(Object.keys(THEMES) as AdminTheme[]).map((t) => {
              const th = THEMES[t];
              const isActive = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className="relative rounded-[14px] p-3 text-left transition-all"
                  style={{
                    backgroundColor: th.bg,
                    border: `2px solid ${isActive ? th.accent : th.surfaceBorder}`,
                  }}
                >
                  {/* Preview mini */}
                  <div className="flex gap-1 mb-3 h-[44px]">
                    <div className="w-[30%] rounded-[6px]" style={{ backgroundColor: th.sidebar }} />
                    <div className="flex-1 rounded-[6px]" style={{ backgroundColor: th.surface, border: `1px solid ${th.surfaceBorder}` }}>
                      <div className="h-[6px] w-[50%] rounded-full mt-1.5 ml-1.5" style={{ backgroundColor: th.text, opacity: 0.7 }} />
                      <div className="h-[4px] w-[70%] rounded-full mt-1 ml-1.5" style={{ backgroundColor: th.textMuted, opacity: 0.5 }} />
                      <div className="h-[8px] w-[30%] rounded-full mt-1.5 ml-1.5" style={{ backgroundColor: th.accent }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-bold" style={{ color: th.text }}>{th.label}</p>
                      <p className="text-[10px]" style={{ color: th.textMuted }}>{th.desc}</p>
                    </div>
                    {isActive && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: th.accent }}>
                        <Check className="w-3 h-3" style={{ color: th.accentText }} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* NARXLAR */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <Percent className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Narx va komissiya</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Platforma umumiy tariflar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Lead narxi (so&apos;m)</label>
              <input
                type="number"
                value={leadPrice}
                onChange={(e) => setLeadPrice(Number(e.target.value))}
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none transition-colors"
                style={{
                  backgroundColor: config.hover,
                  border: `1px solid ${config.surfaceBorder}`,
                  color: config.text,
                }}
              />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Komissiya (%)</label>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none transition-colors"
                style={{
                  backgroundColor: config.hover,
                  border: `1px solid ${config.surfaceBorder}`,
                  color: config.text,
                }}
              />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>A-class boost (so&apos;m/kun)</label>
              <input
                type="number"
                value={aClassPrice}
                onChange={(e) => setAClassPrice(Number(e.target.value))}
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none transition-colors"
                style={{
                  backgroundColor: config.hover,
                  border: `1px solid ${config.surfaceBorder}`,
                  color: config.text,
                }}
              />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>B-class boost (so&apos;m/kun)</label>
              <input
                type="number"
                value={bClassPrice}
                onChange={(e) => setBClassPrice(Number(e.target.value))}
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none transition-colors"
                style={{
                  backgroundColor: config.hover,
                  border: `1px solid ${config.surfaceBorder}`,
                  color: config.text,
                }}
              />
            </div>
          </div>
          <button
            className="mt-4 h-[42px] px-5 rounded-[10px] text-[13px] font-medium"
            style={{ backgroundColor: config.accent, color: config.accentText }}
          >
            Saqlash
          </button>
        </div>

        {/* BOT */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <Bell className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Telegram bot</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Bot token va webhook</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Bot username</label>
              <input
                defaultValue="@darslinker_bot"
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none"
                style={{
                  backgroundColor: config.hover,
                  border: `1px solid ${config.surfaceBorder}`,
                  color: config.text,
                }}
              />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Bot token</label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none"
                style={{
                  backgroundColor: config.hover,
                  border: `1px solid ${config.surfaceBorder}`,
                  color: config.text,
                }}
              />
            </div>
          </div>
        </div>

        {/* XAVFSIZLIK */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <Shield className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Xavfsizlik</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Admin akkaunti</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Joriy parol</label>
              <input
                type="password"
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Yangi parol</label>
              <input
                type="password"
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
            </div>
            <button
              className="h-[42px] px-5 rounded-[10px] text-[13px] font-medium"
              style={{ backgroundColor: config.accent, color: config.accentText }}
            >
              Parolni yangilash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
