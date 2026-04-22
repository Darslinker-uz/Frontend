"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Phone, MessageSquare, Handshake, Check, X, Send, Building2, GraduationCap, User as UserIcon, ChevronDown, ChevronRight, MapPin, Calendar } from "lucide-react";
import { useAdminTheme } from "@/context/admin-theme-context";

type Tab = "students" | "yordam" | "hamkorlik";

// ==================== TYPES ====================

type StudentStatus = "new_lead" | "contacted" | "converted" | "disputed";

interface StudentLead {
  id: number;
  name: string;
  phone: string;
  course: string;
  status: StudentStatus;
  time: string; // ISO date
}

interface CenterGroup {
  id: number;
  name: string;
  city: string;
  category: string;
  totalLeads: number;
  boughtThisWeek: number;
  leads: StudentLead[];
}

type HelpStatus = "new_req" | "answered" | "closed";

interface HelpLead {
  id: number;
  name: string;
  phone: string;
  interest: string;
  message?: string;
  status: HelpStatus;
  createdAt: string;
}

type PartnerStatus = "new_app" | "in_progress" | "accepted" | "rejected";

interface PartnerLead {
  id: number;
  name: string;
  phone: string;
  telegram?: string;
  centerName: string;
  category: string;
  city: string;
  studentsCount: string;
  message?: string;
  status: PartnerStatus;
  createdAt: string;
}

// ==================== UTILS ====================

const initials = (n: string) => n.split(" ").map(x => x[0]).slice(0, 2).join("").toUpperCase();
const avatarColor = (n: string) => {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444", "#f97316"];
  return colors[n.charCodeAt(0) % colors.length];
};

const timeAgo = (iso: string) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Hozir";
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 172800) return "Kecha";
  return `${Math.floor(diff / 86400)} kun oldin`;
};

const TAB_META: Record<Tab, { label: string; subtitle: string; icon: typeof MessageSquare; color: string }> = {
  students: { label: "O'quvchilar", subtitle: "Markazlar bo'yicha", icon: GraduationCap, color: "#3b82f6" },
  yordam: { label: "Yordam so'rovlari", subtitle: "Bosh sahifa formasi", icon: MessageSquare, color: "#f59e0b" },
  hamkorlik: { label: "Hamkorlik", subtitle: "Yangi markaz arizalari", icon: Handshake, color: "#22c55e" },
};

const STUDENT_STATUS_MAP: Record<StudentStatus, { label: string; color: string }> = {
  new_lead: { label: "Yangi", color: "#3b82f6" },
  contacted: { label: "Jarayonda", color: "#f59e0b" },
  converted: { label: "Sotib oldi", color: "#22c55e" },
  disputed: { label: "Sifatsiz", color: "#ef4444" },
};

const HELP_STATUS_MAP: Record<HelpStatus, { label: string; color: string }> = {
  new_req: { label: "Javob kutmoqda", color: "#f59e0b" },
  answered: { label: "Javob berilgan", color: "#22c55e" },
  closed: { label: "Yopilgan", color: "#64748b" },
};

const PARTNER_STATUS_MAP: Record<PartnerStatus, { label: string; color: string }> = {
  new_app: { label: "Ko'rib chiqilmagan", color: "#3b82f6" },
  in_progress: { label: "Jarayonda", color: "#f59e0b" },
  accepted: { label: "Qabul qilingan", color: "#22c55e" },
  rejected: { label: "Rad etilgan", color: "#ef4444" },
};

function AdminLeadsContent() {
  const { config } = useAdminTheme();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  const initial: Tab = (rawTab === "yordam" || rawTab === "hamkorlik" || rawTab === "students") ? rawTab : "students";
  const [tab, setTab] = useState<Tab>(initial);

  const [centers, setCenters] = useState<CenterGroup[]>([]);
  const [helpLeads, setHelpLeads] = useState<HelpLead[]>([]);
  const [partnerLeads, setPartnerLeads] = useState<PartnerLead[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingHelp, setLoadingHelp] = useState(true);
  const [loadingPartner, setLoadingPartner] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, hRes, pRes] = await Promise.all([
          fetch("/api/admin/leads/students"),
          fetch("/api/admin/leads/help"),
          fetch("/api/admin/leads/partner"),
        ]);
        const [sData, hData, pData] = await Promise.all([sRes.json(), hRes.json(), pRes.json()]);
        setCenters(sData.centers ?? []);
        setHelpLeads(hData.leads ?? []);
        setPartnerLeads(pData.apps ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStudents(false);
        setLoadingHelp(false);
        setLoadingPartner(false);
      }
    };
    load();
  }, []);

  const isLight = config.id === "light";

  const counts: Record<Tab, number> = {
    students: centers.reduce((s, c) => s + c.leads.length, 0),
    yordam: helpLeads.filter(l => l.status === "new_req").length,
    hamkorlik: partnerLeads.filter(l => l.status === "new_app").length,
  };

  return (
    <div className="px-5 md:px-8 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Leadlar</h1>
        <p className="text-[13px] mt-1" style={{ color: config.textMuted }}>O'quvchilar, yordam so'rovlari va hamkorlik arizalari</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
        {/* Sidebar nav */}
        <div className="rounded-[14px] overflow-hidden h-fit" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          {(["students", "yordam", "hamkorlik"] as Tab[]).map((k, i, arr) => {
            const m = TAB_META[k];
            const Icon = m.icon;
            const isActive = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
                style={{
                  backgroundColor: isActive ? `${m.color}1a` : "transparent",
                  borderBottom: i < arr.length - 1 ? `1px solid ${config.surfaceBorder}` : "none",
                  borderLeft: isActive ? `3px solid ${m.color}` : "3px solid transparent",
                }}
              >
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: isActive ? `${m.color}26` : config.hover }}>
                  <Icon className="w-4 h-4" style={{ color: isActive ? m.color : config.textMuted }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: isActive ? config.text : config.text }}>{m.label}</p>
                  <p className="text-[11px] truncate" style={{ color: config.textMuted }}>{m.subtitle}</p>
                </div>
                <span
                  className="h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isActive ? `${m.color}33` : config.hover, color: isActive ? m.color : config.textMuted }}
                >
                  {counts[k]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div>
          {tab === "students" && <StudentsTab config={config} isLight={isLight} centers={centers} loading={loadingStudents} />}
          {tab === "yordam" && <HelpTab config={config} isLight={isLight} helpLeads={helpLeads} setHelpLeads={setHelpLeads} loading={loadingHelp} />}
          {tab === "hamkorlik" && <PartnerTab config={config} isLight={isLight} partnerLeads={partnerLeads} setPartnerLeads={setPartnerLeads} loading={loadingPartner} />}
        </div>
      </div>
    </div>
  );
}

// ==================== STUDENTS TAB ====================

function StudentsTab({ config, isLight, centers, loading }: { config: ReturnType<typeof useAdminTheme>["config"]; isLight: boolean; centers: CenterGroup[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [openCenter, setOpenCenter] = useState<number | null>(null);
  const [openLead, setOpenLead] = useState<{ lead: StudentLead; center: CenterGroup } | null>(null);

  useEffect(() => {
    if (openCenter === null && centers.length > 0) {
      setOpenCenter(centers[0].id);
    }
  }, [centers, openCenter]);

  const q = search.toLowerCase();
  const filtered = centers.map(c => {
    const matchCenter = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    const matchLeads = c.leads.filter(l => !q || l.name.toLowerCase().includes(q) || l.phone.includes(search) || l.course.toLowerCase().includes(q));
    return { ...c, _match: matchCenter || matchLeads.length > 0, _leads: matchCenter ? c.leads : matchLeads };
  }).filter(c => c._match);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" style={{ color: "#3b82f6" }} />
          <h2 className="text-[18px] font-bold" style={{ color: config.text }}>O&apos;quvchilar</h2>
          <span className="text-[12px]" style={{ color: config.textMuted }}>· {centers.length} ta markaz, {centers.reduce((s, c) => s + c.leads.length, 0)} ta lead</span>
        </div>
        <div className="relative w-full md:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Markaz, o'quvchi, kurs..."
            className="w-full h-[40px] pl-10 pr-4 rounded-[10px] text-[13px] focus:outline-none"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <GraduationCap className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
          <p className="text-[14px]" style={{ color: config.textMuted }}>Topilmadi</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(center => {
            const isOpen = openCenter === center.id;
            const leads = center._leads;
            return (
              <div key={center.id} className="rounded-[14px] overflow-hidden" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                <button
                  onClick={() => setOpenCenter(isOpen ? null : center.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
                  style={{ backgroundColor: isOpen ? config.hover : "transparent" }}
                >
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.accent}22` }}>
                    <Building2 className="w-4.5 h-4.5" style={{ color: config.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-semibold truncate" style={{ color: config.text }}>{center.name}</p>
                      <span className="text-[11px] px-1.5 h-[18px] rounded flex items-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>{center.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] mt-0.5" style={{ color: config.textMuted }}>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{center.city}</span>
                      <span>·</span>
                      <span>{center.totalLeads} ta jami</span>
                      <span>·</span>
                      <span style={{ color: "#22c55e" }}>+{center.boughtThisWeek} shu hafta</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 hidden md:block">
                    <p className="text-[18px] font-bold" style={{ color: config.text }}>{leads.length}</p>
                    <p className="text-[10px]" style={{ color: config.textDim }}>lead</p>
                  </div>
                  {isOpen
                    ? <ChevronDown className="w-4 h-4 shrink-0" style={{ color: config.textMuted }} />
                    : <ChevronRight className="w-4 h-4 shrink-0" style={{ color: config.textMuted }} />}
                </button>

                {isOpen && leads.length > 0 && (
                  <div style={{ borderTop: `1px solid ${config.surfaceBorder}` }}>
                    {leads.map((lead, idx) => {
                      const s = STUDENT_STATUS_MAP[lead.status];
                      return (
                        <button
                          key={lead.id}
                          onClick={() => setOpenLead({ lead, center })}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                          style={{ borderTop: idx > 0 ? `1px solid ${config.surfaceBorder}` : "none" }}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(lead.name) }}>
                            {initials(lead.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold truncate" style={{ color: config.text }}>{lead.name}</p>
                            <p className="text-[11px] truncate" style={{ color: config.textMuted }}>{lead.phone} · {lead.course}</p>
                          </div>
                          <span className="text-[10px] px-2 h-[18px] rounded-full font-semibold shrink-0" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.label}</span>
                          <span className="text-[11px] shrink-0 hidden md:inline" style={{ color: config.textDim }}>{timeAgo(lead.time)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {openLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenLead(null)} />
          <div className="relative rounded-[20px] w-full max-w-[480px] overflow-hidden" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="px-6 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[14px] font-bold text-white" style={{ backgroundColor: avatarColor(openLead.lead.name) }}>
                  {initials(openLead.lead.name)}
                </div>
                <div>
                  <h2 className="text-[17px] font-bold" style={{ color: config.text }}>{openLead.lead.name}</h2>
                  <p className="text-[12px] flex items-center gap-1" style={{ color: config.textMuted }}>
                    <Calendar className="w-3 h-3" />{timeAgo(openLead.lead.time)}
                  </p>
                </div>
              </div>
              <button onClick={() => setOpenLead(null)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <a href={`tel:${openLead.lead.phone}`} className="flex items-center gap-2 rounded-[12px] p-3" style={{ backgroundColor: config.hover, color: config.text }}>
                <Phone className="w-4 h-4" style={{ color: config.textMuted }} />
                <span className="text-[14px]">{openLead.lead.phone}</span>
              </a>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Qaysi markazga qoldirgan</p>
                <div className="rounded-[12px] p-3 flex items-center gap-3" style={{ backgroundColor: config.hover }}>
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: `${config.accent}22` }}>
                    <Building2 className="w-4 h-4" style={{ color: config.accent }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: config.text }}>{openLead.center.name}</p>
                    <p className="text-[11px]" style={{ color: config.textMuted }}>{openLead.center.city} · {openLead.center.category}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Qiziqgan kurs</p>
                <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                  <p className="text-[14px] font-semibold" style={{ color: config.text }}>{openLead.lead.course}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== HELP TAB ====================

function HelpTab({ config, isLight, helpLeads, setHelpLeads, loading }: { config: ReturnType<typeof useAdminTheme>["config"]; isLight: boolean; helpLeads: HelpLead[]; setHelpLeads: React.Dispatch<React.SetStateAction<HelpLead[]>>; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<HelpLead | null>(null);

  const q = search.toLowerCase();
  const filtered = helpLeads.filter(l =>
    !q || l.name.toLowerCase().includes(q) || l.phone.includes(search) || l.interest.toLowerCase().includes(q)
  );

  const handleStatus = async (lead: HelpLead, status: "answered" | "closed") => {
    const prev = helpLeads;
    setHelpLeads(list => list.map(l => l.id === lead.id ? { ...l, status } : l));
    setOpen({ ...lead, status });
    try {
      const r = await fetch(`/api/admin/leads/help/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Failed");
    } catch (e) {
      console.error(e);
      setHelpLeads(prev);
      setOpen(lead);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" style={{ color: "#f59e0b" }} />
          <h2 className="text-[18px] font-bold" style={{ color: config.text }}>Yordam so&apos;rovlari</h2>
          <span className="text-[12px]" style={{ color: config.textMuted }}>· {helpLeads.length} ta</span>
        </div>
        <div className="relative w-full md:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ism, telefon, yo'nalish..."
            className="w-full h-[40px] pl-10 pr-4 rounded-[10px] text-[13px] focus:outline-none"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(l => {
            const s = HELP_STATUS_MAP[l.status];
            return (
              <button
                key={l.id}
                onClick={() => setOpen(l)}
                className="w-full rounded-[14px] p-4 text-left"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(l.name) }}>
                    {initials(l.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[14px] font-semibold" style={{ color: config.text }}>{l.name}</p>
                      <span className="h-[18px] px-2 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] mb-1" style={{ color: config.textMuted }}>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{l.phone}</span>
                      <span>·</span>
                      <span className="font-medium" style={{ color: config.text }}>{l.interest}</span>
                    </div>
                    {l.message && <p className="text-[12px] line-clamp-1" style={{ color: config.textDim }}>&ldquo;{l.message}&rdquo;</p>}
                  </div>
                  <span className="text-[11px] shrink-0" style={{ color: config.textDim }}>{timeAgo(l.createdAt)}</span>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
              <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
              <p className="text-[14px]" style={{ color: config.textMuted }}>Topilmadi</p>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(null)} />
          <div className="relative rounded-[20px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="px-6 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[14px] font-bold text-white" style={{ backgroundColor: avatarColor(open.name) }}>
                  {initials(open.name)}
                </div>
                <div>
                  <h2 className="text-[17px] font-bold" style={{ color: config.text }}>{open.name}</h2>
                  <p className="text-[12px]" style={{ color: config.textMuted }}>{timeAgo(open.createdAt)}</p>
                </div>
              </div>
              <button onClick={() => setOpen(null)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <a href={`tel:${open.phone}`} className="flex items-center gap-2 rounded-[12px] p-3" style={{ backgroundColor: config.hover, color: config.text }}>
                <Phone className="w-4 h-4" style={{ color: config.textMuted }} />
                <span className="text-[14px]">{open.phone}</span>
              </a>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Qiziqgan yo&apos;nalish</p>
                <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                  <p className="text-[14px] font-semibold" style={{ color: config.text }}>{open.interest}</p>
                </div>
              </div>
              {open.message && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Xabar</p>
                  <div className="rounded-[12px] p-3" style={{ backgroundColor: config.hover }}>
                    <p className="text-[13px]" style={{ color: config.text }}>{open.message}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {open.status !== "answered" && open.status !== "closed" && (
                  <button
                    onClick={() => handleStatus(open, "answered")}
                    className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                    style={{ backgroundColor: config.accent, color: config.accentText }}
                  >
                    <Send className="w-4 h-4" /> Javob berdim
                  </button>
                )}
                {open.status !== "closed" && (
                  <button
                    onClick={() => handleStatus(open, "closed")}
                    className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#ef444422", color: "#ef4444" }}
                  >
                    <X className="w-4 h-4" /> Yopish
                  </button>
                )}
                <button onClick={() => setOpen(null)} className="h-[44px] px-4 rounded-[10px] text-[13px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                  Bekor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== PARTNER TAB ====================

function PartnerTab({ config, isLight, partnerLeads, setPartnerLeads, loading }: { config: ReturnType<typeof useAdminTheme>["config"]; isLight: boolean; partnerLeads: PartnerLead[]; setPartnerLeads: React.Dispatch<React.SetStateAction<PartnerLead[]>>; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<PartnerLead | null>(null);

  const q = search.toLowerCase();
  const filtered = partnerLeads.filter(l =>
    !q || l.name.toLowerCase().includes(q) || l.phone.includes(search) || l.centerName.toLowerCase().includes(q) || l.category.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)
  );

  const updateStatus = async (lead: PartnerLead, status: PartnerStatus) => {
    const prev = partnerLeads;
    // Optimistic
    setPartnerLeads(list => list.map(l => l.id === lead.id ? { ...l, status } : l));
    setOpen(null);
    try {
      const r = await fetch(`/api/admin/leads/partner/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error("Failed");
    } catch (e) {
      console.error(e);
      setPartnerLeads(prev); // rollback
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Handshake className="w-5 h-5" style={{ color: "#22c55e" }} />
          <h2 className="text-[18px] font-bold" style={{ color: config.text }}>Hamkorlik arizalari</h2>
          <span className="text-[12px]" style={{ color: config.textMuted }}>· {partnerLeads.length} ta</span>
        </div>
        <div className="relative w-full md:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: config.textDim }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Markaz nomi, shahar..."
            className="w-full h-[40px] pl-10 pr-4 rounded-[10px] text-[13px] focus:outline-none"
            style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
          <p className="text-[14px]" style={{ color: config.textMuted }}>Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(l => {
            const s = PARTNER_STATUS_MAP[l.status];
            return (
              <button
                key={l.id}
                onClick={() => setOpen(l)}
                className="w-full rounded-[14px] p-4 text-left"
                style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.accent}22` }}>
                    <Building2 className="w-5 h-5" style={{ color: config.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[14px] font-semibold" style={{ color: config.text }}>{l.centerName}</p>
                      <span className="h-[18px] px-2 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${s.color}22`, color: s.color }}>{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] flex-wrap mb-1" style={{ color: config.textMuted }}>
                      <span>{l.category}</span>
                      <span>·</span>
                      <span>{l.city}</span>
                      <span>·</span>
                      <span>{l.studentsCount} o&apos;quvchi</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: config.textDim }}>
                      <UserIcon className="w-3 h-3" />
                      <span>{l.name}</span>
                      <span>·</span>
                      <span>{l.phone}</span>
                    </div>
                  </div>
                  <span className="text-[11px] shrink-0" style={{ color: config.textDim }}>{timeAgo(l.createdAt)}</span>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-[14px] p-12 text-center" style={{ backgroundColor: config.surface, border: `1px dashed ${config.surfaceBorder}` }}>
              <Handshake className="w-10 h-10 mx-auto mb-3" style={{ color: config.textDim }} />
              <p className="text-[14px]" style={{ color: config.textMuted }}>Topilmadi</p>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(null)} />
          <div className="relative rounded-[20px] w-full max-w-[540px] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: isLight ? "#ffffff" : config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="px-6 pt-5 pb-4 flex items-start justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: `${config.accent}22` }}>
                  <Building2 className="w-6 h-6" style={{ color: config.accent }} />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold" style={{ color: config.text }}>{open.centerName}</h2>
                  <p className="text-[12px]" style={{ color: config.textMuted }}>{open.category} · {open.city}</p>
                </div>
              </div>
              <button onClick={() => setOpen(null)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Mas&apos;ul shaxs</p>
                <div className="rounded-[12px] p-4 flex items-center gap-3" style={{ backgroundColor: config.hover }}>
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[12px] font-bold text-white" style={{ backgroundColor: avatarColor(open.name) }}>
                    {initials(open.name)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: config.text }}>{open.name}</p>
                    <p className="text-[12px]" style={{ color: config.textMuted }}>{open.phone}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${open.phone}`} className="rounded-[12px] p-3 flex items-center gap-2" style={{ backgroundColor: config.hover, color: config.text }}>
                  <Phone className="w-4 h-4" style={{ color: config.textMuted }} />
                  <span className="text-[13px]">Qo&apos;ng&apos;iroq</span>
                </a>
                {open.telegram && (
                  <a href={`https://t.me/${open.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="rounded-[12px] p-3 flex items-center gap-2" style={{ backgroundColor: config.hover, color: config.text }}>
                    <Send className="w-4 h-4" style={{ color: config.textMuted }} />
                    <span className="text-[13px]">{open.telegram}</span>
                  </a>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Markaz haqida</p>
                <div className="rounded-[12px] p-4 space-y-2" style={{ backgroundColor: config.hover }}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span style={{ color: config.textMuted }}>Yo&apos;nalish</span>
                    <span className="font-semibold" style={{ color: config.text }}>{open.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span style={{ color: config.textMuted }}>Shahar</span>
                    <span className="font-semibold" style={{ color: config.text }}>{open.city}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span style={{ color: config.textMuted }}>O&apos;quvchilar</span>
                    <span className="font-semibold" style={{ color: config.text }}>{open.studentsCount}</span>
                  </div>
                </div>
              </div>

              {open.message && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: config.textDim }}>Xabar</p>
                  <div className="rounded-[12px] p-4" style={{ backgroundColor: config.hover }}>
                    <p className="text-[13px]" style={{ color: config.text }}>{open.message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                {open.status === "new_app" && (
                  <button
                    onClick={() => updateStatus(open, "in_progress")}
                    className="w-full h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#f59e0b22", color: "#f59e0b" }}
                  >
                    Jarayonga olish
                  </button>
                )}
                <div className="flex gap-2">
                  {open.status !== "accepted" && (
                    <button
                      onClick={() => updateStatus(open, "accepted")}
                      className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#22c55e", color: "#ffffff" }}
                    >
                      <Check className="w-4 h-4" /> Qabul qilish
                    </button>
                  )}
                  {open.status !== "rejected" && (
                    <button
                      onClick={() => updateStatus(open, "rejected")}
                      className="flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: "#ef4444", color: "#ffffff" }}
                    >
                      <X className="w-4 h-4" /> Rad etish
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense>
      <AdminLeadsContent />
    </Suspense>
  );
}
