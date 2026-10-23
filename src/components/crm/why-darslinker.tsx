import Image from "next/image";

// "Boshqa CRM'lardan farqi" — Darslinker'ni ajratib turadigan 4 ta asosiy yechim (PRODUCT.md, 1 va 5-bo'lim).
// Gamifikatsiyada faqat MVP'dagi narsa (jonli quiz, reyting) "bor" deb aytiladi; XP va AI quiz — "tez orada".
const FEATURES = [
  {
    title: "Qulay boshqaruv",
    text: "O‘quvchi, guruh, davomat, to‘lov va lidlar — bitta tizimda. Har xodim faqat o‘z bo‘limini ko‘radi, telefondan ham ishlaydi.",
    image: "/images/features/why-management-3d-v1.png",
  },
  {
    title: "Gamifikatsiya",
    text: "Jonli quiz va reyting darsni o‘yinga aylantiradi — o‘quvchi zerikmaydi.",
    image: "/images/features/why-gamification-3d-v1.png",
  },
  {
    title: "Ota-onaga xabar",
    text: "Kelmadi, qarzdorlik, to‘lov tasdig‘i — Telegram orqali avtomatik. Pullik SMS kerak emas.",
    image: "/images/features/why-messages-3d-v1.png",
  },
  {
    title: "Do‘stona support",
    text: "Markazingizga kerakli imkoniyat yo‘qmi? Ayting — muammongizni o‘rganib, tizimga yangi imkoniyat qo‘shishga tayyormiz.",
    image: "/images/features/why-support-3d-v1.png",
  },
];

// "Zigzag" ko'rinishi (mobil va desktop): har yechim brend ko'kidagi karta, 3D rasm kartaning yuqori
// burchagidan chiqib turadi — mobil/planshetda navbat bilan o'ngda va chapda, desktop'da (lg+) hammasi
// o'ng tepada; fonda katta xira raqam (rasmning qarama-qarshi tomonida).
export function WhyDarslinker() {
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-[1600px] px-5 py-14 md:px-20 md:py-20">
      <div className="px-1 pb-6 md:pb-8">
        <h2 id="why-title" className="max-w-[680px] text-[28px] font-semibold leading-[1.15] tracking-[-0.035em] text-[#16181a] md:text-[42px]">Nega aynan Darslinker?</h2>
      </div>
      <ol className="grid gap-5 sm:grid-cols-2 xl:gap-7">
        {FEATURES.map((f, i) => {
          const right = i % 2 === 0;
          return (
            <li key={f.title} className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#5b87c0] px-5 pb-6 pt-[124px] shadow-[0_20px_40px_-28px_rgba(22,24,26,0.5)] sm:px-6 xl:min-h-[320px] xl:px-8 xl:pb-8 xl:pt-[156px]">
              {/* 3D ikonka karta ichida, yuqori burchakda: mobil/planshetda zigzag (navbat bilan o'ng/chap),
                  desktop'da (lg+) hammasi o'ng tepada. Ikonkalar 3:2 nisbatda, chetida shaffof halo bor —
                  shuning uchun quti biroz kengroq; matn ikonka ostidan boshlanadi, raqam qarama-qarshi burchakda. */}
              <div aria-hidden="true" className={`absolute top-3 h-[104px] w-[156px] opacity-50 drop-shadow-[0_14px_18px_rgba(22,24,26,0.25)] xl:top-4 xl:h-[132px] xl:w-[198px] ${right ? "right-2" : "left-2 lg:left-auto lg:right-2"}`}>
                <Image src={f.image} alt="" fill sizes="(min-width: 1280px) 198px, 156px" className="object-contain" />
              </div>
              <span aria-hidden="true" className={`absolute top-5 text-[56px] font-bold leading-none tracking-[-0.04em] text-white/[0.14] xl:top-7 xl:text-[64px] ${right ? "left-5 xl:left-8" : "right-5 lg:right-auto lg:left-5 xl:left-8"}`}>0{i + 1}</span>
              <h3 className="text-[24px] font-semibold leading-tight tracking-[-0.03em] text-white xl:text-[28px]">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/[0.82] xl:mt-3 xl:text-[16px]">{f.text}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
