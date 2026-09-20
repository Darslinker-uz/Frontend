import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const site = "https://darslinker.uz";
const url = `${site}/blog/darslinker-qachon-tashkil-topgan`;
const title = "Darslinker qachon tashkil topgan? Birinchi qadamdan ilk natijalargacha";
const seoTitle = "Darslinker qachon tashkil topgan? Loyiha tarixi";
const description = "Darslinker tarixi: 2025-yil sentyabrdagi ilk qadam, 2026-yil martdagi ishga tushish, 30 dan ortiq o‘quv markazi va 3 000 ga yaqin foydalanuvchi.";
const date = "2026-09-19";
const cover = "/images/blog-covers/darslinker-tarixi-1600x900.jpg";
const coverAlt = "Ko‘k lenta yo‘l shaklida davom etib, 1 raqamiga aylanadi — Darslinkerning bir yillik yo‘li";

export const metadata: Metadata = {
  title: { absolute: `${seoTitle} | Darslinker.uz` },
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "article", locale: "uz_UZ", siteName: "Darslinker.uz", url,
    title: seoTitle, description, publishedTime: date, modifiedTime: date,
    images: [{ url: `${site}${cover}`, width: 1600, height: 900, alt: coverAlt }],
  },
  twitter: { card: "summary_large_image", title: seoTitle, description, images: [`${site}${cover}`] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting", "@id": `${url}#article`, headline: title, description,
      mainEntityOfPage: url, inLanguage: "uz-UZ", datePublished: date, dateModified: date,
      image: { "@type": "ImageObject", url: `${site}${cover}`, width: 1600, height: 900 },
      author: { "@type": "Organization", name: "Darslinker.uz", url: `${site}/haqimizda` },
      publisher: { "@type": "Organization", name: "Darslinker.uz", url: site, logo: { "@type": "ImageObject", url: `${site}/icon-512.png` } },
    },
    {
      "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Asosiy", item: site },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog` },
        { "@type": "ListItem", position: 3, name: title, item: url },
      ],
    },
  ],
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-[#16181a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="mx-auto max-w-[960px] px-5 py-10 md:px-8 md:py-14">
        <nav aria-label="Sahifa yo‘li" className="mb-6 flex flex-wrap gap-2 text-sm text-[#7c8490]">
          <Link href="/">Asosiy</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>Darslinker tarixi</span>
        </nav>
        <header className="mx-auto mb-7 max-w-[760px]">
          <p className="mb-3 text-sm text-[#7c8490]"><Link href="/haqimizda">Darslinker jamoasi</Link> · <time dateTime={date}>19-sentyabr, 2026</time></p>
          <h1 className="text-[32px] font-bold leading-[1.15] tracking-tight md:text-[46px]">{title}</h1>
        </header>
        <figure className="mb-10">
          <Image src={cover} alt={coverAlt} width={1600} height={900} sizes="(max-width: 960px) 100vw, 896px" loading="eager" fetchPriority="high" className="h-auto w-full rounded-2xl" />
        </figure>
        <div className="mx-auto max-w-[760px] space-y-10 text-[17px] leading-[1.85] [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-snug [&_p+p]:mt-4 [&_a]:text-[#426a9e] [&_a]:underline [&_a]:underline-offset-4 [&_li]:mb-2">
          <section aria-labelledby="short-answer" className="rounded-xl bg-[#e8f0f9]/60 p-5 md:p-6">
            <h2 id="short-answer">Darslinker qachon boshlangan?</h2>
            <p><strong>Darslinker loyihasi ustidagi ishlar 2025-yil sentyabrida boshlangan. 2025-yil 19-sentyabrda darslinker.uz domeni olingan, platforma esa 2026-yil mart oyida ishga tushgan.</strong> Shuning uchun 2026-yil 19-sentyabr biz uchun loyihaga qo‘yilgan ilk qadamning bir yilligi, platformaning foydalanuvchilarga xizmat ko‘rsatayotganiga esa taxminan olti oy bo‘lgan sana.</p>
          </section>
          <div>
            <p>Birinchi o‘quv markazi bizga ishonganidagi quvonchimiz hali ham yodimizda. Platforma ishga tushganidan keyingi olti oy ichida bizga ishonch bildirgan o‘quv markazlari soni 30 dan oshdi. Darslinkerdan 3 000 ga yaqin o‘quvchi va ota-ona foydalandi.</p>
            <p>Bu natijalarga yetgunimizcha rejalarimiz ham, yo‘nalishlarimiz ham o‘zgardi. Bir yillik tariximizda xatolar, qaytadan boshlangan ishlar va davom etishga undagan insonlar bor.</p>
          </div>
          <section>
            <h2>Darslinker nima va kimlar uchun yaratilgan?</h2>
            <p>Darslinker — O‘zbekistonda kurslar va o‘quv markazlarini topish hamda taqqoslashga yordam beradigan ta’lim platformasi. U o‘quvchilar va ota-onalarga mos ta’lim yo‘nalishini izlashda, o‘quv markazlariga esa o‘z kurslarini tanishtirish va yangi o‘quvchilarga yetib borishda yordam beradi.</p>
            <p>Platforma ustida ishlashimizning asosiy maqsadi ham shu: o‘quv markazi izlayotgan inson bilan ta’lim berayotgan markazning bir-birini topishini osonlashtirish.</p>
            <p>O‘quvchi yoki ota-ona uchun bu — mavjud variantlar bilan tanishish va tanlov qilish imkoniyati. O‘quv markazi uchun esa o‘z xizmatini unga ehtiyoji bor odamlarga ko‘rsatish imkoniyati.</p>
          </section>
          <section>
            <h2>2025-yil sentyabr: domen olindi va ish boshlandi</h2>
            <p>2025-yil 19-sentyabrda darslinker.uz domenini oldik. Shu davrdan loyihani rejalashtirish va uning ustida ishlashga kirishdik.</p>
            <p>Domen olish boshlanishi edi. Oldimizda platformani yaratish, uning yo‘nalishini belgilash va foydalanuvchilar uchun ishlaydigan holatga keltirish vazifasi turardi.</p>
            <p>Bugun “Darslinker bir yoshda” deganimizda aynan shu yo‘lning boshlanishini nazarda tutamiz. Platforma bir yil davomida ochiq ishlaganini emas.</p>
          </section>
          <section>
            <h2>2026-yil mart: platforma ishga tushdi</h2>
            <p>Darslinker platformasi 2026-yil mart oyida ishga tushdi. Ungacha qilingan rejalar va mehnatni endi foydalanuvchilar ko‘ra oladigan bo‘ldi.</p>
            <p>Bu biz uchun yangi bosqich edi. Platformani yaratish bilan ish tugamasligini, uni odamlar foydalanadigan jarayonda ham yaxshilab borish kerakligini angladik.</p>
            <p>Instagram yoki Telegram orqali kuzatganlarimiz bu ishlarning barchasini ko‘rmagan bo‘lishi mumkin. Shu vaqt davomida asosiy e’tiborimizni darslinker.uz platformasini o‘quv markazlari va o‘quvchilar uchun rivojlantirishga qaratdik. Ijtimoiy tarmoqlarda esa qilayotgan ishlarimizning hammasini ulashib bormadik.</p>
          </section>
          <section>
            <h2>Dastlabki olti oy: 30 dan ortiq o‘quv markazi va 3 000 ga yaqin foydalanuvchi</h2>
            <p>2026-yil martidan sentyabr oyidagi bir yillik sanamizgacha bo‘lgan davrda:</p>
            <ul className="mt-4 list-disc pl-5">
              <li><strong>30 dan ortiq o‘quv markazi</strong> Darslinkerga ishonch bildirdi.</li>
              <li><strong>3 000 ga yaqin o‘quvchi va ota-ona</strong> platformamizdan foydalandi.</li>
            </ul>
            <p>Bu raqamlar ortida o‘ziga mos ta’lim izlayotgan insonlar va o‘z ishini rivojlantirayotgan o‘quv markazlari bor.</p>
            <p>Kimlargadir o‘quv markazini tanlashda yordam berdik. Ayrim markazlar esa Darslinker orqali o‘quvchilar topa boshladi. Mehnatimizning shunday foydasini ko‘rish biz uchun quvonchli.</p>
            <p>Birinchi markazning ishonchi bizga qanchalik muhim bo‘lgan bo‘lsa, bugun qo‘shilayotgan har bir markazning ishonchi ham shunchalik qadrli. Ularning ishonchi platformani yaxshilash mas’uliyatini ham oshiradi.</p>
            <p className="text-sm text-[#59616c]">Ushbu ko‘rsatkichlar Darslinker jamoasi bergan ma’lumotlarga asoslangan bo‘lib, 2026-yil 19-sentyabr holatini aks ettiradi.</p>
          </section>
          <section>
            <h2>Bir yil davomida xatolar ham qildik</h2>
            <p>Hammasi boshidan rejamizdagidek ketmagan. Ayrim rejalarimiz o‘xshamadi. Yo‘nalishlarimiz o‘zgardi. Ba’zi ishlarni qaytadan boshlashga to‘g‘ri keldi.</p>
            <p>Bularni yashirishni istamaymiz. Darslinkerning bugungi holati ham o‘sha izlanishlar, xatolar va ulardan olgan saboqlarimiz natijasi.</p>
            <p>Hali hammasi mukammal emas. Lekin biror ish o‘xshamagani uchun loyihani tashlab qo‘ymadik. Kamchiliklarni tushunishga, yondashuvimizni o‘zgartirishga va oldinga yurishga harakat qildik.</p>
            <p>Bir yillik sanamizda biz uchun eng quvonchli narsalardan biri ham shu: boshlagan ishimizni davom ettiryapmiz.</p>
          </section>
          <section>
            <h2>Darslinker jamoasi qanday shakllandi?</h2>
            <p>Jamoamiz birdaniga shakllanmagan. Kimdir yo‘limizning bir qismida biz bilan bo‘ldi, kimdir boshidan beri yonimizda va hali ham birga mehnat qilyapti.</p>
            <p>Bugungi Darslinkerda ularning har birining hissasi bor. Vaqti, mehnati, fikri yoki qo‘llab-quvvatlashi bilan yordam bergan insonlardan minnatdormiz.</p>
            <p>Bizga ishongan o‘quv markazlari va foydalanuvchilar ham bu yo‘lning bir qismi. Fikr bildirgan, kamchiliklarimizni aytgan, platformadan foydalanib ko‘rgan har bir inson qilayotgan ishimizni yaxshiroq tushunishimizga yordam berdi.</p>
            <p>Shu yergacha bir o‘zimiz yetib kelmadik.</p>
          </section>
          <section>
            <h2>Keyingi qadamlarimiz</h2>
            <p>Oldimizdagi maqsad — Darslinkerni o‘quv markazlari, o‘quvchilar va ota-onalar uchun yanada qulay qilish. Platformani rivojlantirishda va foydalanuvchilar fikrini tinglashda davom etamiz.</p>
            <p>Bir yil oldin boshlangan ishning bugun odamlarga foyda berayotganidan xursandmiz. Oldinda hali ko‘p mehnat borligini ham bilamiz. Biz davom etamiz, taslim bo‘lmaymiz.</p>
            <p>Agar hozir o‘zingiz yoki farzandingiz uchun kurs izlayotgan bo‘lsangiz, <Link href="/oquv-markazlar">Darslinkerdagi o‘quv markazlari bilan tanishishingiz mumkin</Link>.</p>
            <p><strong>Darslinker o‘quv markazlari uchun qulayliklar yaratishda charchamaydi. Siz ham ilm olishda va ilm berishda charchamang!</strong></p>
          </section>
        </div>
      </article>
    </main>
  );
}
