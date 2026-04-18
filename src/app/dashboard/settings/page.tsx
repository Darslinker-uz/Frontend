"use client";

import { useState } from "react";
import { Bell, Lock, Send, FileText, Trash2, Check, Eye, EyeOff, AlertCircle, Languages, Mail, Smartphone, Zap, Wallet, MessageSquare, User } from "lucide-react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-[44px] h-[24px] rounded-full transition-colors shrink-0 ${checked ? "bg-white" : "bg-white/[0.1]"}`}
    >
      <div className={`absolute top-[2px] w-[20px] h-[20px] rounded-full transition-all ${checked ? "left-[22px] bg-[#16181a]" : "left-[2px] bg-white/60"}`} />
    </button>
  );
}

export default function SettingsPage() {
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
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-1">Sozlamalar</h1>
      <p className="text-[14px] text-white/40 mb-6">Hisobingiz va xabarnomalarni boshqaring</p>

      <div className="space-y-4">
        {/* PROFIL */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <User className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white">Profil</h2>
              <p className="text-[12px] text-white/40">Shaxsiy ma&apos;lumotlaringiz</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.06]">
            <div className="w-14 h-14 rounded-[14px] bg-white/[0.08] flex items-center justify-center">
              <User className="h-6 w-6 text-white/60" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">Demo User</p>
              <p className="text-[12px] text-white/30">Kurs egasi</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[12px] text-white/40 mb-1.5 block">Ism</label>
              <input placeholder="Ismingiz" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="text-[12px] text-white/40 mb-1.5 block">Telefon</label>
              <input disabled placeholder="+998 90 123 45 67" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.03] border border-white/[0.06] text-[15px] text-white/30 placeholder:text-white/15" />
            </div>
            <div>
              <label className="text-[12px] text-white/40 mb-1.5 block">Telegram</label>
              <input placeholder="@username" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
            </div>
            <button className="h-[42px] px-5 rounded-[10px] bg-white text-[#16181a] text-[13px] font-medium hover:bg-white/90 mt-2">Saqlash</button>
          </div>
        </div>

        {/* TELEGRAM ULANISH */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <Send className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white">Telegram bot</h2>
              <p className="text-[12px] text-white/40">Xabarnomalarni telegramga qabul qiling</p>
            </div>
          </div>
          <div className="rounded-[12px] bg-white/[0.03] border border-white/[0.06] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">Ulangan</p>
                <p className="text-[11px] text-white/30">@your_username</p>
              </div>
            </div>
            <button className="h-[32px] px-3 rounded-[8px] bg-white/[0.06] text-[12px] text-white/60 hover:text-white">Uzish</button>
          </div>
        </div>

        {/* XABARNOMALAR */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <Bell className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white">Xabarnomalar</h2>
              <p className="text-[12px] text-white/40">Qachon xabar olmoqchisiz</p>
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
                  <div className="w-8 h-8 rounded-[8px] bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-white">{item.label}</p>
                    <p className="text-[12px] text-white/40">{item.desc}</p>
                  </div>
                  <Toggle checked={item.val} onChange={item.set} />
                </div>
              );
            })}
          </div>

          {/* Kanallar */}
          <div className="border-t border-white/[0.06] mt-4 pt-4">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">Qayerga yuborilsin</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTelegram(!telegram)} className={`h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-all ${telegram ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/50"}`}>
                <Send className="w-3.5 h-3.5" /> Telegram
              </button>
              <button onClick={() => setPush(!push)} className={`h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-all ${push ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/50"}`}>
                <Smartphone className="w-3.5 h-3.5" /> Brauzer push
              </button>
              <button onClick={() => setEmail(!email)} className={`h-[40px] px-4 rounded-[10px] text-[13px] font-medium flex items-center gap-2 transition-all ${email ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/50"}`}>
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
            </div>
          </div>
        </div>

        {/* PAROL */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white">Parol o&apos;zgartirish</h2>
              <p className="text-[12px] text-white/40">Xavfsiz parol tanlang</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input type={showOldPwd ? "text" : "password"} placeholder="Joriy parol" className="w-full h-[44px] px-4 pr-11 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
              <button onClick={() => setShowOldPwd(!showOldPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showOldPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input type={showNewPwd ? "text" : "password"} placeholder="Yangi parol" className="w-full h-[44px] px-4 pr-11 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
              <button onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input type="password" placeholder="Yangi parolni takrorlang" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
            <button className="h-[42px] px-5 rounded-[10px] bg-white text-[#16181a] text-[13px] font-medium hover:bg-white/90">Parolni saqlash</button>
          </div>
        </div>

        {/* INTERFEYS */}
        <div className="rounded-[16px] bg-white/[0.04] border border-white/[0.06] p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <Languages className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white">Interfeys tili</h2>
              <p className="text-[12px] text-white/40">Dashboard tilini tanlang</p>
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
                className={`h-[40px] px-5 rounded-[10px] text-[13px] font-medium transition-all ${lang === l.code ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/50 hover:text-white/70"}`}
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
              <h2 className="text-[16px] font-bold text-white">Hisobni o&apos;chirish</h2>
              <p className="text-[12px] text-white/40">Bu amaliyot qaytarib bo&apos;lmaydi</p>
            </div>
          </div>
          <p className="text-[13px] text-white/50 mb-4">Hisobingiz butunlay o&apos;chiriladi: e&apos;lonlar, arizalar, balans va barcha ma&apos;lumotlar yo&apos;q bo&apos;ladi.</p>
          <button onClick={() => setConfirmDelete(true)} className="h-[40px] px-5 rounded-[10px] bg-red-500/15 text-red-400 text-[13px] font-medium hover:bg-red-500/25 border border-red-500/20">
            Hisobni o&apos;chirish
          </button>
        </div>
      </div>

      {/* O'chirish tasdiqlash modali */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-[#16181a] rounded-[18px] border border-white/[0.08] p-6 max-w-[440px] w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-[12px] bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-white">Hisobni butunlay o&apos;chirish?</h3>
                <p className="text-[13px] text-white/50 mt-1">Bu amaliyotni qaytarib bo&apos;lmaydi. E&apos;lonlar, arizalar, balans va tarix yo&apos;q bo&apos;ladi.</p>
              </div>
            </div>
            <p className="text-[12px] text-white/40 mb-2">Tasdiqlash uchun <span className="text-white font-mono">OCHIRISH</span> deb yozing:</p>
            <input placeholder="OCHIRISH" className="w-full h-[42px] px-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 h-[42px] rounded-[10px] bg-white/[0.06] text-white/60 text-[13px] font-medium hover:bg-white/[0.1]">
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
