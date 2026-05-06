import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq-item";

const SITE_URL = process.env.AUTH_URL ?? "https://darslinker.uz";
const url = `${SITE_URL}/blog/kursni-qanday-tanlash-7-mezon`;

export const metadata: Metadata = {
  title: "Kursni qanday to'g'ri tanlash kerak: 7 mezon 2026 | Darslinker",
  description:
    "Kurs tanlashda yo'l qo'yiladigan 7 ta asosiy mezon: format, narx, o'qituvchi, sertifikat, joylashuv, sharhlar, demo. O'zbekiston bozori uchun amaliy maslahatlar.",
  alternates: { canonical: url },
  openGraph: { type: "article", locale: "uz_UZ", url, siteName: "Darslinker.uz" },
};

const faqs = [
  { q: "Kurs tanlashda eng muhim mezon nima?", a: "O'qituvchi kvalifikatsiyasi va metodika. Boshqa hamma narsa shu ikkitasidan keyin keladi — chunki yomon o'qituvchi yaxshi narxda ham natija bermaydi." },
  { q: "Onlayn yoki offline kurs — qaysisi yaxshi?", a: "Bola yoki kichik yoshdagi o'quvchilar uchun offline tavsiya. Kattalar va o'z-o'zini boshqaradiganlar uchun onlayn ham bir xil samara beradi va arzonroq." },
  { q: "Kurs narxi qanday tekshiriladi?", a: "Bir nechta markazning narxlarini solishtirish (Darslinker filtri orqali oson). Shuningdek 'oylik to'lov' va 'kursning umumiy narxi' farqini aniqlash kerak — ko'p markazlar oylik narxni reklama qiladi, lekin umumiy summa qiyosda yuqoriroq bo'ladi." },
  { q: "Sertifikat haqiqatdan kerakmi?", a: "Maqsadga qarab. CV uchun yoki rasmiy talab bo'lgan joyda — kerak. Faqat ko'nikma o'rganish uchun — ahamiyatsiz. Yolg'on 'xalqaro sertifikat' va'dasidan ehtiyot bo'ling." },
  { q: "Demo darsi bepulligi muhimmi?", a: "Ha. Bepul demo — markaz o'z metodikasiga ishonchini ko'rsatadi. Demo bermayotgan markazlardan ehtiyot bo'lish kerak — ehtimol, sifatga ishonchsiz." },
  { q: "Sharhlarga qanchalik ishonish mumkin?", a: "Ko'p sharh + yangi sharh — ishonchli. Faqat 5-yulduz va 'eng zo'r' tipidagi sharhlar — fake. Shu markazning Telegram chatlariga qarang yoki o'quvchilarni topib so'rang." },
  { q: "Bir kursni qancha vaqtga olish kerak?", a: "Ingliz tili: 6-12 oy. IT bootcamp: 4-9 oy. Boshqa kasbiy: 3-6 oy. Qisqaroq va'da qiluvchi 'tezkor' kurslardan ehtiyot bo'ling — odatda sayoz." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Kursni qanday to'g'ri tanlash: 7 mezon 2026",
      datePublished: "2026-05-04",
      dateModified: "2026-05-04",
      author: { "@type": "Organization", name: "Darslinker.uz" },
      publisher: { "@type": "Organization", name: "Darslinker.uz", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` } },
      mainEntityOfPage: url,
    },
    { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

const criteria = [
  { num: 1, title: "Format: onlayn, offline yoki aralash?", body: "Kurs formatini tanlash o'rganish samaradorligiga to'g'ridan-to'g'ri ta'sir qiladi.", points: ["Offline — bola va o'smirlar uchun, jonli amaliyot va disciplina kerak bo'lganlar uchun", "Onlayn — ishlayotganlar va boshqa shahardan qatnashmoqchilar uchun (~30-50% arzonroq)", "Aralash (gibrid) — eng moslashuvchan, lekin har joyda yo'q"] },
  { num: 2, title: "Narx va qiymat o'rtasidagi nisbat", body: "Eng arzon — har doim ham eng yomon emas. Eng qimmat — har doim ham eng yaxshi emas.", points: ["O'rtacha narxlar 2026: ingliz tili 400k-1.5M so'm/oy, IT bootcamp 1.5M-5M so'm/oy", "Bir nechta markazning narxini solishtiring — Darslinker filtrida bir oynada ko'rinadi", "'Oylik narx' vs 'umumiy summa' — qaysi biri reklama qilinmoqda, tekshiring"] },
  { num: 3, title: "O'qituvchi kvalifikatsiyasi va tajribasi", body: "Eng muhim mezon. Yomon o'qituvchi yaxshi narxda ham natija bermaydi.", points: ["O'qituvchining LinkedIn yoki ish tajribasini so'rang (uyaltirmang)", "Til o'qituvchisi uchun: o'qituvchi qaysi sertifikatga ega? IELTS bali nimaga teng?", "IT o'qituvchisi uchun: real ish tajribasi bormi? Qaysi loyihalarda ishlagan?"] },
  { num: 4, title: "Sertifikat va dasturning rasmiyligi", body: "Sertifikat har doim kerak emas, lekin bo'lganda kuchli va tan olingan bo'lishi shart.", points: ["Kuchli sertifikatlar (O'zbekistonda tan olingan): IELTS, TOEFL — chet elga; DTM — mahalliy oliy ta'lim; Goethe-Zertifikat — nemis tili; Google va Microsoft kasbiy sertifikatlari — IT; Coursera Specializations — xalqaro CV uchun", "Yolg'on sertifikatlar: 'xalqaro sertifikat' (qaysi?), 'jahon standarti' (kim tomonidan?), markazning o'z 'sertifikati'", "CV yoki universitetga ishlatmoqchi bo'lsangiz — sertifikatning rasmiy maqomini va shu tashkilot saytini tekshiring"] },
  { num: 5, title: "Joylashuv (offline uchun) yoki platforma sifati (onlayn uchun)", body: "Kurs sifati strukturada ham — qulay yetib borish ham, texnik to'siqlarsiz darslar ham muhim.", points: ["Offline: uydan/ishdan 30 daq.dan ortiq yo'l — chiqib ketish ehtimoli oshadi", "Onlayn: Zoom, Google Meet — yaxshi. Faqat Telegram orqali — sifat past", "Maxsus o'rgatuvchi platformalar (LMS) — qo'shimcha vositalar bilan, sifatli signal"] },
  { num: 6, title: "Real sharhlar va o'quvchilar fikri", body: "Lekin sharhlarni o'qish — alohida ko'nikma. Hammasi haqiqiy emas.", points: ["Faqat 5-yulduz va emoji bilan to'la sharhlar — odatda fake", "Aralash sharhlar (4 va 3 yulduz, real izoh) — ishonchli signal", "Markazning Telegram chatiga kirib o'quvchilar bilan gaplashing"] },
  { num: 7, title: "Bepul demo darsi va sinov muddati", body: "Markaz o'z metodikasiga ishonchining eng aniq belgisi.", points: ["Bepul 1 ta demo — minimal standart 2026 da", "1-2 hafta sinov muddati — premium markazlar buni taklif qiladi", "Demo bermaslik — sifatga ishonchsizlik signali, ehtiyot bo'ling"] },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="bg-white min-h-screen">
        <article className="max-w-[760px] mx-auto px-5 md:px-6 py-10 md:py-14">
          <nav className="text-[13px] text-[#7c8490] mb-5">
            <Link href="/" className="hover:text-[#16181a]">Asosiy</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-[#16181a]">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-[#16181a]">Kurs tanlash mezonlari</span>
          </nav>

          <header className="mb-8">
            <div className="text-[12px] text-[#7c8490] mb-2">Yangilangan: 2026-05</div>
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#16181a] leading-tight tracking-tight">
              Kursni qanday to&apos;g&apos;ri tanlash kerak: 7 ta mezon 2026
            </h1>
          </header>

          {/* TLDR */}
          <section className="mb-10 bg-[#f8f9fa] border-l-4 border-[#7ea2d4] rounded-r-[10px] p-5">
            <h2 className="text-[12px] font-semibold text-[#7c8490] uppercase tracking-wider mb-2">Qisqacha javob</h2>
            <p className="text-[16px] text-[#16181a] leading-relaxed">
              Kurs tanlashda 7 ta mezonga e&apos;tibor bering: <strong>format, narx, o&apos;qituvchi, sertifikat, joylashuv, sharhlar va demo darsi</strong>. Eng muhimi — o&apos;qituvchi kvalifikatsiyasi. Birinchi marta tanlayotgan bo&apos;lsangiz — har doim bepul demo so&apos;rang.
            </p>
          </section>

          {/* Why this matters */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Nega bu mezonlar muhim?</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              O&apos;zbekistonda har yili o&apos;n minglab odam noto&apos;g&apos;ri kurs tanlashi sababli vaqt va pulni yo&apos;qotadi. 6-12 oy davomida 4-15 million so&apos;m sarflaganidan keyin natija olmasdan ketish — odatiy holat.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              Quyidagi 7 mezon — bu xatoni oldini olishga yordam beradi. Har birini alohida tekshiring, va minimum 5 mezonga &quot;ha&quot; deb javob bera oladigan markazni tanlang.
            </p>
          </section>

          {/* 7 Criteria */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-5">7 ta asosiy mezon</h2>
            <div className="space-y-8">
              {criteria.map((c) => (
                <div key={c.num} className="border-l-4 border-[#16181a] pl-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-[#16181a] text-white text-[14px] font-bold flex items-center justify-center">
                      {c.num}
                    </span>
                    <h3 className="text-[19px] md:text-[22px] font-bold text-[#16181a]">{c.title}</h3>
                  </div>
                  <p className="text-[15px] text-[#16181a]/75 leading-relaxed mb-3 ml-11">{c.body}</p>
                  <ul className="space-y-2 ml-11">
                    {c.points.map((p, i) => (
                      <li key={i} className="text-[14.5px] text-[#16181a]/80 flex items-start gap-2">
                        <span className="text-[#7ea2d4] mt-1">▸</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Common mistakes */}
          <section className="mb-10 bg-red-50 border border-red-100 rounded-[12px] p-5">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Eng ko&apos;p uchraydigan 3 xato</h2>
            <ol className="space-y-2.5 text-[15px] text-[#16181a]/80">
              <li><strong className="text-[#16181a]">1. Faqat narx bilan tanlash</strong> — eng arzon kurs ko&apos;pincha eng katta yo&apos;qotish: yomon o&apos;qituvchi vaqtni yo&apos;q qiladi.</li>
              <li><strong className="text-[#16181a]">2. Reklamaga qarab tanlash</strong> — Instagram&apos;da chiroyli reklama ≠ sifatli kurs. O&apos;quvchilar bilan gaplashish — eng halol baholash.</li>
              <li><strong className="text-[#16181a]">3. Demo darsisiz qaror qilish</strong> — markaz va o&apos;qituvchining real uslubini ko&apos;rmasdan to&apos;lash — eng risksli yo&apos;l.</li>
            </ol>
          </section>

          {/* Practical tips with internal links */}
          <section className="mb-10">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-3">Amaliy yondashuv</h2>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed mb-3">
              Yuqoridagi 7 mezonni amalda qo&apos;llash uchun bir nechta variantlarni yonma-yon solishtiring. Bir oynada bir nechta markazning narxi, formati va metodikasini ko&apos;rish — eng tezkor yo&apos;l.
            </p>
            <p className="text-[15.5px] text-[#16181a]/75 leading-relaxed">
              <Link href="/kurslar" className="text-[#7ea2d4] hover:underline">Darslinker katalogida</Link> filtrlash orqali siz birdaniga 5-10 ta markazni qiyoslay olasiz. Yoki to&apos;g&apos;ridan-to&apos;g&apos;ri{" "}
              <Link href="/joylar" className="text-[#7ea2d4] hover:underline">o&apos;z hududingizdagi markazlar</Link>ni ko&apos;ring.
            </p>
          </section>

          {/* External authority links */}
          <section className="mb-10">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#16181a] mb-3">Foydali manbalar</h2>
            <ul className="space-y-2 text-[14.5px] text-[#16181a]/80">
              <li>▸ <a href="https://www.britishcouncil.uz" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">British Council O&apos;zbekiston</a> — IELTS va Cambridge sertifikatlari haqida rasmiy ma&apos;lumot</li>
              <li>▸ <a href="https://www.coursera.org" target="_blank" rel="noreferrer noopener" className="text-[#7ea2d4] hover:underline">Coursera</a> — xalqaro tasdiqlangan kasbiy sertifikatlar (LinkedIn&apos;da ko&apos;rsatish mumkin)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[22px] md:text-[26px] font-bold text-[#16181a] mb-4">Tez-tez beriladigan savollar</h2>
            <FaqList items={faqs} />
          </section>

          <section className="border-t border-[#e4e7ea] pt-10">
            <p className="text-[15.5px] text-[#16181a]/75 mb-4">
              Yuqoridagi 7 mezon bo&apos;yicha kursni tanlash uchun avval bir nechta variantni yonma-yon ko&apos;ring:
            </p>
            <Link
              href="/kurslar"
              className="inline-flex items-center gap-2 bg-[#16181a] hover:bg-[#16181a]/90 text-white rounded-[12px] px-6 py-3.5 text-[15px] font-semibold transition-colors"
            >
              Mezonlarga mos kurslarni Darslinker&apos;da ko&apos;rish →
            </Link>
          </section>
        </article>
      </main>
    </>
  );
}
