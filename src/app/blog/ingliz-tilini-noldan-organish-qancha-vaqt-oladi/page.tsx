import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const site = "https://darslinker.uz";
const slug = "ingliz-tilini-noldan-organish-qancha-vaqt-oladi";
const url = `${site}/blog/${slug}`;
const title = "Ingliz tilini 0 dan o‘rganish qancha vaqt oladi?";
const description = "Ingliz tilini noldan o‘rganish muddati: A1–B2 uchun soatlar, haftalik jadval hisobi va 2026-yilda AI bilan mashq qilishning imkoniyatlari.";
const cover = "/images/blog-covers/ingliz-tilini-noldan-organish-1600x900.png";
const cambridge = "https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours";
const britishCouncil = "https://www.britishcouncil.org/about/press/british-council-launches-aibc-human-first-ai-engine-transforming-english-language";

export const metadata: Metadata = {
  title: { absolute: `${title} | Darslinker.uz` },
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "article", locale: "uz_UZ", siteName: "Darslinker.uz", url, title, description,
    publishedTime: "2026-09-17", modifiedTime: "2026-09-17",
    images: [{ url: `${site}${cover}`, width: 1600, height: 900, alt: "Harflar tushirilgan ko‘k metr savol belgisi shaklida — til o‘rganish muddatining ramzi" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${site}${cover}`] },
};

const faqs = [
  { q: "Ingliz tilini 3 oyda o‘rganish mumkinmi?", a: "Uch oyda qaysi natijani kutayotganingiz muhim. Noldan boshlagan o‘quvchining sodda gaplar tuzishi bilan murakkab suhbatda erkin qatnashishi boshqa-boshqa maqsadlar. Darajangiz, dars jadvali va amaliy topshiriqlaringiz aniqlanmasdan uch oylik natijani va’da qilish to‘g‘ri emas." },
  { q: "Kuniga 30 daqiqa yetadimi?", a: "Boshlash va muntazam mashq qilish uchun qulay vaqt bo‘lishi mumkin. Bu haftasiga 3,5 soat. Lekin yarim soat video tomosha qilish bilan ustoz tekshiradigan topshiriq bajarish bir xil mashg‘ulot emas. Vaqt bilan birga mashq turini ham rejalang." },
  { q: "AI bilan ustozsiz o‘rganish mumkinmi?", a: "AI yordamida suhbatni mashq qilish va izoh olish mumkin. Ammo uning javobi yoki daraja bahosi doim to‘g‘ri bo‘lavermaydi. Ayniqsa boshlanishida dastur va xatolaringizni malakali o‘qituvchi bilan tekshirib borish foydali." },
  { q: "Noldan IELTSga tayyorlanish uchun qancha vaqt kerak?", a: "Avval umumiy ingliz tili darajasi, keyin kerakli IELTS bali va imtihon ko‘nikmalari baholanadi. B2 darajaga chiqishning o‘zi aniq IELTS balini kafolatlamaydi. Boshlang‘ich diagnostika va sinov imtihoni asosida shaxsiy reja tuzing." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting", "@id": `${url}#article`, headline: title, description,
      mainEntityOfPage: url, inLanguage: "uz-UZ", datePublished: "2026-09-17", dateModified: "2026-09-17",
      image: { "@type": "ImageObject", url: `${site}${cover}`, width: 1600, height: 900 },
      author: { "@type": "Organization", name: "Darslinker.uz", url: site },
      publisher: { "@type": "Organization", name: "Darslinker.uz", url: site, logo: { "@type": "ImageObject", url: `${site}/icon-512.png` } },
      citation: [cambridge, britishCouncil],
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Asosiy", item: site },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ] },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-[960px] px-5 py-10 md:px-8 md:py-14">
        <nav aria-label="Sahifa yo‘li" className="mb-6 flex flex-wrap gap-2 text-sm text-[#7c8490]">
          <Link href="/">Asosiy</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>Ingliz tilini o‘rganish muddati</span>
        </nav>
        <header className="mx-auto mb-7 max-w-[760px]">
          <p className="mb-3 text-sm text-[#7c8490]">Darslinker.uz · <time dateTime="2026-09-17">17-sentabr, 2026</time></p>
          <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight md:text-[46px]">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#59616c]">Tilni metr bilan o‘lchab bo‘lmaydi. Ammo o‘qish uchun ajratadigan vaqtingizni hisoblash mumkin — avval qayergacha yetmoqchi ekaningizni bilsangiz.</p>
        </header>
        <figure className="mb-10">
          <Image src={cover} alt="Ingliz harflari tushirilgan ko‘k o‘lchov lentasi savol belgisi shaklida" width={1600} height={900} sizes="(max-width: 960px) 100vw, 896px" loading="eager" fetchPriority="high" className="h-auto w-full rounded-2xl" />
        </figure>
        <div className="mx-auto max-w-[760px] space-y-10 text-[17px] leading-[1.85] [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_p+p]:mt-4 [&_a]:text-[#426a9e] [&_a]:underline [&_a]:underline-offset-4 [&_li]:mb-2">
          <section aria-labelledby="short-answer" className="rounded-xl bg-[#e8f0f9]/60 p-5 md:p-6">
            <h2 id="short-answer">Qisqa javob</h2>
            <p>Noldan ingliz tili o‘rganishning hammaga bir xil muddati yo‘q. Cambridge yo‘riqnomasida A1 uchun taxminan <strong>90–100 soat</strong>, B1 uchun <strong>350–400 soat</strong>, B2 uchun <strong>500–600 soat</strong> yo‘naltirilgan ta’lim ko‘rsatilgan. Bular boshlang‘ich nuqtadan jami soatlar, kafolatlangan muddat emas. Haftasiga 10 soat shu turdagi ta’lim olinsa, B1 hisobi 35–40 hafta chiqadi. <a href={cambridge}>Manba: Cambridge English.</a></p>
          </section>
          <section>
            <h2>“Ingliz tilini bilish” siz uchun nimani anglatadi?</h2>
            <p>Sayohatda oddiy savol berish, mijoz bilan ish haqida gaplashish va universitetdagi inglizcha ma’ruzani tushunish bir xil vazifa emas. “Olti oy o‘qiyman” deyishdan oldin, shu muddat oxirida nima qila olishni xohlashingizni yozing.</p>
            <p>Masalan: “O‘zim va ishim haqida tarjimonsiz gapirib beraman”, “Mijozning qisqa xatiga javob yozaman” yoki “Inglizcha suhbatdagi asosiy fikrni tushunaman”. Shunday maqsad bilan ustozga murojaat qilsangiz, o‘qish rejasini muhokama qilish ancha osonlashadi.</p>
            <p>Maktabda til o‘qigan, ayrim so‘zlarni taniydigan odam har doim ham mutlaq noldan boshlamaydi. Lekin testdagi to‘g‘ri javoblar gapirish darajasini to‘liq ko‘rsatmaydi. Dastlabki baholashda tinglash, gapirish, o‘qish va yozishga ham qarang.</p>
          </section>
          <section>
            <h2>A1 dan B2 gacha: soatni oyga qanday aylantiramiz?</h2>
            <p>Quyidagi soatlar Cambridge’ning boshlovchilar uchun taxminiy ko‘rsatkichlari. “Yo‘naltirilgan ta’lim” dars va nazorat ostidagi o‘qishni bildiradi. Telefonda inglizcha video ochiq turishini shu soatlarga tenglashtirmang.</p>
            <div className="overflow-x-auto rounded-xl border border-[#e5e8eb]">
              <table className="w-full min-w-[480px] text-left text-sm leading-relaxed">
                <caption className="p-3 text-left text-[#59616c]">Noldan boshlab jami ta’lim soati va shartli jadval hisobi</caption>
                <thead className="bg-[#e8f0f9]"><tr>{["Maqsad", "Jami soat", "5 soat/hafta", "10 soat/hafta"].map(h => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
                <tbody>{[["A1", "90–100", "18–20 hafta", "9–10 hafta"], ["A2", "180–200", "36–40 hafta", "18–20 hafta"], ["B1", "350–400", "70–80 hafta", "35–40 hafta"], ["B2", "500–600", "100–120 hafta", "50–60 hafta"]].map(row => <tr key={row[0]} className="border-t border-[#e5e8eb]"><th scope="row" className="p-3">{row[0]}</th>{row.slice(1).map(cell => <td key={cell} className="p-3">{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <p className="!mt-3 text-sm text-[#59616c]">Haftalar — soatlarni haftalik yuklamaga bo‘lishdan olingan tahririy hisob; individual prognoz emas. Ta’til, tanaffus va qayta ishlash vaqti qo‘shilmagan. <a href={cambridge}>Asl jadval va izohlar.</a></p>
            <p>B1 uchun 35–40 hafta taxminan 8–9 oy, B2 uchun 50–60 hafta esa 12–14 oy bo‘ladi. Bu hisobdagi 10 soatni amalda har hafta ajratish kerak. Bir oy juda faol o‘qib, keyingi oy tanaffus qilsangiz, kalendardagi muddat o‘zgaradi.</p>
          </section>
          <section>
            <h2>2026-yilda nima o‘zgardi: AI vaqtni qisqartiradimi?</h2>
            <p>Besh yil oldin ham onlayn dars, video va elektron lug‘at bor edi. Bugungi farqni faqat “endi hammasi internetda” deb tushuntirish yetarli emas. Suhbatga javob qaytaradigan va mashqdan keyin izoh beradigan AI vositalari dars oralig‘idagi amaliyot uchun yangi imkoniyat yaratdi.</p>
            <p>Masalan, British Council 2025-yil 30-oktabrda AiBC tizimini e’lon qildi: u o‘quvchiga suhbat mashqlari va grammatika, so‘z ishlatish hamda nutq ravonligi bo‘yicha tezkor fikr-mulohaza berishga mo‘ljallangan. Bu ustoz bilan darsni qo‘shimcha mashq bilan davom ettirish misoli. <a href={britishCouncil}>British Council e’loni.</a></p>
            <p>Shundan “500 soatlik o‘qish endi 100 soat bo‘ldi” degan xulosa chiqmaydi. Muhim savol: yangi vosita sizni ko‘proq gapirishga undayaptimi yoki javobni sizning o‘rningizga yozib beryaptimi?</p>
            <p>Amaliy mashq sifatida A1 darajasida tanishuv suhbatini so‘rang. Avval o‘zingiz javob bering, keyin xatoni tushuntirishni va savolni qayta berishni so‘rang. Tushunarsiz yoki shubhali tuzatishni ustoz bilan tekshiring. AI bergan bahoni rasmiy daraja sertifikati deb qabul qilmang.</p>
          </section>
          <section>
            <h2>Ish yoki o‘qish bilan birga qanday jadval tuzsa bo‘ladi?</h2>
            <p>Shartli misol: haftada uch marta 90 daqiqalik kurs — 4,5 soat dars. Besh kun 30 daqiqadan mustaqil mashq qo‘shsangiz, taqvimingizda yana 2,5 soat ajratilgan bo‘ladi. Jami 7 soat bandlik chiqadi, ammo mustaqil mashqning har bir soati yuqoridagi yo‘naltirilgan ta’lim soatiga avtomatik teng emas.</p>
            <ul className="list-disc pl-5">
              <li><strong>Dars kuni:</strong> o‘tilgan mavzudagi bir nechta gapni o‘zingiz tuzing, tayyor misolni ko‘chirish bilan cheklanmang.</li>
              <li><strong>Dars bo‘lmagan kuni:</strong> darajangizga mos qisqa audioni tinglang, tushunganingizni ovoz chiqarib ayting.</li>
              <li><strong>Hafta oxirida:</strong> bir xil mavzuda qisqa ovozli yozuv qiling va oldingi yozuvingiz bilan solishtiring. Qaysi xato takrorlanayotganini ustozdan so‘rang.</li>
            </ul>
            <p>Toshkentda yoki boshqa shaharda oflayn kurs tanlasangiz, qatnovni ham jadvalga kiriting. Darsga borib-kelishga ketadigan vaqt uy vazifasini siqib chiqarmasin. Onlayn formatda esa internetdan tashqari ovoz chiqarib gapira oladigan tinch joy kerak.</p>
          </section>
          <section>
            <h2>Kurs tanlayotganda muddatdan tashqari nimani so‘rash kerak?</h2>
            <p>“Bir daraja uch oy” degan taklifni eshitsangiz, shu davrdagi dars soati va bosqichdan o‘tish shartini aniqlashtiring. Guruhda qancha odam borligi, gapirishga navbat yetishi va vazifangizni kim tekshirishi ham tanlovning bir qismi.</p>
            <ol className="list-decimal pl-5">
              <li>Boshlang‘ich darajam qanday tekshiriladi?</li>
              <li>Bir oyda nechta dars bor va har biri necha daqiqa?</li>
              <li>Gapirish va yozishdagi xatolarimga kim izoh beradi?</li>
              <li>Keyingi bosqichga o‘tish faqat muddatgami yoki natijaga ham bog‘liqmi?</li>
              <li>Materiallar va qo‘shimcha mashqlar oylik to‘lovga kiradimi?</li>
            </ol>
            <p><Link href="/">Darslinker.uz</Link> — O‘zbekistonda kurslar, o‘quv markazlari va repetitorlarni topishga yordam beradigan ta’lim platformasi. <Link href="/kurslar/ingliz-tili">Ingliz tili kurslarini</Link> ko‘rib, dastur va jadvalni markaz bilan aniqlashtirishingiz mumkin. Individual reja kerak bo‘lsa, <Link href="/repetitorlar">repetitorlar</Link> takliflarini ham solishtiring.</p>
            <p>Markaz haqida ko‘proq ma’lumot uchun <Link href="/oquv-markazlar">o‘quv markazlari katalogi</Link> va <Link href="/blog/ishonchli-oquv-markazni-qanday-tekshirish">to‘lovdan oldin markazni tekshirish qo‘llanmasi</Link> yordam beradi.</p>
          </section>
          <section>
            <h2>Ko‘p so‘raladigan savollar</h2>
            <div className="space-y-6">{faqs.map(f => <div key={f.q}><h3 className="mb-2 text-lg font-semibold">{f.q}</h3><p>{f.a}</p></div>)}</div>
          </section>
          <section className="border-t border-[#e5e8eb] pt-6 text-sm text-[#59616c]">
            <h2>Manbalar va hisoblash usuli</h2>
            <p>Manbalar 2026-yil 17-sentabrda tekshirildi. Daraja soatlari Cambridge English yo‘riqnomasidan; haftalar va oylar Darslinker hisob-kitobi, oy uchun taxminan 4,35 hafta olindi. Shaxsiy mashq jadvali — tahririy misol.</p>
            <ul className="mt-3 list-disc pl-5"><li><a href={cambridge}>Cambridge English — Guided learning hours</a></li><li><a href={britishCouncil}>British Council — AiBC taqdimoti, 30-oktabr 2025</a></li></ul>
          </section>
        </div>
      </article>
    </main>
  );
}
