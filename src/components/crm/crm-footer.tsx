import Link from "next/link";
import { DarslinkerLogo } from "@/components/ui/darslinker-logo";
import { CRM_HOME } from "@/lib/crm-pages";

const links = [
  { href: `${CRM_HOME}#imkoniyatlar`, label: "Imkoniyatlar" },
  { href: `${CRM_HOME}#narxlar`, label: "Tariflar" },
  { href: `${CRM_HOME}#boshlash`, label: "Qanday boshlanadi" },
  { href: `${CRM_HOME}#savollar`, label: "Savollar" },
];

export function CrmFooter() {
  return (
    <footer className="mt-auto border-t border-[#e4e7ea] bg-white">
      <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-20 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-16">
          <div>
            <Link href={CRM_HOME} className="inline-flex items-center gap-2.5" aria-label="Darslinker bosh sahifa">
              <DarslinkerLogo size={32} animated={false} />
              <span className="text-[24px] font-bold tracking-tight text-[#16181a]">
                Dars<span className="text-[#7ea2d4]">Linker</span>
              </span>
            </Link>
            <p className="mt-4 max-w-[360px] text-[15px] leading-relaxed text-[#5d6672]">
              O&apos;quv markazlari uchun interaktiv CRM va LMS platformasi.
            </p>
            <p className="mt-2 max-w-[360px] text-[14px] leading-relaxed text-[#7c8490]">
              O&apos;quvchilar, guruhlar, davomat, to&apos;lov va qarzdorlik — bitta tizimda.
            </p>
          </div>
          <nav aria-label="CRM va LMS havolalari">
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-[#7c8490]">Platforma</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-[#5d6672] transition-colors hover:text-[#16181a]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-[#7c8490]">Qo&apos;llab-quvvatlash</h3>
            <p className="max-w-[280px] text-[14px] leading-relaxed text-[#5d6672]">
              Platformani ishga tushirish yoki tarif tanlash bo&apos;yicha savolingiz bormi?
            </p>
            <a href="https://t.me/Darslinker_Support" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-[14px] font-semibold text-[#5b87c0] transition-colors hover:text-[#16181a]">
              Telegram orqali bog&apos;lanish
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-[#e4e7ea] pt-6">
          <p className="text-[13px] text-[#7c8490]">
            &copy; {new Date().getFullYear()} Darslinker. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}
