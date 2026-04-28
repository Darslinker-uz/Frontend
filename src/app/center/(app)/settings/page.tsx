"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Lock, Send, FileText, Trash2, Check, Eye, EyeOff, AlertCircle, Languages, Mail, Smartphone, Zap, Wallet, MessageSquare, User, Palette } from "lucide-react";
import { useDashboardTheme } from "@/context/dashboard-theme-context";
import { THEMES, type AdminTheme } from "@/context/admin-theme-context";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  provider: "Kurs egasi",
  student: "O'quvchi",
};

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
  const { data: session, update: updateSession } = useSession();
  const sessionUser = session?.user as { name?: string; role?: string; phone?: string } | undefined;

  // Profil
  const [name, setName] = useState("");
  const [centerName, setCenterName] = useState("");
  const [emailAddr, setEmailAddr] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Parol
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

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

  // Parol visibility
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Til
  const [lang, setLang] = useState("uz");

  // Hisobni o'chirish
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard/profile", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json() as { user: { name: string; centerName: string | null; email: string | null; phone: string } };
        if (cancelled) return;
        setName(data.user.name ?? "");
        setCenterName(data.user.centerName ?? "");
        setEmailAddr(data.user.email ?? "");
      } catch (e) {
        console.error("[settings] load profile failed", e);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const saveProfile = async () => {
    setProfileMsg(null);
    if (!name.trim() || name.trim().length < 2) {
      setProfileMsg({ kind: "err", text: "Ism juda qisqa" });
      return;
    }
    setProfileSaving(true);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: emailAddr.trim() || null, centerName: centerName.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg({ kind: "err", text: data?.error ?? "Xatolik" });
        return;
      }
      setProfileMsg({ kind: "ok", text: "Profil saqlandi" });
      try { await updateSession({ name: name.trim() }); } catch {}
    } catch {
      setProfileMsg({ kind: "err", text: "Tarmoq xatosi" });
    } finally {
      setProfileSaving(false);
    }
  };

  const changePassword = async () => {
    setPwdMsg(null);
    if (!newPwd || newPwd.length < 6) {
      setPwdMsg({ kind: "err", text: "Yangi parol kamida 6 belgi" });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ kind: "err", text: "Parollar mos emas" });
      return;
    }
    setPwdSaving(true);
    try {
      const res = await fetch("/api/dashboard/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: currentPwd, new: newPwd, confirm: confirmPwd }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwdMsg({ kind: "err", text: data?.error ?? "Xatolik" });
        return;
      }
      setPwdMsg({ kind: "ok", text: "Parol yangilandi" });
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch {
      setPwdMsg({ kind: "err", text: "Tarmoq xatosi" });
    } finally {
      setPwdSaving(false);
    }
  };

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
              <p className="text-[15px] font-semibold" style={{ color: config.text }}>
                {sessionUser?.name ?? "Foydalanuvchi"}
              </p>
              <p className="text-[12px]" style={{ color: config.textDim }}>
                {sessionUser?.role ? (ROLE_LABEL[sessionUser.role] ?? sessionUser.role) : ""}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Ism</label>
              <input
                value={profileLoading ? "" : name}
                onChange={(e) => setName(e.target.value)}
                placeholder={profileLoading ? "Yuklanmoqda..." : "Ismingiz"}
                disabled={profileLoading}
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Markaz nomi (agar bor bo&apos;lsa)</label>
              <input
                value={profileLoading ? "" : centerName}
                onChange={(e) => setCenterName(e.target.value)}
                placeholder={profileLoading ? "Yuklanmoqda..." : "Masalan: IT Park Academy"}
                disabled={profileLoading}
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
              <p className="text-[11px] mt-1.5" style={{ color: config.textDim }}>
                Kurs egasi sifatida e&apos;lonlarda ko&apos;rinadi. Bo&apos;sh qoldirsangiz, ismingiz ishlatiladi.
              </p>
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Telefon raqam</label>
              <div
                className="w-full h-[44px] px-4 rounded-[10px] flex items-center justify-between text-[15px]"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              >
                <span>{sessionUser?.phone || "—"}</span>
                <span className="text-[11px]" style={{ color: config.textDim }}>O&apos;zgartirib bo&apos;lmaydi</span>
              </div>
            </div>
            <div>
              <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Email</label>
              <input
                value={profileLoading ? "" : emailAddr}
                onChange={(e) => setEmailAddr(e.target.value)}
                placeholder="you@example.com"
                disabled={profileLoading}
                className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
            </div>
            {profileMsg && (
              <p className="text-[12px]" style={{ color: profileMsg.kind === "ok" ? "#22c55e" : "#ef4444" }}>
                {profileMsg.text}
              </p>
            )}
            <button
              onClick={saveProfile}
              disabled={profileSaving || profileLoading}
              className="h-[42px] px-5 rounded-[10px] text-[13px] font-medium hover:opacity-90 mt-2 disabled:opacity-50"
              style={{ backgroundColor: config.accent, color: config.accentText }}
            >
              {profileSaving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
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
              <input
                type={showOldPwd ? "text" : "password"}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="Joriy parol"
                className="w-full h-[44px] px-4 pr-11 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
              <button onClick={() => setShowOldPwd(!showOldPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: config.textDim }}>
                {showOldPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showNewPwd ? "text" : "password"}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Yangi parol"
                className="w-full h-[44px] px-4 pr-11 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none"
                style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
              />
              <button onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: config.textDim }}>
                {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Yangi parolni takrorlang"
              className="w-full h-[44px] px-4 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none"
              style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
            />
            {pwdMsg && (
              <p className="text-[12px]" style={{ color: pwdMsg.kind === "ok" ? "#22c55e" : "#ef4444" }}>
                {pwdMsg.text}
              </p>
            )}
            <button
              onClick={changePassword}
              disabled={pwdSaving}
              className="h-[42px] px-5 rounded-[10px] text-[13px] font-medium hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: config.accent, color: config.accentText }}
            >
              {pwdSaving ? "Saqlanmoqda..." : "Parolni saqlash"}
            </button>
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
