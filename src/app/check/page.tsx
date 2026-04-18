"use client";

import { useState } from "react";
import { Phone, Clock, Check, XCircle, MoreHorizontal, GripVertical, LayoutDashboard, FileText, Users, Wallet, User, LogOut, X, Calendar, MessageSquare, Mail, Send, History, BookOpen, Copy, Plus } from "lucide-react";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";

type Lead = { id: number; name: string; phone: string; course: string; time: string; status: string; note?: string };

const COLS = [
  { key: "yangi", title: "Yangi ariza", color: "#3b82f6", count: 3 },
  { key: "jarayonda", title: "Jarayonda", color: "#f59e0b", count: 2 },
  { key: "sotib_oldi", title: "Sotib oldi", color: "#22c55e", count: 1 },
  { key: "sifatsiz", title: "Sifatsiz", color: "#ef4444", count: 1 },
];

const LEADS: Lead[] = [
  { id: 1, name: "Jasur Karimov", phone: "+998 90 123 45 67", course: "JavaScript & React", time: "2 daqiqa oldin", status: "yangi" },
  { id: 2, name: "Madina Rahimova", phone: "+998 91 234 56 78", course: "UI/UX dizayn Figma", time: "15 daqiqa oldin", status: "yangi" },
  { id: 3, name: "Bobur Toshmatov", phone: "+998 93 345 67 89", course: "IELTS 7.0+", time: "1 soat oldin", status: "yangi" },
  { id: 4, name: "Nilufar Azimova", phone: "+998 94 456 78 90", course: "Python Backend", time: "2 soat oldin", status: "jarayonda", note: "Ertaga bog'laniladi" },
  { id: 5, name: "Sardor Umarov", phone: "+998 90 567 89 01", course: "Data Science", time: "3 soat oldin", status: "jarayonda", note: "Yana bir bor qo'ng'iroq kerak" },
  { id: 6, name: "Zarina Aliyeva", phone: "+998 91 678 90 12", course: "Digital Marketing", time: "5 soat oldin", status: "sotib_oldi" },
  { id: 7, name: "Otabek Nazarov", phone: "+998 93 789 01 23", course: "Flutter", time: "6 soat oldin", status: "sifatsiz", note: "Telefonni ko'tarmadi" },
];

// Inicial harflar
const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

// Fon rangini ismdan generatsiya
const avatarColor = (name: string) => {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444", "#f97316"];
  return colors[name.charCodeAt(0) % colors.length];
};

export default function CheckPage() {
  const [active, setActive] = useState(3);
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [moveMenu, setMoveMenu] = useState<number | null>(null);
  const [colMenu, setColMenu] = useState<string | null>(null);
  const [addLead, setAddLead] = useState<string | null>(null);

  const variants = [
    "1 — Compact",
    "2 — Avatar + full info",
    "3 — Minimal cards",
    "4 — Big cards + avatar",
    "5 — Timeline style",
  ];

  const navItems = [
    { href: "#", label: "Bosh sahifa", icon: LayoutDashboard, active: false },
    { href: "#", label: "E'lonlar", icon: FileText, active: false },
    { href: "#", label: "Arizalar", icon: Users, active: true },
    { href: "#", label: "Balans", icon: Wallet, active: false },
    { href: "#", label: "Profil", icon: User, active: false },
  ];

  return (
    <div className="bg-[#0e1015] min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden md:block w-[240px] shrink-0">
        <div className="fixed top-0 left-0 w-[240px] h-screen bg-[#16181a] flex flex-col">
          <div className="px-5 h-[62px] flex items-center gap-2 border-b border-white/[0.06]">
            <DarslinkerLogo size={24} />
            <span className="text-[17px] font-[family-name:var(--font-plus-jakarta)] font-extrabold tracking-tight text-white">
              Dars<span className="text-[#7ea2d4]">Linker</span>
            </span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all ${item.active ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"}`}>
                  <Icon className="w-[18px] h-[18px]" />
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="px-3 pb-4">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-white/30 hover:text-white/50 hover:bg-white/[0.04]">
              <LogOut className="w-[18px] h-[18px]" />
              Saytga qaytish
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-screen">
        <div className="sticky top-0 z-50 bg-[#16181a]/80 backdrop-blur-md border-b border-white/[0.06] py-3">
          <div className="px-5 md:px-8 flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {variants.map((v, i) => (
              <button key={i} onClick={() => setActive(i)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium transition-all ${active === i ? "bg-white text-[#16181a]" : "bg-white/[0.06] text-white/40 hover:text-white/70"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 md:px-8 py-6 md:py-8">
        <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-6">Arizalar</h1>

        <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
          {COLS.map((col) => {
            const colLeads = LEADS.filter(l => l.status === col.key);
            return (
              <div key={col.key} className="rounded-[14px] border border-white/[0.06] p-3 min-h-[400px] w-[280px] md:w-auto md:flex-1 shrink-0" style={{ backgroundColor: `${col.color}10` }}>
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3 px-1 relative">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                  <span className="text-[13px] font-semibold text-white">{col.title}</span>
                  <span className="text-[11px] text-white/20 ml-auto">{colLeads.length}</span>
                  <div className="relative">
                    <button onClick={() => setColMenu(colMenu === col.key ? null : col.key)} className="w-6 h-6 rounded-[6px] flex items-center justify-center text-white/15 hover:text-white/40 hover:bg-white/[0.06] transition-all">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                    {colMenu === col.key && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setColMenu(null)} />
                        <div className="absolute right-0 top-7 z-50 w-[180px] rounded-[10px] bg-[#1e2024] border border-white/[0.08] shadow-xl py-1">
                          <button onClick={() => { setAddLead(col.key); setColMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-all">
                            <Plus className="w-3.5 h-3.5" /> Lead qo&apos;shish
                          </button>
                          <button onClick={() => setColMenu(null)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-all">
                            <MessageSquare className="w-3.5 h-3.5" /> Eksport
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {colLeads.map((lead) => {
                    // 1 — Compact
                    if (active === 0) return (
                      <div key={lead.id} className="rounded-[10px] bg-white/[0.05] border border-white/[0.06] p-3 group hover:bg-white/[0.08] transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[13px] font-semibold text-white">{lead.name}</p>
                          <GripVertical className="w-3.5 h-3.5 text-white/10 shrink-0" />
                        </div>
                        <p className="text-[11px] text-white/40 mb-2">{lead.course}</p>
                        <div className="flex items-center justify-between text-[10px] text-white/25">
                          <span>{lead.phone.slice(-9)}</span>
                          <span>{lead.time}</span>
                        </div>
                        {lead.note && <p className="text-[10px] text-white/30 italic mt-1.5 pt-1.5 border-t border-white/[0.06]">{lead.note}</p>}
                      </div>
                    );

                    // 2 — Avatar + full info
                    if (active === 1) return (
                      <div key={lead.id} className="rounded-[12px] bg-white/[0.05] border border-white/[0.06] p-3 group hover:bg-white/[0.08] transition-all cursor-pointer">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(lead.name) }}>
                            {initials(lead.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate">{lead.name}</p>
                            <p className="text-[11px] text-white/40 truncate">{lead.course}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2.5 text-[11px] text-white/30">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone.slice(-9)}</span>
                          <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{lead.time}</span>
                        </div>
                        {lead.note && <p className="text-[11px] text-white/30 italic mt-2 pt-2 border-t border-white/[0.06]">&ldquo;{lead.note}&rdquo;</p>}
                        {col.key === "yangi" && (
                          <div className="flex gap-1.5 mt-2.5">
                            <button className="flex-1 h-[26px] rounded-[6px] bg-green-500/15 text-green-400 text-[11px] font-medium hover:bg-green-500/25 flex items-center justify-center gap-1"><Check className="w-3 h-3" />Jarayonda</button>
                            <button className="flex-1 h-[26px] rounded-[6px] bg-red-500/15 text-red-400 text-[11px] font-medium hover:bg-red-500/25 flex items-center justify-center gap-1"><XCircle className="w-3 h-3" />Sifatsiz</button>
                          </div>
                        )}
                      </div>
                    );

                    // 3 — Minimal
                    if (active === 2) return (
                      <div key={lead.id} className="rounded-[10px] bg-white/[0.04] px-3 py-2.5 group hover:bg-white/[0.08] transition-all cursor-pointer">
                        <p className="text-[13px] font-medium text-white">{lead.name}</p>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-[11px] text-white/30 truncate">{lead.course}</p>
                          <span className="text-[10px] text-white/20 shrink-0 ml-2">{lead.time}</span>
                        </div>
                      </div>
                    );

                    // 4 — Big cards + avatar
                    if (active === 3) {
                      const otherCols = COLS.filter(c => c.key !== lead.status);
                      return (
                        <div key={lead.id} onClick={() => setOpenLead(lead)} className="rounded-[14px] bg-white/[0.06] border border-white/[0.08] p-4 group hover:bg-white/[0.1] transition-all cursor-pointer shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[13px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(lead.name) }}>
                              {initials(lead.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-semibold text-white truncate">{lead.name}</p>
                              <p className="text-[11px] text-white/40">{lead.time}</p>
                            </div>
                            <div className="relative">
                              <button
                                onClick={(e) => { e.stopPropagation(); setMoveMenu(moveMenu === lead.id ? null : lead.id); }}
                                className="w-7 h-7 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/70 transition-all"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              {moveMenu === lead.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMoveMenu(null); }} />
                                  <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-8 z-50 w-[180px] rounded-[10px] bg-[#1e2024] border border-white/[0.08] shadow-xl py-1">
                                    <p className="px-3 py-1.5 text-[10px] text-white/25 uppercase tracking-wider">Ko&apos;chirish</p>
                                    {otherCols.map((c) => (
                                      <button key={c.key} onClick={() => setMoveMenu(null)} className="w-full text-left px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.06] flex items-center gap-2 transition-all">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                                        {c.title}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="rounded-[8px] bg-white/[0.04] px-3 py-2 mb-2">
                            <p className="text-[11px] text-white/30 mb-0.5">Kurs</p>
                            <p className="text-[12px] font-medium text-white">{lead.course}</p>
                          </div>
                          <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[12px] text-white/60 hover:text-white"><Phone className="w-3.5 h-3.5" />{lead.phone}</a>
                          {lead.note && <p className="text-[11px] text-white/35 italic mt-2 pt-2 border-t border-white/[0.08]">&ldquo;{lead.note}&rdquo;</p>}
                        </div>
                      );
                    }

                    // 5 — Timeline
                    return (
                      <div key={lead.id} className="flex gap-2.5 group cursor-pointer">
                        <div className="flex flex-col items-center shrink-0 pt-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                          <div className="w-px flex-1 bg-white/[0.06] mt-1" />
                        </div>
                        <div className="flex-1 rounded-[10px] bg-white/[0.04] border border-white/[0.06] p-3 group-hover:bg-white/[0.08] transition-all mb-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[13px] font-semibold text-white">{lead.name}</p>
                            <span className="text-[10px] text-white/25">{lead.time}</span>
                          </div>
                          <p className="text-[11px] text-white/40">{lead.course}</p>
                          {lead.note && <p className="text-[10px] text-white/30 italic mt-1.5">&ldquo;{lead.note}&rdquo;</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Lead qo'shish modal */}
      {addLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddLead(null)} />
          <div className="relative bg-[#16181a] rounded-[20px] border border-white/[0.08] w-full max-w-[460px] overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-white">Yangi lead qo&apos;shish</h2>
                <div className="flex items-center gap-1.5 mt-1 text-[12px] text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLS.find(c => c.key === addLead)?.color }} />
                  {COLS.find(c => c.key === addLead)?.title}
                </div>
              </div>
              <button onClick={() => setAddLead(null)} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] text-white/40 mb-1.5 block">Ism familiya *</label>
                <input placeholder="Ism familiya" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-[12px] text-white/40 mb-1.5 block">Telefon *</label>
                <input placeholder="+998 90 123 45 67" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-[12px] text-white/40 mb-1.5 block">Kurs</label>
                <select className="w-full h-[44px] px-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white/70 focus:outline-none focus:border-white/30 appearance-none">
                  <option>Tanlang</option>
                  <option>JavaScript &amp; React</option>
                  <option>UI/UX dizayn Figma</option>
                  <option>IELTS 7.0+</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] text-white/40 mb-1.5 block">Izoh</label>
                <textarea placeholder="Qo'shimcha ma'lumot..." rows={3} className="w-full px-4 py-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setAddLead(null)} className="flex-1 h-[44px] rounded-[10px] bg-white/[0.06] text-white/60 text-[14px] font-medium hover:bg-white/[0.1]">
                  Bekor
                </button>
                <button onClick={() => setAddLead(null)} className="flex-1 h-[44px] rounded-[10px] bg-white text-[#16181a] text-[14px] font-medium hover:bg-white/90 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Qo&apos;shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead detail modal */}
      {openLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenLead(null)} />
          <div className="relative bg-[#16181a] rounded-[20px] border border-white/[0.08] w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#16181a] border-b border-white/[0.06] px-6 pt-6 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-[16px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(openLead.name) }}>
                  {initials(openLead.name)}
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-white">{openLead.name}</h2>
                  <div className="flex items-center gap-1.5 text-[12px] text-white/40 mt-0.5">
                    <Clock className="w-3 h-3" /> {openLead.time}
                  </div>
                </div>
              </div>
              <button onClick={() => setOpenLead(null)} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Kontakt */}
              <div>
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2.5">Kontakt</p>
                <div className="space-y-2">
                  <a href={`tel:${openLead.phone}`} className="flex items-center gap-3 rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.08] transition-all group">
                    <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-white/30">Telefon</p>
                      <p className="text-[14px] font-medium text-white">{openLead.phone}</p>
                    </div>
                    <Copy className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                  </a>
                  <a href="#" className="flex items-center gap-3 rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.08] transition-all">
                    <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <Send className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-white/30">Telegram</p>
                      <p className="text-[14px] font-medium text-white">@user{openLead.id}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Kurs */}
              <div>
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2.5">Qiziqgan kurs</p>
                <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white/60" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-white">{openLead.course}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">IT & Dasturlash</p>
                  </div>
                </div>
              </div>

              {/* Izoh */}
              {openLead.note && (
                <div>
                  <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2.5">Izoh</p>
                  <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-4">
                    <p className="text-[13px] text-white/70 italic">&ldquo;{openLead.note}&rdquo;</p>
                  </div>
                </div>
              )}

              {/* Tarix */}
              <div>
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2.5">Jarayon tarixi</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[13px] text-white">Yangi ariza qabul qilindi</p>
                      <p className="text-[11px] text-white/30">{openLead.time}</p>
                    </div>
                  </div>
                  {openLead.status !== "yangi" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[13px] text-white">Jarayonga olindi</p>
                        <p className="text-[11px] text-white/30">1 soat oldin</p>
                      </div>
                    </div>
                  )}
                  {openLead.status === "sotib_oldi" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[13px] text-white">Kurs sotib olindi</p>
                        <p className="text-[11px] text-white/30">30 daqiqa oldin</p>
                      </div>
                    </div>
                  )}
                  {openLead.status === "sifatsiz" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[13px] text-white">Sifatsiz deb belgilandi</p>
                        <p className="text-[11px] text-white/30">{openLead.note}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {openLead.status === "yangi" && (
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 h-[44px] rounded-[10px] bg-green-500/15 text-green-400 text-[13px] font-medium hover:bg-green-500/25 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Jarayonga olish
                  </button>
                  <button className="flex-1 h-[44px] rounded-[10px] bg-red-500/15 text-red-400 text-[13px] font-medium hover:bg-red-500/25 flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" /> Sifatsiz
                  </button>
                </div>
              )}
              {openLead.status === "jarayonda" && (
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 h-[44px] rounded-[10px] bg-green-500/15 text-green-400 text-[13px] font-medium hover:bg-green-500/25 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Sotib oldi
                  </button>
                  <button className="flex-1 h-[44px] rounded-[10px] bg-red-500/15 text-red-400 text-[13px] font-medium hover:bg-red-500/25 flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" /> Sifatsiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
