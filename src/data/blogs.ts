export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  gradient: string;
  content: { type: "p" | "h2" | "quote"; text: string }[];
}

export const blogs: BlogPost[] = [
  {
    slug: "dasturlashni-qayerdan-boshlash",
    title: "Dasturlashni qayerdan boshlash kerak? 2025 yo'l xaritasi",
    excerpt: "Python, JavaScript yoki boshqa til? Qaysi yo'nalishni tanlash va qanday reja tuzish kerak — batafsil ko'rsatma.",
    category: "Dasturlash",
    date: "12 Apr, 2025",
    readTime: "7 daqiqa",
    author: "Ali Karimov",
    gradient: "from-[#4a7ab5] to-[#7ea2d4]",
    content: [
      { type: "p", text: "Dasturlashni o'rganishni boshlash ko'pchilik uchun qiyin qaror. Qaysi tilni tanlash, qaysi resurslardan foydalanish va qanday reja tuzish kerak — bu savollar har bir yangi boshlovchini o'ylantiradi." },
      { type: "h2", text: "1. Qaysi dasturlash tilini tanlash kerak?" },
      { type: "p", text: "Birinchi dasturlash tili sifatida Python yoki JavaScript eng yaxshi tanlov hisoblanadi. Python — sodda sintaksisi bilan mashhur, data science va AI uchun ideal. JavaScript — web dasturlash uchun zarur, frontend va backend ikkisida ham ishlaydi." },
      { type: "h2", text: "2. Qanday reja tuzish kerak?" },
      { type: "p", text: "Har kuni kamida 2 soat amaliy mashq qiling. Birinchi oyda asoslarni o'rganing — o'zgaruvchilar, sikllar, funksiyalar. Ikkinchi oyda kichik loyihalar qiling. Uchinchi oydan boshlab real loyihalarga o'ting." },
      { type: "quote", text: "Eng yaxshi dasturchi — har kuni kod yozadigan dasturchi. Mukammallikni emas, izchillikni maqsad qiling." },
      { type: "h2", text: "3. Foydali resurslar" },
      { type: "p", text: "freeCodeCamp, The Odin Project va CS50 — bepul va sifatli kurslar. YouTube da Traversy Media va Fireship kanallari juda foydali. O'zbek tilida esa Najot Ta'lim va PDP Academy kurslarini ko'rib chiqing." },
      { type: "p", text: "Eng muhimi — boshlang. Mukammal vaqtni kutmang, bugun birinchi qadamni tashlang va har kuni bir qadam oldinga yuring." },
    ],
  },
  {
    slug: "ielts-7-tayyorgarlik",
    title: "IELTS 7.0+ olish uchun 3 oylik tayyorgarlik rejasi",
    excerpt: "Listening, Reading, Writing va Speaking bo'limlari uchun kunlik mashq jadvali va foydali resurslar.",
    category: "Ingliz tili",
    date: "8 Apr, 2025",
    readTime: "5 daqiqa",
    author: "Zilola Rahimova",
    gradient: "from-[#2d6a5a] to-[#4a9e8a]",
    content: [
      { type: "p", text: "IELTS 7.0+ olish — bu aniq reja va muntazam mashq talab qiladigan maqsad. Uch oylik intensiv tayyorgarlik bilan bu natijaga erishish mumkin." },
      { type: "h2", text: "1-oy: Asoslarni mustahkamlash" },
      { type: "p", text: "Grammatika va lug'at boyligini oshirishga e'tibor bering. Har kuni 20 ta yangi so'z o'rganing va ularni jumlalarda ishlating. Cambridge Grammar in Use kitobini tugatish maqsad qiling." },
      { type: "h2", text: "2-oy: Amaliy mashqlar" },
      { type: "p", text: "Har kuni bitta Listening va Reading test ishlang. Writing uchun haftada 3 ta essay yozing va tekshirtiring. Speaking uchun kuniga 15 daqiqa o'zingiz bilan gaplashing yoki tandem partner toping." },
      { type: "quote", text: "IELTS — bu bilim emas, ko'nikma imtihoni. Ko'nikma esa faqat mashq orqali shakllanadi." },
      { type: "h2", text: "3-oy: Mock testlar" },
      { type: "p", text: "Har hafta to'liq mock test ishlang va vaqtni nazorat qiling. Xatolaringizni tahlil qilib, zaif tomonlaringizga ko'proq vaqt ajrating." },
    ],
  },
  {
    slug: "freelance-boshlash",
    title: "Freelance ishni qanday boshlash mumkin?",
    excerpt: "Upwork, Fiverr va boshqa platformalarda birinchi buyurtmani olish strategiyalari va portfolio tayyorlash.",
    category: "Karera",
    date: "3 Apr, 2025",
    readTime: "6 daqiqa",
    author: "Sardor Alimov",
    gradient: "from-[#a35b2d] to-[#c47e4a]",
    content: [
      { type: "p", text: "Freelance — bu erkinlik va mustaqillik. Lekin boshlash har doim eng qiyin qadam. Keling, birinchi mijozni qanday topish va professional portfolio yaratishni ko'rib chiqamiz." },
      { type: "h2", text: "Portfolio tayyorlash" },
      { type: "p", text: "Hali mijozingiz bo'lmasa ham, o'zingiz uchun 3-5 ta loyiha yarating. Bu sizning ko'nikmallaringizni namoyish etadi. GitHub, Behance yoki shaxsiy saytingizda joylang." },
      { type: "h2", text: "Platformani tanlash" },
      { type: "p", text: "Upwork — katta loyihalar uchun ideal. Fiverr — kichik va tezkor ishlar uchun. Toptal — yuqori sifatli dasturchilar uchun. O'zbekistondagi freelancerlar uchun Upwork eng yaxshi tanlov." },
      { type: "quote", text: "Birinchi mijoz — eng muhimi. Narxni past qo'ying, sifatni yuqori ko'rsating. Keyingi mijozlar o'zlari keladi." },
      { type: "h2", text: "Narxlash strategiyasi" },
      { type: "p", text: "Boshida soatiga $5-10 dan boshlang. Reytingingiz va reviewlaringiz oshgandan keyin narxni asta-sekin ko'taring. 6 oy ichida $20-30 gacha chiqish mumkin." },
    ],
  },
  {
    slug: "ui-ux-dizayn-trendy",
    title: "2025 yilning eng kuchli UI/UX dizayn trendlari",
    excerpt: "Glassmorphism, neobrutalizm, AI-driven dizayn va boshqa trendlar — misollar bilan tushuntirish.",
    category: "Dizayn",
    date: "28 Mar, 2025",
    readTime: "4 daqiqa",
    author: "Nodira Ismoilova",
    gradient: "from-[#6b5b95] to-[#8b7bb5]",
    content: [
      { type: "p", text: "Dizayn trendlari har yili o'zgaradi. 2025 yilda bir nechta kuchli trendlar paydo bo'ldi — ularni bilish har bir dizayner uchun muhim." },
      { type: "h2", text: "Glassmorphism 2.0" },
      { type: "p", text: "Shaffof, blur effektli elementlar yanada keng tarqalmoqda. Apple va Microsoft bu trendni faol qo'llayapti. Navbar, cardlar va modallarda ishlatiladi." },
      { type: "h2", text: "AI-driven dizayn" },
      { type: "p", text: "Figma AI, Midjourney va DALL-E yordamida dizayn jarayoni tezlashmoqda. AI mockup yaratadi, dizayner esa uni mukammallashtiradigan bo'lmoqda." },
      { type: "quote", text: "Yaxshi dizayn — bu foydalanuvchi sezmagan dizayn. U shunchaki ishlaydi." },
      { type: "h2", text: "Micro-interactions" },
      { type: "p", text: "Kichik animatsiyalar — hover effectlar, loading skeletonlar, page transitionlar — foydalanuvchi tajribasini sezilarli yaxshilaydi." },
    ],
  },
  {
    slug: "online-vs-offline-kurslar",
    title: "Onlayn va oflayn kurslar: qaysi biri siz uchun mos?",
    excerpt: "Ikki formatning afzalliklari, kamchiliklari va qaysi holatda qaysi birini tanlash kerakligi haqida.",
    category: "Ta'lim",
    date: "22 Mar, 2025",
    readTime: "5 daqiqa",
    author: "Jasur Toshmatov",
    gradient: "from-[#1a1a2e] to-[#0f3460]",
    content: [
      { type: "p", text: "Kurs tanlashda eng ko'p beriladigan savol: onlayn yoki oflayn? Har ikki formatning o'z afzalliklari va kamchiliklari bor." },
      { type: "h2", text: "Onlayn kurslar" },
      { type: "p", text: "Afzalliklari: istalgan joydan o'rganish, arzonroq narx, o'z tezligingizda o'rganish. Kamchiliklari: motivatsiya muammosi, jonli muloqot kam, amaliy mashqlar cheklangan." },
      { type: "h2", text: "Oflayn kurslar" },
      { type: "p", text: "Afzalliklari: mentorlik, jonli amaliy mashqlar, tarmoq (networking) imkoniyati. Kamchiliklari: qimmatroq, vaqt va joy bog'liqligi, tezlik cheklangan." },
      { type: "quote", text: "Eng yaxshi format — bu siz haqiqatdan davom ettiradigan format." },
      { type: "h2", text: "Qaysi birini tanlash kerak?" },
      { type: "p", text: "Agar o'z-o'zini boshqara olsangiz va byudjet cheklangan bo'lsa — onlayn. Agar amaliy ko'nikma va mentorlik kerak bo'lsa — oflayn. Ko'pchilik uchun gibrid format eng yaxshi natija beradi." },
    ],
  },
];
