import type { Metadata } from "next";
import { BookOpen, Users, MessageSquare, Banknote } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
};

const stats = [
  { label: "Jami kurslar", value: "0", icon: BookOpen, color: "from-blue-500/10 to-blue-600/5" },
  { label: "Foydalanuvchilar", value: "0", icon: Users, color: "from-green-500/10 to-green-600/5" },
  { label: "Jami leadlar", value: "0", icon: MessageSquare, color: "from-purple-500/10 to-purple-600/5" },
  { label: "Daromad", value: "0", icon: Banknote, color: "from-amber-500/10 to-amber-600/5" },
];

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-[#232324] tracking-tight mb-2">
        Admin Dashboard
      </h1>
      <p className="text-[15px] text-[#232324]/40 mb-10">
        Platformani boshqarish
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-[#e8ecef]`}
            >
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                <Icon className="h-4 w-4 text-[#7ea2d4]" />
              </div>
              <p className="text-2xl font-bold text-[#232324]">{stat.value}</p>
              <p className="text-[13px] text-[#232324]/40 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
