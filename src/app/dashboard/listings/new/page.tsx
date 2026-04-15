import type { Metadata } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Yangi e'lon",
};

export default function NewListingPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 md:py-14">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[14px] text-[#7ea2d4] hover:text-[#5b87c0] font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-[#232324] tracking-tight mb-2">
        Yangi e&apos;lon
      </h1>
      <p className="text-[15px] text-[#232324]/40 mb-10">
        Kurs ma&apos;lumotlarini kiriting
      </p>

      {/* Form */}
      <div className="space-y-6">
        <div className="p-8 rounded-2xl bg-white border border-[#e8ecef] space-y-5">
          <h2 className="text-[16px] font-semibold text-[#232324] mb-2">
            Asosiy ma&apos;lumotlar
          </h2>
          <div>
            <Label className="text-[13px] text-[#232324]/50 mb-1.5">
              Kurs nomi *
            </Label>
            <Input
              placeholder="Masalan: Python dasturlash kursi"
              className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
            />
          </div>
          <div>
            <Label className="text-[13px] text-[#232324]/50 mb-1.5">
              Kategoriya *
            </Label>
            <Input
              placeholder="Kategoriyani tanlang"
              className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[13px] text-[#232324]/50 mb-1.5">
                Format *
              </Label>
              <Input
                placeholder="Online / Offline / Video"
                className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
              />
            </div>
            <div>
              <Label className="text-[13px] text-[#232324]/50 mb-1.5">
                Narx (so&apos;m) *
              </Label>
              <Input
                type="number"
                placeholder="500 000"
                className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[13px] text-[#232324]/50 mb-1.5">
                Davomiylik *
              </Label>
              <Input
                placeholder="3 oy"
                className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
              />
            </div>
            <div>
              <Label className="text-[13px] text-[#232324]/50 mb-1.5">
                Telefon *
              </Label>
              <Input
                placeholder="+998 90 123 45 67"
                className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
              />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-[#e8ecef] space-y-5">
          <h2 className="text-[16px] font-semibold text-[#232324] mb-2">
            Qo&apos;shimcha
          </h2>
          <div>
            <Label className="text-[13px] text-[#232324]/50 mb-1.5">
              Joylashuv (offline uchun)
            </Label>
            <Input
              placeholder="Toshkent, Chilonzor tumani"
              className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
            />
          </div>
          <div>
            <Label className="text-[13px] text-[#232324]/50 mb-1.5">
              Tavsif
            </Label>
            <Textarea
              placeholder="Kurs haqida batafsil ma'lumot..."
              rows={5}
              className="rounded-xl border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
            />
          </div>
        </div>

        <Button className="w-full h-13 rounded-xl gradient-accent border-0 text-white text-[15px] font-medium shadow-sm hover:shadow-md transition-shadow">
          E&apos;lonni joylash
        </Button>
      </div>
    </div>
  );
}
