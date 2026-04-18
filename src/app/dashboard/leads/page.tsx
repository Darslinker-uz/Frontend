"use client";

import { useState } from "react";
import { MessageSquare, Phone, Clock, Plus, X, Check, XCircle, Pencil, MoreHorizontal, Trash2, BookOpen, Copy, Send } from "lucide-react";
import { useLeads } from "@/context/leads-context";
import type { Lead } from "@/data/leads";

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
  { key: "jarayonda", title: "Jarayonda", color: "#f59e0b", locked: false },
  { key: "sotib_oldi", title: "Sotib oldi", color: "#22c55e", locked: true },
  { key: "sifatsiz", title: "Sifatsiz", color: "#ef4444", locked: true },
];

const initials = (name: string) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
const avatarColor = (name: string) => {
  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#ef4444", "#f97316"];
  return colors[name.charCodeAt(0) % colors.length];
};

function LeadCard({ lead, onOpen, columns, onMove, onDragStart, onDragEnd, isDragging }: {
  lead: Lead;
  onOpen: () => void;
  columns: Column[];
  onMove: (id: number, status: string) => void;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
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
      className={`rounded-[14px] bg-white/[0.06] border border-white/[0.08] p-4 hover:bg-white/[0.1] transition-all cursor-grab active:cursor-grabbing shadow-sm ${isDragging ? "opacity-40 scale-95" : ""}`}
    >
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
            onClick={(e) => { e.stopPropagation(); setMoveMenuOpen(!moveMenuOpen); }}
            className="w-7 h-7 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/70 transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {moveMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMoveMenuOpen(false); }} />
              <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-8 z-50 w-[180px] rounded-[10px] bg-[#1e2024] border border-white/[0.08] shadow-xl py-1">
                <p className="px-3 py-1.5 text-[10px] text-white/25 uppercase tracking-wider">Ko&apos;chirish</p>
                {otherCols.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => { onMove(lead.id, c.key); setMoveMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.06] flex items-center gap-2 transition-all"
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
      <div className="rounded-[8px] bg-white/[0.04] px-3 py-2 mb-2">
        <p className="text-[11px] text-white/30 mb-0.5">Kurs</p>
        <p className="text-[12px] font-medium text-white">{lead.course}</p>
      </div>
      <div className="space-y-1.5">
        <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[12px] text-white/60 hover:text-white">
          <Phone className="w-3.5 h-3.5" />{lead.phone}
        </a>
        {lead.telegram && (
          <a href={`https://t.me/${lead.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-[12px] text-white/60 hover:text-white">
            <Send className="w-3.5 h-3.5" />{lead.telegram}
          </a>
        )}
      </div>
      {lead.note && <p className="text-[11px] text-white/35 italic mt-2 pt-2 border-t border-white/[0.08]">&ldquo;{lead.note}&rdquo;</p>}
    </div>
  );
}

export default function LeadsPage() {
  const { leads, moveLead } = useLeads();
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
    <div className="px-5 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] md:text-[26px] font-bold text-white">Arizalar</h1>
          <p className="text-[14px] text-white/40 mt-0.5">Murojaatlarni boshqaring</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-white/30">{leads.length} ta</span>
          <button onClick={() => setShowAddCol(true)} className="h-[34px] px-3 rounded-[8px] bg-white/[0.06] text-white/40 text-[12px] font-medium flex items-center gap-1.5 hover:bg-white/[0.1] hover:text-white/60 transition-all">
            <Plus className="w-3.5 h-3.5" /> Ustun qo&apos;shish
          </button>
        </div>
      </div>

      {/* Ustun qo'shish forma */}
      {showAddCol && (
        <div className="mb-4 rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-4 max-w-[350px] space-y-3">
          <input value={newColName} onChange={(e) => setNewColName(e.target.value)} placeholder="Ustun nomi..." className="w-full h-[38px] px-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" onKeyDown={(e) => e.key === "Enter" && addColumn()} />
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button key={c.hex} onClick={() => setNewColColor(c.hex)} className={`w-7 h-7 rounded-full transition-all ${newColColor === c.hex ? "ring-2 ring-white/40 scale-110" : "hover:scale-105"}`} style={{ backgroundColor: c.hex }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={addColumn} className="flex-1 h-[36px] rounded-[8px] bg-white text-[#16181a] text-[13px] font-medium">Qo&apos;shish</button>
            <button onClick={() => { setShowAddCol(false); setNewColName(""); }} className="h-[36px] px-4 rounded-[8px] bg-white/[0.06] text-white/40 text-[13px]">Bekor</button>
          </div>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
        {columns.map((col) => {
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
              className={`rounded-[14px] border p-3 min-h-[400px] w-[300px] md:w-auto md:flex-1 shrink-0 transition-all ${dragOverCol === col.key ? "border-white/30 scale-[1.01]" : "border-white/[0.06]"}`}
              style={{ backgroundColor: dragOverCol === col.key ? `${col.color}25` : `${col.color}10` }}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1 relative">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                {editingCol === col.key ? (
                  <div className="flex-1 space-y-2">
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && renameColumn(col.key)} autoFocus className="w-full h-[28px] px-2 rounded-[6px] bg-white/[0.1] border border-white/[0.15] text-[13px] text-white focus:outline-none" />
                    <div className="flex items-center gap-1">
                      {COLORS.map((c) => (
                        <button key={c.hex} onClick={() => setEditColor(c.hex)} className={`w-5 h-5 rounded-full transition-all ${(editColor || col.color) === c.hex ? "ring-2 ring-white/40 scale-110" : ""}`} style={{ backgroundColor: c.hex }} />
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => renameColumn(col.key)} className="text-white text-[11px] font-medium">Saqlash</button>
                      <button onClick={() => { setEditingCol(null); setEditColor(""); }} className="text-white/30 text-[11px]">Bekor</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-[13px] font-semibold text-white">{col.title}</span>
                    <span className="text-[11px] text-white/20 ml-auto">{colLeads.length}</span>
                    <div className="relative">
                      <button onClick={() => setColMenu(colMenu === col.key ? null : col.key)} className="w-6 h-6 rounded-[6px] flex items-center justify-center text-white/15 hover:text-white/40 hover:bg-white/[0.06] transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {colMenu === col.key && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setColMenu(null)} />
                          <div className="absolute right-0 top-7 z-50 w-[180px] rounded-[10px] bg-[#1e2024] border border-white/[0.08] shadow-xl py-1">
                            <button onClick={() => { setAddLead(col.key); setColMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-all">
                              <Plus className="w-3.5 h-3.5" /> Lead qo&apos;shish
                            </button>
                            {!col.locked && (
                              <>
                                <div className="border-t border-white/[0.06] my-1" />
                                <button onClick={() => { setEditingCol(col.key); setEditName(col.title); setEditColor(col.color); setColMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
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
                    <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[30px] rounded-[8px] bg-white/[0.06] text-white/40 text-[12px] font-medium">Bekor</button>
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
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-5 w-5 text-white/10 mb-2" />
                  <p className="text-[12px] text-white/15">Bo&apos;sh</p>
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
            <div className="relative bg-[#16181a] rounded-[20px] border border-white/[0.08] w-full max-w-[440px] overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h2 className="text-[17px] font-bold text-white">
                    {isReject ? "Sifatsizlik sababi" : "Izoh qo'shish"}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1 text-[12px] text-white/40">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: toCol.color }} />
                    {toCol.title}
                  </div>
                </div>
                <button onClick={() => { setPendingMove(null); setPendingNote(""); }} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center">
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="rounded-[10px] bg-white/[0.04] border border-white/[0.06] px-3 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ backgroundColor: avatarColor(lead.name) }}>
                    {initials(lead.name)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{lead.name}</p>
                    <p className="text-[11px] text-white/30">{lead.course}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] text-white/40 mb-1.5 block">
                    {isReject ? "Sabab *" : "Izoh"} {!isReject && <span className="text-white/25">(ixtiyoriy)</span>}
                  </label>
                  <textarea
                    value={pendingNote}
                    onChange={(e) => setPendingNote(e.target.value)}
                    autoFocus
                    rows={3}
                    placeholder={isReject ? "Nima uchun sifatsiz?" : "Qo'shimcha ma'lumot..."}
                    className={`w-full px-4 py-3 rounded-[10px] border text-[14px] text-white placeholder:text-white/20 focus:outline-none resize-none ${isReject ? "bg-red-500/[0.06] border-red-500/20 focus:border-red-500/40" : "bg-white/[0.06] border-white/[0.08] focus:border-white/30"}`}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setPendingMove(null); setPendingNote(""); }} className="flex-1 h-[44px] rounded-[10px] bg-white/[0.06] text-white/60 text-[14px] font-medium hover:bg-white/[0.1]">
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
                        : "bg-white text-[#16181a] hover:bg-white/90"
                    }`}
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
          <div className="relative bg-[#16181a] rounded-[20px] border border-white/[0.08] w-full max-w-[460px] overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-white">Yangi lead qo&apos;shish</h2>
                <div className="flex items-center gap-1.5 mt-1 text-[12px] text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: columns.find(c => c.key === addLead)?.color }} />
                  {columns.find(c => c.key === addLead)?.title}
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
                <label className="text-[12px] text-white/40 mb-1.5 block">Telegram</label>
                <input placeholder="@username" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-[12px] text-white/40 mb-1.5 block">Kurs</label>
                <input placeholder="Kurs nomi" className="w-full h-[44px] px-4 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="text-[12px] text-white/40 mb-1.5 block">Izoh</label>
                <textarea placeholder="Qo'shimcha ma'lumot..." rows={3} className="w-full px-4 py-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setAddLead(null)} className="flex-1 h-[44px] rounded-[10px] bg-white/[0.06] text-white/60 text-[14px] font-medium hover:bg-white/[0.1]">Bekor</button>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setOpenLead(null); setRejectInput(""); }} />
          <div className="relative bg-[#16181a] rounded-[20px] border border-white/[0.08] w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
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
              <button onClick={() => { setOpenLead(null); setRejectInput(""); }} className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center">
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
                    <Copy className="w-4 h-4 text-white/20 group-hover:text-white/50" />
                  </a>
                  {openLead.telegram && (
                    <a href={`https://t.me/${openLead.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.08] transition-all group">
                      <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                        <Send className="w-4 h-4 text-white/60" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-white/30">Telegram</p>
                        <p className="text-[14px] font-medium text-white">{openLead.telegram}</p>
                      </div>
                      <Copy className="w-4 h-4 text-white/20 group-hover:text-white/50" />
                    </a>
                  )}
                </div>
              </div>

              {/* Kurs */}
              <div>
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2.5">Qiziqgan kurs</p>
                <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-white/60" />
                  </div>
                  <p className="text-[14px] font-medium text-white">{openLead.course}</p>
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

              {/* Jarayon tarixi */}
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
                      <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: columns.find(c => c.key === openLead.status)?.color }} />
                      <div>
                        <p className="text-[13px] text-white">{columns.find(c => c.key === openLead.status)?.title}</p>
                        <p className="text-[11px] text-white/30">Holati o&apos;zgartirildi</p>
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
                      className={`flex-1 h-[44px] rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-2 ${rejectInput.trim() ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "bg-white/[0.04] text-white/20 cursor-not-allowed"}`}
                    >
                      <XCircle className="w-4 h-4" /> Sifatsiz
                    </button>
                  </div>
                  <input
                    value={rejectInput}
                    onChange={(e) => setRejectInput(e.target.value)}
                    placeholder="Sifatsiz uchun sabab yozing..."
                    className="w-full h-[40px] px-3 rounded-[10px] bg-white/[0.04] border border-white/[0.06] text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                  />
                </>
              )}

              {/* Boshqa ustunga ko'chirish */}
              <div>
                <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-2.5">Boshqa ustunga ko&apos;chirish</p>
                <div className="flex flex-wrap gap-2">
                  {columns.filter(c => c.key !== openLead.status).map((c) => (
                    <button
                      key={c.key}
                      onClick={() => moveAndClose(openLead.id, c.key)}
                      className="h-[32px] px-3 rounded-full bg-white/[0.06] text-[12px] text-white/60 hover:text-white hover:bg-white/[0.1] flex items-center gap-1.5 transition-all"
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
