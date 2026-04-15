import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Clock, Globe, Star, Users, Send } from "lucide-react";

type Props = {
  params: Promise<{ kategoriya: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description: `${title} haqida batafsil ma'lumot — Darslinker.uz`,
  };
}

export default async function KursDetailPage({ params }: Props) {
  const { kategoriya, slug } = await params;
  const title = slug.replace(/-/g, " ");
  const catName = kategoriya.replace(/-/g, " ");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[14px] mb-8">
        <Link
          href="/kurslar"
          className="text-[#7ea2d4] hover:text-[#5b87c0] transition-colors"
        >
          Kurslar
        </Link>
        <span className="text-[#232324]/20">/</span>
        <Link
          href={`/kurslar/${kategoriya}`}
          className="text-[#7ea2d4] hover:text-[#5b87c0] capitalize transition-colors"
        >
          {catName}
        </Link>
        <span className="text-[#232324]/20">/</span>
        <span className="text-[#232324]/40 capitalize">{title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="inline-flex px-3 py-1 rounded-lg bg-[#7ea2d4]/10 text-[13px] font-medium text-[#7ea2d4] capitalize mb-4">
              {catName}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#232324] tracking-tight capitalize">
              {title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-5">
              {[
                { icon: Star, text: "Yangi" },
                { icon: MapPin, text: "Toshkent" },
                { icon: Clock, text: "3 oy" },
                { icon: Globe, text: "O'zbek" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-[14px] text-[#232324]/50"
                >
                  <Icon className="h-4 w-4" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="p-8 rounded-2xl bg-white border border-[#e8ecef]">
            <h2 className="text-[18px] font-semibold text-[#232324] mb-4">
              Kurs haqida
            </h2>
            <p className="text-[15px] text-[#232324]/50 leading-relaxed">
              Kurs ma&apos;lumotlari yuklanmoqda...
            </p>
          </div>

          {/* Reviews */}
          <div className="p-8 rounded-2xl bg-white border border-[#e8ecef]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-semibold text-[#232324]">
                Sharhlar
              </h2>
              <div className="flex items-center gap-1.5 text-[14px] text-[#232324]/40">
                <Users className="h-4 w-4" />0 ta sharh
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-[#e8ecef]">
              <p className="text-[15px] text-[#232324]/30">
                Hozircha sharhlar yo&apos;q
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Price Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#e8ecef]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-[#232324]">
                  Bepul
                </span>
              </div>
              <div className="inline-flex px-2.5 py-1 rounded-lg bg-green-50 text-[12px] font-medium text-green-600 mt-2">
                Bo&apos;sh joy bor
              </div>
            </div>

            {/* Lead Form */}
            <div className="p-6 rounded-2xl bg-white border border-[#e8ecef]">
              <h3 className="text-[16px] font-semibold text-[#232324] mb-5">
                Bog&apos;lanish
              </h3>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-[13px] text-[#232324]/50 mb-1.5"
                  >
                    Ismingiz
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ismingizni kiriting"
                    className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-[13px] text-[#232324]/50 mb-1.5"
                  >
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+998 90 123 45 67"
                    className="rounded-xl h-11 border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="message"
                    className="text-[13px] text-[#232324]/50 mb-1.5"
                  >
                    Izoh
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Qo'shimcha izoh (ixtiyoriy)"
                    className="rounded-xl border-[#e8ecef] focus-visible:ring-[#7ea2d4]/30 min-h-[80px]"
                  />
                </div>
                <Button className="w-full h-12 rounded-xl gradient-accent border-0 text-white text-[15px] font-medium shadow-sm hover:shadow-md transition-shadow">
                  <Send className="h-4 w-4 mr-2" />
                  Murojaat yuborish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
