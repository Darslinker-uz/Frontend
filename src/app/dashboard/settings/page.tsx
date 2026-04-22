"use client";

import { useState } from "react";
import { Bell, Lock, Send, FileText, Trash2, Check, Eye, EyeOff, AlertCircle, Languages, Mail, Smartphone, Zap, Wallet, MessageSquare, User, Palette } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";
import { THEMES, type AdminTheme } from "@/context/admin-theme-context";

function Toggle({ checked, onChange, config }: { checked: boolean; onChange: (v: boolean) => void; config: { accent: string; hover: string; accentText: string; textMuted: string } }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-[44px] h-[24px] rounded-full transition-colors shrink-0"
      style={{ backgroundColor: checked ? config.accent : config.hover }}
    >
      <div
        className={`absolute top-[2px] w-[20px] h-[20px] rounded-full transition-all ${checked ? "left-[22px]" : "left-[2px]"}`}
        style={{ backgroundColor: checked ? config.accentText : config.textMuted }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, config, setTheme } = useDashboardTheme();

  // Xabarnomalar
  const [newLead, setNewLead] = useState(true);
  const [lowBalance, setLowBalance] = useState(true);
  const [boostExpire, setBoostExpire] = useState(true);
  const [dispute, setDispute] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // Xabarnoma kanallari
  const [telegram, setTelegram] = useState(true);
  const [email, setEmail] = useState(false);
  const [push, setPush] = useState(true);

  // Parol
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Til
  const [lang, setLang] = useState("uz");

  // Hisobni o'chirish
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <h1 className="text-[22px] md:text-[26px] font-bold mb-1" style={{ color: config.text }}>Sozlamalar</h1>
      <p className="text-[14px] mb-6" style={{ color: config.textMuted }}>Hisobingiz va xabarnomalarni boshqaring</p>

      <div className="space-y-4">
        {/* PANEL RANGI */}
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

        {/* PROFIL */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <User className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Profil</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Shaxsiy ma&apos;lumotlaringiz</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5 pb-5" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
            <div className="w-14 h-14 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <User className="h-6 w-6" style={{ color: config.textMuted }} />
            </div>
            <div>
              <p className="text-[15px] font-semibold" style={{ color: config.text }}>Demo User</p>
              <p className="text-[12px]" style={{ color: config.textDim }}>Kurs egasi</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Ism</label>
              <input placeholder="Ismingiz" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Telefon</label>
              <input disabled placeholder="+998 90 123 45 67" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/15" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.textDim }} />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Telegram</label>
              <input placeholder="@username" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
            </div>
            <button className="h-[42px] px-5 rounded-[10px] text-[13px] font-medium hover:opacity-90 mt-2" style={{ backgroundColor: config.accent, color: config.accentText }}>Saqlash</button>
          </div>
        </div>

        {/* TELEGRAM ULANISH */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <Send className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Telegram bot</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Xabarnomalarni telegramga qabul qiling</p>
            </div>
          </div>
          <div className="rounded-[12px] p-4 flex items-center justify-between" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-[13px] font-medium" style={{ color: config.text }}>Ulangan</p>
                <p className="text-[11px]" style={{ color: config.textDim }}>@your_username</p>
              </div>
            </div>
            <button className="h-[32px] px-3 rounded-[8px] text-[12px]" style={{ backgroundColor: config.hover, color: config.textMuted }}>Uzish</button>
          </div>
        </div>

        {/* XABARNOMALAR */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <Bell className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Xabarnomalar</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Qachon xabar olmoqchisiz</p>
            </div>
          </div>

          {/* Hodisalar */}
          <div className="space-y-1">
            {[
              { key: "newLead", label: "Yangi ariza", desc: "Har safar yangi lead kelganda", icon: MessageSquare, val: newLead, set: setNewLead },
              { key: "lowBalance", label: "Balans kam qoldi", desc: "Balans 50 000 so'mdan kam qolganda", icon: Wallet, val: lowBalance, set: setLowBalance },
              { key: "boostExpire", label: "Boost tugamoqda", desc: "Boost muddati tugashiga 1 kun qolganda", icon: Zap, val: boostExpire, set: setBoostExpire },
              { key: "dispute", label: "Dispute ochildi", desc: "Student shikoyat qo'yganda", icon: AlertCircle, val: dispute, set: setDispute },
              { key: "report", label: "Haftalik hisobot", desc: "Dushanba kuni haftalik statistika", icon: FileText, val: weeklyReport, set: setWeeklyReport },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-center gap-3 py-3">
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: config.surface }}>
                    <Icon className="w-4 h-4" style={{ color: config.textMuted }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium" style={{ color: config.text }}>{item.label}</p>
                    <p className="text-[12px]" style={{ color: config.textMuted }}>{item.desc}</p>
                  </div>
                  <Toggle checked={item.val} onChange={item.set} config={config} />
                </div>
              );
            })}
          </div>

          {/* Kanallar */}
          <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: config.textDim }}>Qayerga yuborilsin</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTelegram(!telegram)} className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-all" style={telegram ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textMuted }}>
                <Send className="w-3.5 h-3.5" /> Telegram
              </button>
              <button onClick={() => setPush(!push)} className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-all" style={push ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textMuted }}>
                <Smartphone className="w-3.5 h-3.5" /> Brauzer push
              </button>
              <button onClick={() => setEmail(!email)} className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-all" style={email ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textMuted }}>
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
            </div>
          </div>
        </div>

        {/* PAROL */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <Lock className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Parol o&apos;zgartirish</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Xavfsiz parol tanlang</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input type={showOldPwd ? "text" : "password"} placeholder="Joriy parol" className="w-full h-[44px] px-4 pr-11 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              <button onClick={() => setShowOldPwd(!showOldPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: config.textDim }}>
                {showOldPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input type={showNewPwd ? "text" : "password"} placeholder="Yangi parol" className="w-full h-[44px] px-4 pr-11 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              <button onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: config.textDim }}>
                {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input type="password" placeholder="Yangi parolni takrorlang" className="w-full h-[44px] px-4 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
            <button className="h-[42px] px-5 rounded-[10px] text-[13px] font-medium hover:opacity-90" style={{ backgroundColor: config.accent, color: config.accentText }}>Parolni saqlash</button>
          </div>
        </div>

        {/* INTERFEYS */}
        <div className="rounded-[16px] p-5 md:p-6" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
              <Languages className="w-5 h-5" style={{ color: config.textMuted }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Interfeys tili</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Dashboard tilini tanlang</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { code: "uz", label: "O'zbek" },
              { code: "ru", label: "Русский" },
              { code: "en", label: "English" },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="h-[40px] px-5 rounded-[10px] text-[13px] font-medium transition-all"
                style={lang === l.code ? { backgroundColor: config.accent, color: config.accentText } : { backgroundColor: config.hover, color: config.textMuted }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* HISOBNI O'CHIRISH */}
        <div className="rounded-[16px] bg-red-500/[0.05] border border-red-500/20 p-5 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[10px] bg-red-500/15 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: config.text }}>Hisobni o&apos;chirish</h2>
              <p className="text-[12px]" style={{ color: config.textMuted }}>Bu amaliyot qaytarib bo&apos;lmaydi</p>
            </div>
          </div>
          <p className="text-[13px] mb-4" style={{ color: config.textMuted }}>Hisobingiz butunlay o&apos;chiriladi: e&apos;lonlar, arizalar, balans va barcha ma&apos;lumotlar yo&apos;q bo&apos;ladi.</p>
          <button onClick={() => setConfirmDelete(true)} className="h-[40px] px-5 rounded-[10px] bg-red-500/15 text-red-400 text-[13px] font-medium hover:bg-red-500/25 border border-red-500/20">
            Hisobni o&apos;chirish
          </button>
        </div>
      </div>

      {/* O'chirish tasdiqlash modali */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative rounded-[18px] p-6 max-w-[440px] w-full" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-[12px] bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold" style={{ color: config.text }}>Hisobni butunlay o&apos;chirish?</h3>
                <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>Bu amaliyotni qaytarib bo&apos;lmaydi. E&apos;lonlar, arizalar, balans va tarix yo&apos;q bo&apos;ladi.</p>
              </div>
            </div>
            <p className="text-[12px] mb-2" style={{ color: config.textMuted }}>Tasdiqlash uchun <span className="font-mono" style={{ color: config.text }}>OCHIRISH</span> deb yozing:</p>
            <input placeholder="OCHIRISH" className="w-full h-[42px] px-3 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none focus:border-red-500/40 mb-4" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 h-[42px] rounded-[10px] text-[13px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                Bekor
              </button>
              <button className="flex-1 h-[42px] rounded-[10px] bg-red-500 text-white text-[13px] font-medium hover:bg-red-500/90">
                O&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
