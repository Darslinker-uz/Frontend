"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowLeft, Languages, Code2, Calculator, Palette, TrendingUp, Lock, Clock, BookOpen } from "lucide-react";

type Course = {
  slug: string;
  name: string;
  desc: string;
  category: string;
  level: string;
  icon: typeof Languages;
  gradient: string;
  stages: number;
  topics: number;
  duration: string;
  available: boolean;
};

const CATEGORIES = ["Barchasi", "Tillar", "IT", "Matematika", "Dizayn", "Marketing"];

const courses: Course[] = [
  { slug: "english", name: "Ingliz tili", desc: "Kunlik muloqot, grammatika va test orqali A1 dan A2 darajaga", category: "Tillar", level: "Boshlang'ich", icon: Languages, gradient: "from-[#4a7ab5] to-[#7ea2d4]", stages: 6, topics: 30, duration: "45-60 daq", available: true },
  { slug: "frontend", name: "Frontend asoslari", desc: "HTML, CSS va JavaScript bilan tanishuv", category: "IT", level: "Boshlang'ich", icon: Code2, gradient: "from-[#6b5b95] to-[#8b7bb5]", stages: 6, topics: 30, duration: "60 daq", available: false },
  { slug: "math", name: "Matematika", desc: "Algebra va geometriya asoslari", category: "Matematika", level: "Boshlang'ich", icon: Calculator, gradient: "from-[#2d6a5a] to-[#4a9e8a]", stages: 6, topics: 30, duration: "45 daq", available: false },
  { slug: "design", name: "UI/UX dizayn", desc: "Figma va dizayn asoslari", category: "Dizayn", level: "Boshlang'ich", icon: Palette, gradient: "from-[#a35b2d] to-[#c47e4a]", stages: 6, topics: 30, duration: "50 daq", available: false },
  { slug: "marketing", name: "Digital marketing", desc: "SMM va kontekst reklama asoslari", category: "Marketing", level: "Boshlang'ich", icon: TrendingUp, gradient: "from-[#7a3e6b] to-[#a05e92]", stages: 6, topics: 30, duration: "40 daq", available: false },
];

export default function StartKurslarPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Barchasi");

  const filtered = useMemo(() => {
    let res = courses;
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(c => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
    }
    if (category !== "Barchasi") res = res.filter(c => c.category === category);
    return res;
  }, [search, category]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Barchasi: courses.length };
    for (const c of courses) {
      counts[c.category] = (counts[c.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="bg-[#f0f2f3] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-5 md:px-20 py-5 md:py-8">
        <Link href="/start" className="inline-flex items-center gap-2 text-[13px] text-[#7c8490] hover:text-[#16181a] font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> DarsLinker Start
        </Link>

        <h1 className="text-[26px] md:text-[32px] font-bold text-[#16181a] tracking-[-0.02em]">Mini kurslar</h1>
        <p className="text-[14px] text-[#7c8490] mt-1 mb-5">Kategoriya bo&apos;yicha ko&apos;ring</p>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[#e4e7ea] mb-4 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors flex items-center gap-2 ${category === c ? "border-[#16181a] text-[#16181a]" : "border-transparent text-[#7c8490] hover:text-[#16181a]"}`}
            >
              {c}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${category === c ? "bg-[#16181a] text-white" : "bg-[#f0f2f3] text-[#7c8490]"}`}>{categoryCounts[c] ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-[480px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8490]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs qidirish..."
            className="w-full h-[42px] pl-10 pr-4 rounded-[10px] bg-white border border-[#e4e7ea] text-[14px] text-[#16181a] placeholder:text-[#7c8490]/50 focus:outline-none focus:border-[#7ea2d4]"
          />
        </div>

        <p className="text-[12px] text-[#7c8490] mb-3">{filtered.length} ta kurs</p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 rounded-[18px] bg-white border border-[#e4e7ea]">
            <p className="text-[16px] text-[#7c8490] font-medium">Kurs topilmadi</p>
            <p className="text-[13px] text-[#7c8490]/60 mt-1">Boshqa kategoriya yoki so&apos;zni sinab ko&apos;ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((c) => {
              const Icon = c.icon;
              if (c.available) {
                return (
                  <Link key={c.slug} href={`/start/kurslar/${c.slug}`} className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br ${c.gradient} p-4 hover:scale-[1.01] transition-transform group flex flex-col`}>
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                    <div className="relative flex items-start gap-3">
                      <div className="w-10 h-10 rounded-[10px] bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[15px] font-bold text-white">{c.name}</p>
                          <span className="px-1.5 py-0.5 rounded bg-[#f5a623] text-[9px] font-bold text-white shrink-0">AKTIV</span>
                        </div>
                        <p className="text-[11px] text-white/60 line-clamp-2">{c.desc}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-white/50">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{c.stages}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }
              return (
                <div key={c.slug} className="relative overflow-hidden rounded-[16px] bg-white border border-[#e4e7ea] p-4 opacity-60 cursor-not-allowed">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${c.gradient} opacity-40 flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[15px] font-bold text-[#16181a]">{c.name}</p>
                        <Lock className="w-3.5 h-3.5 text-[#7c8490]/50 shrink-0" />
                      </div>
                      <p className="text-[11px] text-[#7c8490] line-clamp-2">{c.desc}</p>
                      <p className="text-[10px] text-[#7c8490] mt-2 font-semibold uppercase tracking-wider">Tez kunda</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
