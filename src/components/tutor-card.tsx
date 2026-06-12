import Link from "next/link";
import { Star, ArrowRight, Video, MapPin, UserCheck } from "lucide-react";
import { type FakeTutor, tutorInitials } from "@/data/fake-tutors";

export function TutorCard({ t }: { t: FakeTutor }) {
  return (
    <Link href="/kurslar" className="group block w-full h-full bg-white rounded-[20px] border border-[#e4e7ea] p-5 hover:shadow-lg hover:shadow-black/5 hover:border-fuchsia-300 transition-all">
      {/* Avatar + name */}
      <div className="flex items-center gap-3.5">
        <div className="relative shrink-0">
          <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-[20px] font-bold text-white" style={{ background: t.gradient }}>
            {tutorInitials(t.name)}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-fuchsia-600 border-2 border-white flex items-center justify-center" title="Tekshirilgan">
            <UserCheck className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[16px] font-bold text-[#16181a] truncate">{t.name}</div>
          <div className="text-[12.5px] font-medium text-fuchsia-700 truncate mt-0.5">{t.subject}</div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mt-4">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="text-[13px] font-bold text-[#16181a]">{t.rating.toFixed(1)}</span>
        <span className="text-[12px] text-[#7c8490]">({t.reviews} sharh)</span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#16181a]/70 bg-[#f2f4f5] rounded-full px-2.5 py-1">
          {t.online ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
          {t.region}
        </span>
        <span className="inline-flex items-center text-[11.5px] font-medium text-[#16181a]/70 bg-[#f2f4f5] rounded-full px-2.5 py-1">
          {t.experience} yil tajriba
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[#f2f4f5]">
        <div>
          <span className="text-[16px] font-extrabold text-[#16181a]">{t.price.toLocaleString("ru-RU")}</span>
          <span className="text-[12px] text-[#7c8490]"> so&apos;m/soat</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-fuchsia-50 text-fuchsia-700 flex items-center justify-center group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
