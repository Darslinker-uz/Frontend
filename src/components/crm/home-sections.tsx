import { ArrowRight } from "lucide-react";
import { FaqList } from "@/components/faq-item";
import { CrmApplyButton } from "@/components/crm/crm-apply";
import { HomeHero } from "@/components/crm/home-hero";
import { ProblemsSection } from "@/components/crm/problems-section";
import { WhyDarslinker } from "@/components/crm/why-darslinker";
import { FeaturesExplorer } from "@/components/crm/features-explorer";
import { PricingSection } from "@/components/crm/pricing-section";
import { StartSteps } from "@/components/crm/start-steps";
import { PLANS, FAQS } from "@/lib/crm-content";

// Bosh sahifaning barcha bo'limlari (hero'dan yakuniy CTA'gacha) — bitta manba.
// Bosh sahifa (/) shu komponentni ishlatadi.
// Tariflar va FAQ — src/lib/crm-content.ts (bosh sahifa ulardan JSON-LD ham quradi).

export function HomeSections() {
  return (
    <>
        <HomeHero />

        {/* MARKAZNING TO'RT ASOSIY MUAMMOSI */}
        <ProblemsSection />

        {/* NIMA UCHUN DARSLINKER — boshqa CRM'lardan farqi */}
        <WhyDarslinker />

        {/* DARSLINKER IMKONIYATLARI */}
        <FeaturesExplorer />

        {/* TARIFLAR */}
        <PricingSection plans={PLANS} moreLink />

        {/* QANDAY BOSHLANADI — tariflardan keyin, "sinab ko'rsam nima bo'ladi?" savoliga javob */}
        <StartSteps />

        {/* FAQ */}
        <section id="savollar" className="scroll-mt-20 max-w-[1600px] mx-auto px-5 md:px-20 py-14 md:py-20">
          <div className="bg-white rounded-[20px] p-6 md:p-10 border border-[#e4e7ea]">
            <h2 className="text-[24px] md:text-[32px] font-bold tracking-[-0.03em]">Ko&apos;p so&apos;raladigan savollar</h2>
            <div className="mt-6">
              <FaqList items={FAQS} />
            </div>
          </div>
        </section>

        {/* YAKUNIY CTA */}
        <section className="max-w-[1600px] mx-auto px-5 md:px-20 pb-16 md:pb-24">
          <div className="rounded-[24px] bg-[#1e2024] text-white p-8 md:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-center overflow-hidden">
            <div>
              <h2 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] leading-tight">
                Markazingizni bugun tizimga o&apos;tkazing
              </h2>
              <p className="mt-3 text-[15px] md:text-[17px] text-white/60 max-w-[520px]">
                14 kun bepul sinov, karta kerak emas. O&apos;quvchilar ro&apos;yxatini Excel&apos;dan ko&apos;chirishda yordam beramiz.
              </p>
            </div>
            <CrmApplyButton refSource="home" className="h-[56px] px-8 rounded-[14px] bg-white text-[#16181a] text-[16px] font-semibold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2">
              Bepul sinab ko&apos;rish <ArrowRight className="w-4 h-4" />
            </CrmApplyButton>
          </div>
        </section>
    </>
  );
}
