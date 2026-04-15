import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, BarChart3, Wallet, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const stats = [
  { label: "Jami leadlar", value: "0", icon: Users, color: "from-blue-500/10 to-blue-600/5" },
  { label: "Bu oy", value: "0", icon: TrendingUp, color: "from-green-500/10 to-green-600/5" },
  { label: "Konversiya", value: "0%", icon: BarChart3, color: "from-purple-500/10 to-purple-600/5" },
  { label: "Balans", value: "50 000", icon: Wallet, color: "from-amber-500/10 to-amber-600/5" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#232324] tracking-tight">
            Dashboard
          </h1>
          <p className="text-[15px] text-[#232324]/40 mt-1">
            Xush kelibsiz!
          </p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button className="rounded-xl gradient-accent border-0 text-white h-11 px-5 text-[14px] font-medium shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Yangi e&apos;lon
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-[#e8ecef]`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#7ea2d4]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#232324]">{stat.value}</p>
              <p className="text-[13px] text-[#232324]/40 mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Listings */}
      <div className="p-8 rounded-2xl bg-white border border-[#e8ecef]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-semibold text-[#232324]">
            Mening e&apos;lonlarim
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-[#e8ecef]">
          <p className="text-[15px] text-[#232324]/30 mb-4">
            Hali e&apos;lon qo&apos;shilmagan
          </p>
          <Link href="/dashboard/listings/new">
            <Button
              variant="outline"
              className="rounded-xl h-10 px-5 text-[14px] border-[#e8ecef]"
            >
              <Plus className="h-4 w-4 mr-2" />
              E&apos;lon qo&apos;shish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
