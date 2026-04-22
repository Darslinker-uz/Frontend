"use client";

import { useState } from "react";
import { MessageSquare, Phone, Clock, Plus, X, Check, XCircle, Pencil, MoreHorizontal, Trash2, BookOpen, Copy, Send } from "lucide-react";
import { useLeads } from "@/context/leads-context";
import { useDashboardTheme } from "@/context/dashboard-theme-context";
import type { Lead } from "@/data/leads";
import type { ThemeConfig } from "@/context/admin-theme-context";

interface Column { key: string; title: string; color: string; locked: boolean; }

const COLORS = [
  { hex: "#3b82f6", name: "Ko'k" },
  { hex: "#f59e0b", name: "Sariq" },
  { hex: "#22c55e", name: "Yashil" },
  { hex: "#ef4444", name: "Qizil" },
  { hex: "#a855f7", name: "Binafsha" },
  { hex: "#ec4899", name: "Pushti" },
  { hex: "#06b6d4", name: "Moviy" },
  { hex: "#f97316", name: "To'q sariq" },
];

const defaultColumns: Column[] = [
  { key: "yangi", title: "Yangi ariza", color: "#3b82f6", locked: true },
  { key: "qayta_aloqa", title: "Qayta aloqa", color: "#8b5cf6", locked: true },
  { key: "jarayonda", title: "Jarayonda", color: "#f59e0b", locked: false },
  { key: "sotib_oldi", title: "Sotib oldi", color: "#22c55e", locked: true },
  { key: "sotib_olmadi", title: "Sotib olmadi", color: "#ec4899", locked: true },
  { key: "sifatsiz", title: "Sifatsiz", color: "#ef4444", locked: true },
];

const CLOSED_KEYS = ["sotib_oldi", "sotib_olmadi", "sifatsiz"];

const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
const avatarColor = (name: string) => {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444", "#f97316"];
  return colors[name.charCodeAt(0) % colors.length];
};

function LeadCard({ lead, onOpen, columns, onMove, onDragStart, onDragEnd, isDragging, config }: {
  lead: Lead;
  onOpen: () => void;
  columns: Column[];
  onMove: (id: number, status: string) => void;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  config: ThemeConfig;
}) {
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const otherCols = columns.filter(c => c.key !== lead.status);

  return (
    <div
      onClick={onOpen}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(lead.id));
        onDragStart(lead.id);
      }}
      onDragEnd={onDragEnd}
      className={`rounded-[14px] p-4 transition-all cursor-grab active:cursor-grabbing shadow-sm ${isDragging ? "opacity-40 scale-95" : ""}`}
      style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[13px] font-bold shrink-0" style={{ backgroundColor: avatarColor(lead.name), color: config.text }}>
          {initials(lead.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold truncate" style={{ color: config.text }}>{lead.name}</p>
          <p className="text-[11px]" style={{ color: config.textMuted }}>{lead.time}</p>
        </div>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMoveMenuOpen(!moveMenuOpen); }}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-all"
            style={{ color: config.textDim }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {moveMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMoveMenuOpen(false); }} />
              <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-8 z-50 w-[180px] rounded-[10px] shadow-xl py-1" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider" style={{ color: config.textDim }}>Ko&apos;chirish</p>
                {otherCols.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => { onMove(lead.id, c.key); setMoveMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-[13px] flex items-center gap-2 transition-all"
                    style={{ color: config.textMuted }}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    {c.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="rounded-[8px] px-3 py-2 mb-2" style={{ backgroundColor: config.surface }}>
        <p className="text-[11px] mb-0.5" style={{ color: config.textDim }}>Kurs</p>
        <p className="text-[12px] font-medium" style={{ color: config.text }}>{lead.course}</p>
      </div>
      <div className="space-y-1.5">
        <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[12px]" style={{ color: config.textMuted }}>
          <Phone className="w-3.5 h-3.5" />{lead.phone}
        </a>
        {lead.telegram && (
          <a href={`https://t.me/${lead.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[12px]" style={{ color: config.textMuted }}>
            <Send className="w-3.5 h-3.5" />{lead.telegram}
          </a>
        )}
      </div>
      {lead.note && <p className="text-[11px] italic mt-2 pt-2" style={{ color: config.textMuted, borderTop: `1px solid ${config.surfaceBorder}` }}>&ldquo;{lead.note}&rdquo;</p>}
    </div>
  );
}

export default function LeadsPage() {
  const { leads, moveLead } = useLeads();
  const { config } = useDashboardTheme();
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [newColName, setNewColName] = useState("");
  const [newColColor, setNewColColor] = useState(COLORS[4].hex);
  const [showAddCol, setShowAddCol] = useState(false);
  const [colMenu, setColMenu] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingCol, setEditingCol] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [addLead, setAddLead] = useState<string | null>(null);
  const [rejectInput, setRejectInput] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{ leadId: number; toStatus: string } | null>(null);
  const [pendingNote, setPendingNote] = useState("");
  const [view, setView] = useState<"asosiy" | "yopilgan">("asosiy");

  const visibleColumns = view === "asosiy"
    ? columns.filter(c => !CLOSED_KEYS.includes(c.key))
    : columns.filter(c => CLOSED_KEYS.includes(c.key));

  const closedCount = leads.filter(l => CLOSED_KEYS.includes(l.status)).length;
  const mainCount = leads.length - closedCount;

  const addColumn = () => {
    if (!newColName.trim()) return;
    const key = newColName.toLowerCase().replace(/\s/g, "_") + "_" + Date.now();
    const sotiIdx = columns.findIndex(c => c.key === "sotib_oldi");
    const newCols = [...columns];
    newCols.splice(sotiIdx, 0, { key, title: newColName, color: newColColor, locked: false });
    setColumns(newCols);
    setNewColName("");
    setNewColColor(COLORS[4].hex);
    setShowAddCol(false);
  };

  const removeColumn = (key: string) => {
    leads.filter(l => l.status === key).forEach(l => moveLead(l.id, "yangi"));
    setColumns(prev => prev.filter(c => c.key !== key));
    setConfirmDelete(null);
    setColMenu(null);
  };

  const renameColumn = (key: string) => {
    if (!editName.trim()) return;
    setColumns(prev => prev.map(c => c.key === key ? { ...c, title: editName, color: editColor || c.color } : c));
    setEditingCol(null);
    setEditName("");
    setEditColor("");
  };

  const moveAndClose = (id: number, status: string, note?: string) => {
    moveLead(id, status, note);
    setOpenLead(null);
    setRejectInput("");
  };

  return (
    <div className="px-3 sm:px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold" style={{ color: config.text }}>Arizalar</h1>
          <p className="text-[14px] mt-0.5" style={{ color: config.textMuted }}>Murojaatlarni boshqaring</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px]" style={{ color: config.textDim }}>{leads.length} ta</span>
          {view === "asosiy" && (
            <button onClick={() => setShowAddCol(true)} className="h-[34px] px-3 rounded-[8px] text-[12px] font-medium flex items-center gap-1.5 transition-all" style={{ backgroundColor: config.hover, color: config.textMuted }}>
              <Plus className="w-3.5 h-3.5" /> Ustun qo&apos;shish
            </button>
          )}
        </div>
      </div>

      {/* View toggle */}
      <div className="inline-flex items-center gap-1 p-1 rounded-[10px] mb-5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
        {[
          { k: "asosiy" as const, label: "Asosiy", count: mainCount },
          { k: "yopilgan" as const, label: "Yopilgan", count: closedCount },
        ].map(t => {
          const active = view === t.k;
          return (
            <button
              key={t.k}
              onClick={() => setView(t.k)}
              className="flex items-center gap-2 h-8 px-3 rounded-md text-[12px] font-medium transition-all"
              style={{
                backgroundColor: active ? config.accent : "transparent",
                color: active ? config.accentText : config.textMuted,
              }}
            >
              {t.label}
              <span className="text-[10px] font-bold opacity-80">{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Ustun qo'shish forma */}
      {showAddCol && (
        <div className="mb-4 rounded-[12px] p-4 max-w-[350px] space-y-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
          <input value={newColName} onChange={(e) => setNewColName(e.target.value)} placeholder="Ustun nomi..." className="w-full h-[38px] px-3 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} onKeyDown={(e) => e.key === "Enter" && addColumn()} />
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button key={c.hex} onClick={() => setNewColColor(c.hex)} className={`w-7 h-7 rounded-full transition-all ${newColColor === c.hex ? "ring-2 ring-white/40 scale-110" : "hover:scale-105"}`} style={{ backgroundColor: c.hex }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={addColumn} className="flex-1 h-[36px] rounded-[8px] text-[13px] font-medium" style={{ backgroundColor: config.accent, color: config.accentText }}>Qo&apos;shish</button>
            <button onClick={() => { setShowAddCol(false); setNewColName(""); }} className="h-[36px] px-4 rounded-[8px] text-[13px]" style={{ backgroundColor: config.hover, color: config.textMuted }}>Bekor</button>
          </div>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
        {visibleColumns.map((col) => {
          const colLeads = leads.filter(l => l.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = Number(e.dataTransfer.getData("text/plain"));
                setDragOverCol(null);
                setDraggingId(null);
                if (!id) return;
                const lead = leads.find(l => l.id === id);
                if (!lead || lead.status === col.key) return;
                // Faqat sifatsizga majburiy sabab so'raladi
                if (col.key === "sifatsiz") {
                  setPendingMove({ leadId: id, toStatus: col.key });
                  setPendingNote("");
                } else {
                  moveLead(id, col.key);
                }
              }}
              className={`rounded-[14px] p-3 min-h-[400px] w-[300px] md:w-auto md:flex-1 shrink-0 transition-all ${dragOverCol === col.key ? "scale-[1.01]" : ""}`}
              style={{ backgroundColor: dragOverCol === col.key ? `${col.color}25` : `${col.color}10`, border: `1px solid ${dragOverCol === col.key ? "rgba(255,255,255,0.3)" : config.surfaceBorder}` }}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1 relative">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                {editingCol === col.key ? (
                  <div className="flex-1 space-y-2">
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && renameColumn(col.key)} autoFocus className="w-full h-[28px] px-2 rounded-[6px] text-[13px] focus:outline-none" style={{ backgroundColor: config.active, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
                    <div className="flex items-center gap-1">
                      {COLORS.map((c) => (
                        <button key={c.hex} onClick={() => setEditColor(c.hex)} className={`w-5 h-5 rounded-full transition-all ${(editColor || col.color) === c.hex ? "ring-2 ring-white/40 scale-110" : ""}`} style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => renameColumn(col.key)} className="text-[11px] font-medium" style={{ color: config.text }}>Saqlash</button>
                      <button onClick={() => { setEditingCol(null); setEditColor(""); }} className="text-[11px]" style={{ color: config.textDim }}>Bekor</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-[13px] font-semibold" style={{ color: config.text }}>{col.title}</span>
                    <span className="text-[11px] ml-auto" style={{ color: config.textDim }}>{colLeads.length}</span>
                    <div className="relative">
                      <button onClick={() => setColMenu(colMenu === col.key ? null : col.key)} className="w-6 h-6 rounded-[6px] flex items-center justify-center transition-all" style={{ color: config.textDim }}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {colMenu === col.key && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setColMenu(null)} />
                          <div className="absolute right-0 top-7 z-50 w-[180px] rounded-[10px] shadow-xl py-1" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
                            <button onClick={() => { setAddLead(col.key); setColMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-all" style={{ color: config.textMuted }}>
                              <Plus className="w-3.5 h-3.5" /> Lead qo&apos;shish
                            </button>
                            {!col.locked && (
                              <>
                                <div className="my-1" style={{ borderTop: `1px solid ${config.surfaceBorder}` }} />
                                <button onClick={() => { setEditingCol(col.key); setEditName(col.title); setEditColor(col.color); setColMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-all" style={{ color: config.textMuted }}>
                                  <Pencil className="w-3.5 h-3.5" /> Tahrirlash
                                </button>
                                <button onClick={() => { setConfirmDelete(col.key); setColMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-all">
                                  <Trash2 className="w-3.5 h-3.5" /> O&apos;chirish
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* O'chirish tasdiqlash */}
              {confirmDelete === col.key && (
                <div className="mb-3 mx-1 rounded-[10px] bg-red-500/[0.08] border border-red-500/20 p-3">
                  <p className="text-[12px] text-red-300 mb-2.5">&quot;{col.title}&quot; ustunini o&apos;chirasizmi? Leadlar &quot;Yangi ariza&quot;ga qaytariladi.</p>
                  <div className="flex gap-2">
                    <button onClick={() => removeColumn(col.key)} className="flex-1 h-[30px] rounded-[8px] bg-red-500 text-white text-[12px] font-medium">Ha, o&apos;chirish</button>
                    <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[30px] rounded-[8px] text-[12px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>Bekor</button>
                  </div>
                </div>
              )}

              {colLeads.length > 0 ? (
                <div className="space-y-2">
                  {colLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onOpen={() => setOpenLead(lead)}
                      columns={columns}
                      onMove={moveLead}
                      onDragStart={setDraggingId}
                      onDragEnd={() => setDraggingId(null)}
                      isDragging={draggingId === lead.id}
                      config={config}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-5 w-5 mb-2" style={{ color: config.textDim }} />
                  <p className="text-[12px]" style={{ color: config.textDim }}>Bo&apos;sh</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Izoh/sabab modal — drag orqali ko'chirishda */}
      {pendingMove && (() => {
        const toCol = columns.find(c => c.key === pendingMove.toStatus);
        const lead = leads.find(l => l.id === pendingMove.leadId);
        const isReject = pendingMove.toStatus === "sifatsiz";
        if (!toCol || !lead) return null;
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setPendingMove(null); setPendingNote(""); }} />
            <div className="relative rounded-[20px] w-full max-w-[440px] overflow-hidden" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
              <div className="px-6 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
                <div>
                  <h2 className="text-[17px] font-bold" style={{ color: config.text }}>
                    {isReject ? "Sifatsizlik sababi" : "Izoh qo'shish"}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1 text-[12px]" style={{ color: config.textMuted }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: toCol.color }} />
                    {toCol.title}
                  </div>
                </div>
                <button onClick={() => { setPendingMove(null); setPendingNote(""); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover }}>
                  <X className="w-4 h-4" style={{ color: config.textMuted }} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="rounded-[10px] px-3 py-2.5 flex items-center gap-2.5" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[11px] font-bold shrink-0" style={{ backgroundColor: avatarColor(lead.name), color: config.text }}>
                    {initials(lead.name)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: config.text }}>{lead.name}</p>
                    <p className="text-[11px]" style={{ color: config.textDim }}>{lead.course}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>
                    {isReject ? "Sabab *" : "Izoh"} {!isReject && <span style={{ color: config.textDim }}>(ixtiyoriy)</span>}
                  </label>
                  <textarea
                    value={pendingNote}
                    onChange={(e) => setPendingNote(e.target.value)}
                    autoFocus
                    rows={3}
                    placeholder={isReject ? "Nima uchun sifatsiz?" : "Qo'shimcha ma'lumot..."}
                    className={`w-full px-4 py-3 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none resize-none ${isReject ? "bg-red-500/[0.06] border border-red-500/20 focus:border-red-500/40" : ""}`}
                    style={isReject ? { color: config.text } : { backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setPendingMove(null); setPendingNote(""); }} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>
                    Bekor
                  </button>
                  <button
                    onClick={() => {
                      if (isReject && !pendingNote.trim()) return;
                      moveLead(pendingMove.leadId, pendingMove.toStatus, pendingNote.trim() || undefined);
                      setPendingMove(null);
                      setPendingNote("");
                    }}
                    disabled={isReject && !pendingNote.trim()}
                    className={`flex-1 h-[44px] rounded-[10px] text-[14px] font-medium transition-all ${
                      isReject
                        ? pendingNote.trim() ? "bg-red-500 text-white hover:bg-red-500/90" : "bg-red-500/20 text-red-300/50 cursor-not-allowed"
                        : ""
                    }`}
                    style={!isReject ? { backgroundColor: config.accent, color: config.accentText } : undefined}
                  >
                    {isReject ? "Sifatsizga o'tkazish" : "Ko'chirish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Lead qo'shish modal */}
      {addLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAddLead(null)} />
          <div className="relative rounded-[20px] w-full max-w-[460px] overflow-hidden" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="px-6 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div>
                <h2 className="text-[17px] font-bold" style={{ color: config.text }}>Yangi lead qo&apos;shish</h2>
                <div className="flex items-center gap-1.5 mt-1 text-[12px]" style={{ color: config.textMuted }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: columns.find(c => c.key === addLead)?.color }} />
                  {columns.find(c => c.key === addLead)?.title}
                </div>
              </div>
              <button onClick={() => setAddLead(null)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover }}>
                <X className="w-4 h-4" style={{ color: config.textMuted }} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Ism familiya *</label>
                <input placeholder="Ism familiya" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
              <div>
                <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Telefon *</label>
                <input placeholder="+998 90 123 45 67" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
              <div>
                <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Telegram</label>
                <input placeholder="@username" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
              <div>
                <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Kurs</label>
                <input placeholder="Kurs nomi" className="w-full h-[44px] px-4 rounded-[10px] text-[15px] placeholder:text-white/20 focus:outline-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
              <div>
                <label className="text-[12px] mb-1.5 block" style={{ color: config.textMuted }}>Izoh</label>
                <textarea placeholder="Qo'shimcha ma'lumot..." rows={3} className="w-full px-4 py-3 rounded-[10px] text-[14px] placeholder:text-white/20 focus:outline-none resize-none" style={{ backgroundColor: config.hover, border: `1px solid ${config.surfaceBorder}`, color: config.text }} />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setAddLead(null)} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium" style={{ backgroundColor: config.hover, color: config.textMuted }}>Bekor</button>
                <button onClick={() => setAddLead(null)} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-medium flex items-center justify-center gap-2" style={{ backgroundColor: config.accent, color: config.accentText }}>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setOpenLead(null); setRejectInput(""); }} />
          <div className="relative rounded-[20px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto" style={{ backgroundColor: config.sidebar, border: `1px solid ${config.surfaceBorder}` }}>
            <div className="sticky top-0 px-6 pt-6 pb-4 flex items-start justify-between" style={{ backgroundColor: config.sidebar, borderBottom: `1px solid ${config.surfaceBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-[16px] font-bold shrink-0" style={{ backgroundColor: avatarColor(openLead.name), color: config.text }}>
                  {initials(openLead.name)}
                </div>
                <div>
                  <h2 className="text-[18px] font-bold" style={{ color: config.text }}>{openLead.name}</h2>
                  <div className="flex items-center gap-1.5 text-[12px] mt-0.5" style={{ color: config.textMuted }}>
                    <Clock className="w-3 h-3" /> {openLead.time}
                  </div>
                </div>
              </div>
              <button onClick={() => { setOpenLead(null); setRejectInput(""); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: config.hover }}>
                <X className="w-4 h-4" style={{ color: config.textMuted }} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Kontakt */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Kontakt</p>
                <div className="space-y-2">
                  <a href={`tel:${openLead.phone}`} className="flex items-center gap-3 rounded-[12px] px-4 py-3 transition-all group" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
                      <Phone className="w-4 h-4" style={{ color: config.textMuted }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px]" style={{ color: config.textDim }}>Telefon</p>
                      <p className="text-[14px] font-medium" style={{ color: config.text }}>{openLead.phone}</p>
                    </div>
                    <Copy className="w-4 h-4" style={{ color: config.textDim }} />
                  </a>
                  {openLead.telegram && (
                    <a href={`https://t.me/${openLead.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-[12px] px-4 py-3 transition-all group" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
                        <Send className="w-4 h-4" style={{ color: config.textMuted }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px]" style={{ color: config.textDim }}>Telegram</p>
                        <p className="text-[14px] font-medium" style={{ color: config.text }}>{openLead.telegram}</p>
                      </div>
                      <Copy className="w-4 h-4" style={{ color: config.textDim }} />
                    </a>
                  )}
                </div>
              </div>

              {/* Kurs */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Qiziqgan kurs</p>
                <div className="rounded-[12px] px-4 py-3 flex items-center gap-3" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: config.hover }}>
                    <BookOpen className="w-4 h-4" style={{ color: config.textMuted }} />
                  </div>
                  <p className="text-[14px] font-medium" style={{ color: config.text }}>{openLead.course}</p>
                </div>
              </div>

              {/* Izoh */}
              {openLead.note && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Izoh</p>
                  <div className="rounded-[12px] p-4" style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}` }}>
                    <p className="text-[13px] italic" style={{ color: config.textMuted }}>&ldquo;{openLead.note}&rdquo;</p>
                  </div>
                </div>
              )}

              {/* Jarayon tarixi */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Jarayon tarixi</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[13px]" style={{ color: config.text }}>Yangi ariza qabul qilindi</p>
                      <p className="text-[11px]" style={{ color: config.textDim }}>{openLead.time}</p>
                    </div>
                  </div>
                  {openLead.status !== "yangi" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: columns.find(c => c.key === openLead.status)?.color }} />
                      <div>
                        <p className="text-[13px]" style={{ color: config.text }}>{columns.find(c => c.key === openLead.status)?.title}</p>
                        <p className="text-[11px]" style={{ color: config.textDim }}>Holati o&apos;zgartirildi</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sifatsizlik sababi input (faqat yangi yoki jarayonda) */}
              {(openLead.status === "yangi" || openLead.status === "jarayonda") && (
                <>
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {openLead.status === "yangi" && (
                      <button onClick={() => moveAndClose(openLead.id, "jarayonda")} className="flex-1 h-[44px] rounded-[10px] bg-green-500/15 text-green-400 text-[13px] font-medium hover:bg-green-500/25 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Jarayonga olish
                      </button>
                    )}
                    {openLead.status === "jarayonda" && (
                      <button onClick={() => moveAndClose(openLead.id, "sotib_oldi")} className="flex-1 h-[44px] rounded-[10px] bg-green-500/15 text-green-400 text-[13px] font-medium hover:bg-green-500/25 flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Sotib oldi
                      </button>
                    )}
                    <button
                      onClick={() => { if (rejectInput.trim()) moveAndClose(openLead.id, "sifatsiz", rejectInput); }}
                      disabled={!rejectInput.trim()}
                      className={`flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2 ${rejectInput.trim() ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "cursor-not-allowed"}`}
                      style={!rejectInput.trim() ? { backgroundColor: config.surface, color: config.textDim } : undefined}
                    >
                      <XCircle className="w-4 h-4" /> Sifatsiz
                    </button>
                  </div>
                  <input
                    value={rejectInput}
                    onChange={(e) => setRejectInput(e.target.value)}
                    placeholder="Sifatsiz uchun sabab yozing..."
                    className="w-full h-[40px] px-3 rounded-[10px] text-[13px] placeholder:text-white/20 focus:outline-none"
                    style={{ backgroundColor: config.surface, border: `1px solid ${config.surfaceBorder}`, color: config.text }}
                  />
                </>
              )}

              {/* Boshqa ustunga ko'chirish */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: config.textDim }}>Boshqa ustunga ko&apos;chirish</p>
                <div className="flex flex-wrap gap-2">
                  {columns.filter(c => c.key !== openLead.status).map((c) => (
                    <button
                      key={c.key}
                      onClick={() => moveAndClose(openLead.id, c.key)}
                      className="h-[32px] px-3 rounded-full text-[12px] flex items-center gap-1.5 transition-all"
                      style={{ backgroundColor: config.hover, color: config.textMuted }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
