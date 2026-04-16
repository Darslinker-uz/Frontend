"use client";

import { useState } from "react";
import { MessageSquare, Phone, Clock, ChevronRight, Plus, X, GripVertical, Check, XCircle, Pencil, MoreHorizontal, Trash2 } from "lucide-react";
import { useLeads } from "@/context/leads-context";
import type { Lead } from "@/data/leads";

interface Column {
  key: string;
  title: string;
  color: string; // hex rang
  locked: boolean;
}

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


function LeadCard({ lead, onMove, columns }: { lead: Lead; onMove: (id: number, status: string, note?: string) => void; columns: Column[] }) {
  const [noteInput, setNoteInput] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const currentIdx = columns.findIndex(c => c.key === lead.status);

  // Yangi ariza — 2 button: Jarayonga (yoki keyingi custom) va Sifatsiz
  if (lead.status === "yangi") {
    const nextCol = columns[currentIdx + 1];
    return (
      <div className="rounded-[12px] bg-white/[0.06] border border-white/[0.08] p-3.5 space-y-2.5">
        <div>
          <p className="text-[14px] font-semibold text-white">{lead.name}</p>
          <p className="text-[12px] text-white/30 mt-0.5">{lead.course}</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-white/25">
          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.time}</span>
        </div>
        <div className="flex items-center gap-2">
          {nextCol && (
            <button onClick={() => { setShowNote(true); }} className="flex-1 h-[30px] rounded-[8px] bg-green-500/15 text-green-400 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-green-500/25 transition-all">
              <Check className="w-3 h-3" /> {nextCol.title}
            </button>
          )}
          <button onClick={() => { setShowReject(true); setShowNote(false); }} className="flex-1 h-[30px] rounded-[8px] bg-red-500/15 text-red-400 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-red-500/25 transition-all">
            <XCircle className="w-3 h-3" /> Sifatsiz
          </button>
        </div>
        {showNote && nextCol && (
          <div className="space-y-2">
            <input value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Izoh qo'shing..." className="w-full h-[34px] px-3 rounded-[8px] bg-white/[0.06] border border-white/[0.08] text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40" />
            <div className="flex gap-2">
              <button onClick={() => { onMove(lead.id, nextCol.key, noteInput); setShowNote(false); setNoteInput(""); }} className="flex-1 h-[30px] rounded-[8px] bg-[#7ea2d4] text-white text-[12px] font-medium">Yuborish</button>
              <button onClick={() => setShowNote(false)} className="h-[30px] px-3 rounded-[8px] bg-white/[0.06] text-white/40 text-[12px] font-medium">Bekor</button>
            </div>
          </div>
        )}
        {showReject && (
          <div className="space-y-2">
            <input value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} placeholder="Sifatsizlik sababi (majburiy)..." className="w-full h-[34px] px-3 rounded-[8px] bg-red-500/[0.06] border border-red-500/20 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40" />
            <div className="flex gap-2">
              <button onClick={() => { if (!rejectNote.trim()) return; onMove(lead.id, "sifatsiz", rejectNote); setShowReject(false); setRejectNote(""); }} className={`flex-1 h-[30px] rounded-[8px] text-[12px] font-medium transition-all ${rejectNote.trim() ? "bg-red-500 text-white" : "bg-red-500/20 text-red-300/50 cursor-not-allowed"}`}>Sifatsizga o&apos;tkazish</button>
              <button onClick={() => { setShowReject(false); setRejectNote(""); }} className="h-[30px] px-3 rounded-[8px] bg-white/[0.06] text-white/40 text-[12px] font-medium">Bekor</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Sotib oldi yoki Sifatsiz — ko'rsatish + qaytarish
  if (lead.status === "sotib_oldi" || lead.status === "sifatsiz") {
    const otherColumns = columns.filter(c => c.key !== lead.status);

    return (
      <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-3.5 space-y-2 group relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[14px] font-semibold text-white/70">{lead.name}</p>
            <p className="text-[12px] text-white/20 mt-0.5">{lead.course}</p>
          </div>
          <div className="relative">
            <button onClick={() => setShowMoveMenu(!showMoveMenu)} className="w-6 h-6 rounded-[6px] flex items-center justify-center text-white/10 hover:text-white/30 hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMoveMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoveMenu(false)} />
                <div className="absolute right-0 top-7 z-50 w-[180px] rounded-[10px] bg-[#1e2024] border border-white/[0.08] shadow-xl py-1">
                  <p className="px-3 py-1.5 text-[11px] text-white/20 uppercase tracking-wider">Ko&apos;chirish</p>
                  {otherColumns.map((c) => (
                    <button key={c.key} onClick={() => { onMove(lead.id, c.key); setShowMoveMenu(false); }} className="w-full text-left px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.06] flex items-center gap-2 transition-all">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      {c.title}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-white/15">
          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
        </div>
        {lead.note && <p className="text-[11px] text-white/25 italic border-l-2 border-white/10 pl-2">{lead.note}</p>}
      </div>
    );
  }

  // Jarayonda (va boshqa custom ustunlar) — izoh + 2 button
  const sotibOldiCol = columns.find(c => c.key === "sotib_oldi");
  return (
    <div className="rounded-[12px] bg-white/[0.06] border border-white/[0.08] p-3.5 space-y-2.5">
      <div>
        <p className="text-[14px] font-semibold text-white">{lead.name}</p>
        <p className="text-[12px] text-white/30 mt-0.5">{lead.course}</p>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-white/25">
        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.time}</span>
      </div>
      {lead.note && <p className="text-[12px] text-[#7ea2d4]/60 italic border-l-2 border-[#7ea2d4]/20 pl-2">{lead.note}</p>}
      <div className="flex items-center gap-2">
        <button onClick={() => onMove(lead.id, "sotib_oldi")} className="flex-1 h-[30px] rounded-[8px] bg-green-500/15 text-green-400 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-green-500/25 transition-all">
          <Check className="w-3 h-3" /> Sotib oldi
        </button>
        <button onClick={() => setShowReject(true)} className="flex-1 h-[30px] rounded-[8px] bg-red-500/15 text-red-400 text-[12px] font-medium flex items-center justify-center gap-1 hover:bg-red-500/25 transition-all">
          <XCircle className="w-3 h-3" /> Sifatsiz
        </button>
      </div>
      {showReject && (
        <div className="space-y-2">
          <input value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} placeholder="Sifatsizlik sababi (majburiy)..." className="w-full h-[34px] px-3 rounded-[8px] bg-red-500/[0.06] border border-red-500/20 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40" />
          <div className="flex gap-2">
            <button onClick={() => { if (!rejectNote.trim()) return; onMove(lead.id, "sifatsiz", rejectNote); setShowReject(false); setRejectNote(""); }} className={`flex-1 h-[30px] rounded-[8px] text-[12px] font-medium transition-all ${rejectNote.trim() ? "bg-red-500 text-white" : "bg-red-500/20 text-red-300/50 cursor-not-allowed"}`}>Sifatsizga o&apos;tkazish</button>
            <button onClick={() => { setShowReject(false); setRejectNote(""); }} className="h-[30px] px-3 rounded-[8px] bg-white/[0.06] text-white/40 text-[12px] font-medium">Bekor</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  const { leads, moveLead } = useLeads();
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [newColName, setNewColName] = useState("");
  const [newColColor, setNewColColor] = useState(COLORS[4].hex);
  const [showAddCol, setShowAddCol] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingCol, setEditingCol] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

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
    setMenuOpen(null);
  };

  const renameColumn = (key: string) => {
    if (!editName.trim()) return;
    setColumns(prev => prev.map(c => c.key === key ? { ...c, title: editName, color: editColor || c.color } : c));
    setEditingCol(null);
    setEditName("");
    setEditColor("");
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

      {/* Yangi ustun qo'shish */}
      {showAddCol && (
        <div className="mb-4 rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-4 max-w-[350px] space-y-3">
          <input value={newColName} onChange={(e) => setNewColName(e.target.value)} placeholder="Ustun nomi..." className="w-full h-[38px] px-3 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-[#7ea2d4]/40" onKeyDown={(e) => e.key === "Enter" && addColumn()} />
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button key={c.hex} onClick={() => setNewColColor(c.hex)} className={`w-7 h-7 rounded-full transition-all ${newColColor === c.hex ? "ring-2 ring-white/40 scale-110" : "hover:scale-105"}`} style={{ backgroundColor: c.hex }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={addColumn} className="flex-1 h-[36px] rounded-[8px] bg-[#7ea2d4] text-white text-[13px] font-medium">Qo&apos;shish</button>
            <button onClick={() => { setShowAddCol(false); setNewColName(""); }} className="h-[36px] px-4 rounded-[8px] bg-white/[0.06] text-white/40 text-[13px]">Bekor</button>
          </div>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
        {columns.map((col) => {
          const colLeads = leads.filter(l => l.status === col.key);
          return (
            <div key={col.key} className="rounded-[14px] border border-white/[0.06] p-3 min-h-[300px] w-[280px] md:w-auto md:flex-1 shrink-0" style={{ backgroundColor: `${col.color}12` }}>
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
                      <button onClick={() => renameColumn(col.key)} className="text-[#7ea2d4] text-[11px] font-medium">Saqlash</button>
                      <button onClick={() => { setEditingCol(null); setEditColor(""); }} className="text-white/30 text-[11px]">Bekor</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-[13px] font-semibold text-white">{col.title}</span>
                    <span className="text-[11px] text-white/20 ml-auto">{colLeads.length}</span>
                    {!col.locked && (
                      <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === col.key ? null : col.key)} className="w-6 h-6 rounded-[6px] flex items-center justify-center text-white/15 hover:text-white/40 hover:bg-white/[0.06] transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {menuOpen === col.key && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                            <div className="absolute right-0 top-8 z-50 w-[160px] rounded-[10px] bg-[#1e2024] border border-white/[0.08] shadow-xl py-1">
                              <button onClick={() => { setEditingCol(col.key); setEditName(col.title); setEditColor(col.color); setMenuOpen(null); }} className="w-full text-left px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.06] flex items-center gap-2 transition-all">
                                <Pencil className="w-3.5 h-3.5" /> Tahrirlash
                              </button>
                              <button onClick={() => { setConfirmDelete(col.key); setMenuOpen(null); }} className="w-full text-left px-3 py-2 text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] flex items-center gap-2 transition-all">
                                <Trash2 className="w-3.5 h-3.5" /> O&apos;chirish
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* O'chirish tasdiqlash */}
              {confirmDelete === col.key && (
                <div className="mb-3 mx-1 rounded-[10px] bg-red-500/[0.08] border border-red-500/20 p-3">
                  <p className="text-[12px] text-red-300 mb-2.5">&quot;{col.title}&quot; ustunini o&apos;chirasizmi? Undagi arizalar &quot;Yangi ariza&quot;ga qaytariladi.</p>
                  <div className="flex gap-2">
                    <button onClick={() => removeColumn(col.key)} className="flex-1 h-[30px] rounded-[8px] bg-red-500 text-white text-[12px] font-medium">Ha, o&apos;chirish</button>
                    <button onClick={() => setConfirmDelete(null)} className="flex-1 h-[30px] rounded-[8px] bg-white/[0.06] text-white/40 text-[12px] font-medium">Bekor</button>
                  </div>
                </div>
              )}
              {colLeads.length > 0 ? (
                <div className="space-y-2">
                  {colLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onMove={moveLead} columns={columns} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <MessageSquare className="h-5 w-5 text-white/10 mb-2" />
                  <p className="text-[12px] text-white/15">Bo&apos;sh</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
