# Darslinker.uz — Loyiha hujjati

> O'zbekistondagi online va offline kurslarni topish va solishtirish platformasi.
> O'quvchilar o'zlariga mos kursni tanlaydi va to'g'ridan-to'g'ri kurs egasi bilan bog'lanadi.

---

## Ekosistema

Darslinker uch produktdan iborat:

| Produkt | Tavsif |
|---------|--------|
| **Darslinker.uz** | Kurs e'lonlari aggregatori (hozirgi hujjat) |
| **Darslinker.app** | Video kurs nashr va sotish platformasi |
| **Darslinker.agency** | Ta'lim tadbirkorlari uchun IT xizmatlar |

---

## Platforma modeli

Darslinker.uz o'zi kurs o'tkazmaydi — **directory + redirect model.**
Kurs egalari e'lon joylaydi, o'quvchilar topadi va to'g'ridan bog'lanadi.

---

## Foydalanuvchilar

| Tur | Tavsif |
|-----|--------|
| **O'quvchi** | Kurs izlovchi. Ro'yxatsiz forma to'ldirishi mumkin |
| **Kurs egasi** | O'qituvchi, markaz, repetitor, bootcamp |
| **Super Admin** | Barcha jarayonlarni nazorat qiladi |

---

## Kurs turlari

- Offline o'quv markazlar
- Xususiy o'qituvchilar (repetitorlar)
- Bootcamp / intensivlar
- Online video kurslar
- YouTube va bepul kontent (redirect modelida)

---

## MVP imkoniyatlari

- Kurs e'lonlari (listing)
- Qidiruv va filtr
- Sharh va reyting tizimi
- Murojaat (lead) tizimi
- A class boost (featured e'lonlar)

---

## Filtrlar

- Kategoriya / yo'nalish
- Narx (bepul / pullik)
- Format (online / offline / video)
- Joylashuv (shahar, tuman)
- Til (O'zbek / Rus / Ingliz)
- Reyting

---

## Kategoriyalar (Top 5)

1. Dasturlash
2. Dizayn
3. Marketing
4. Ingliz tili
5. Rus tili

---

## Monetizatsiya modeli

### Lead tizimi
- Har bir murojaat (forma to'ldirish) = 1 lead
- Lead narxi: **5 000 so'm** (barcha kurs turlari uchun bir xil)
- Bir o'quvchi → N ta kurs = N ta lead (har biri alohida)
- Bir o'quvchi + bir kurs = faqat 1 lead (duplicate blok)

### Boost tizimi
| Daraja | Joy | Narx |
|--------|-----|------|
| **A class** | Bosh sahifa slider + featured | 70 000 so'm/kun |
| **Bepul** | Katalogda organik tartibda | 0 |

### Onboarding
- Yangi kurs egasiga **50 000 so'm** boshlang'ich balans beriladi
- Balans tugagach Payme yoki Click orqali to'ldiriladi
- Prepay model — oldindan balans to'ldiriladi

---

## Lead logikasi

### Duplicate tekshiruv
```
telefon + kurs_id → bir xil bo'lsa → bloklanadi
```

### Lead holatlari
```
new → contacted → converted → disputed
```

### Dispute mexanizmi
- Kurs egasi sifatsiz lead uchun dispute ochadi
- Admin 24-48 soat ichida ko'rib chiqadi
- Qabul qilinsa → balans qaytariladi
- Rad etilsa → lead haqiqiy hisoblanadi

### Lead yetkazish
- Telegram bot orqali darhol xabar
- Admin panel orqali ko'rish

---

## Kontent strategiyasi

| Bosqich | Tavsif |
|---------|--------|
| 1-bosqich | Jamoa qo'lda to'playdi (manual) |
| 2-bosqich | Kurs egalari o'zlari qo'shadi (self-service) |

---

## Sahifalar

### Public sahifalar
| Sahifa | URL | Tavsif |
|--------|-----|--------|
| Bosh sahifa | `/` | Hero, A class, katalog |
| Katalog | `/kurslar` | Barcha kurslar, filtr |
| Kategoriya | `/kurslar/[kategoriya]` | Filtrlangan kurslar |
| Kurs sahifasi | `/kurslar/[kategoriya]/[slug]` | Detail, forma, sharhlar |
| Blog | `/blog` | SEO maqolalar |

### Auth sahifalari
| Sahifa | URL |
|--------|-----|
| Ro'yxat / Kirish | `/auth` |

Ro'yxatdan o'tishda:
```
Siz kimsiz?
[ O'quvchiman ]  [ Kurs egasiman ]
```

### Kurs egasi sahifalari
| Sahifa | URL | Tavsif |
|--------|-----|--------|
| Dashboard | `/dashboard` | Statistika, e'lonlar |
| Leadlar | `/dashboard/leads` | Kanban CRM |
| E'lon qo'shish | `/dashboard/listings/new` | Forma |
| Balans | `/dashboard/balance` | To'ldirish, tarix |
| Profil | `/dashboard/profile` | Sozlamalar, Telegram |

### Admin sahifalari
| Sahifa | URL | Tavsif |
|--------|-----|--------|
| Dashboard | `/admin` | Umumiy statistika |
| E'lonlar | `/admin/listings` | Moderatsiya, tahrirlash |
| Foydalanuvchilar | `/admin/users` | Balans, faollik |
| Leadlar | `/admin/leads` | Dispute, nazorat |
| To'lovlar | `/admin/payments` | Daromad, tarix |

---

## Bosh sahifa tuzilmasi

| # | Section | Tavsif |
|---|---------|--------|
| 1 | Navbar | Logo · Qidiruv · Kategoriyalar · E'lon berish · Kirish |
| 2 | Hero | Qidiruv qutisi · Slogan |
| 3 | A class slider | Max 10 ta · random · avtomatik (3-5 sek) |
| 4 | Kategoriyalar | Top 5 |
| 5 | Mashhur kurslar | 6 ta · 3x2 desktop · 2x3 mobil |
| 6 | Qanday ishlaydi | 3 qadam (o'quvchi uchun) |
| 7 | Kurs egasi CTA | "E'lon joylash — bepul boshlang" |
| 8 | Statistika | Yashirin (keyinchalik) |
| 9 | Footer | Kategoriyalar · Platforma · Maqolalar · Aloqa · Huquqiy |

---

## Katalog sahifasi tuzilmasi

| # | Qism | Tavsif |
|---|------|--------|
| 1 | Sarlavha | "Barcha kurslar" yoki "Dasturlash kurslari" |
| 2 | Filtr | Gorizontal — kategoriya · format · narx · til · reyting |
| 3 | Natija soni | "124 ta kurs topildi" |
| 4 | Tartiblash | Dropdown — yangi · reyting · narx |
| 5 | Kurslar grid | 4x3 desktop · 2x6 mobil |
| 6 | Ko'proq yuklash | Tugma (pagination) |

### Tartib
1. Reyting + lead soni (organik)
2. Yangi qo'shilganlar

---

## Kurs sahifasi tuzilmasi

### Asosiy kontent (chap)
| # | Blok | Tafsilot |
|---|------|----------|
| 1 | Header | Kurs nomi · markaz logosi · reyting |
| 2 | Asosiy ma'lumot | Narx · format · til · davomiylik · joylashuv · boshlanish sanasi · qabul holati |
| 3 | Tavsif | Kimlar uchun · nima o'rgatadi · dastur |
| 4 | O'qituvchi / markaz | Ism · tajriba · boshqa kurslari |
| 5 | Sharhlar | Umumiy ball · faqat forma to'ldirganlar yozadi |
| 6 | CTA | Ism · telefon · izoh → lead |

### Sticky panel (o'ng)
- Narx
- Format
- Boshlanish sanasi
- Qabul holati (Bo'sh joy bor / Yozilish yopiq)
- Reyting
- Bog'lanish tugmasi
- Solishtirish tugmasi
- O'xshash kurslar (2-3 ta)

### Qabul holatlari
| Holat | Ma'nosi |
|-------|---------|
| Bo'sh joy bor | Yozilish mumkin |
| Yozilish yopiq | Hozircha qabul yo'q |

---

## E'lon qo'shish formasi

| Maydon | Holat |
|--------|-------|
| Kurs nomi | Majburiy |
| Kategoriya | Majburiy |
| Format | Majburiy |
| Narx | Majburiy |
| Davomiylik | Majburiy |
| Joylashuv | Majburiy (offline bo'lsa) |
| Telefon | Majburiy |
| Qabul holati | Majburiy |
| Rasm | Ixtiyoriy (A class boost uchun majburiy) |
| Tavsif | Ixtiyoriy |
| O'qituvchi haqida | Ixtiyoriy |
| Boshlanish sanasi | Ixtiyoriy |

---

## Kurs egasi dashboard (minimal CRM)

### Statistika (yuqorida)
- Jami leadlar
- Bu oy leadlar
- Konversiya %
- Balans qoldig'i

### E'lonlar
- Kurs nomi · holati · boost · lead soni
- Tahrirlash · boost yoqish tugmalari

### Leadlar — Kanban
```
[ New ] → [ Contacted ] → [ Converted ] → [ Disputed ]
```
- Drag & drop orqali status o'zgartiriladi
- Mobilda gorizontal scroll

### Boost
| Daraja | Joy | Narx |
|--------|-----|------|
| A class | Bosh sahifa slider | 70 000 so'm/kun |
| Bepul | Katalogda organik | 0 |

---

## Admin dashboard

### Statistika
- Jami kurslar (faol / kutilmoqda)
- Jami foydalanuvchilar
- Jami leadlar (bugun / bu oy)
- Jami daromad

### Bo'limlar
| Bo'lim | Imkoniyatlar |
|--------|--------------|
| E'lonlar | Tasdiqlash · tahrirlash · rad etish · SEO · admin qo'shishi |
| Foydalanuvchilar | Balans · faollik · bloklash |
| Leadlar | Dispute · nazorat |
| To'lovlar | Balans tarixi · daromad |

### Filtrlar (har bir bo'limda)
- Holat · kategoriya · sana · qidiruv

---

## Texnik stack

| Qism | Xizmat | Narx |
|------|--------|------|
| Frontend + Backend | Next.js | — |
| Server | DigitalOcean Droplet (1GB RAM) | $6/oy |
| Database | PostgreSQL (DO da) | $0 |
| Backup | DO Backup | $1/oy |
| Media | Cloudflare R2 | $0 (10GB gacha) |
| SMS | Play Mobile | ~150 so'm/SMS |
| To'lov | Payme + Click | — |
| Telegram | Bot (leadlar) | $0 |
| **Jami** | | **~$7/oy** |

---

## DB Schema

```sql
users
- id
- name
- phone
- password_hash
- role (student | provider | admin)
- telegram_chat_id
- created_at

categories
- id
- name
- icon
- slug

listings
- id
- user_id (FK → users)
- category_id (FK → categories)
- title
- description
- price
- format (offline | online | video)
- location
- language
- duration
- start_date
- admission_status (open | closed)
- phone
- image_url
- status (pending | active | rejected)
- created_at

leads
- id
- listing_id (FK → listings)
- name
- phone
- message
- status (new | contacted | converted | disputed)
- created_at

reviews
- id
- listing_id (FK → listings)
- lead_id (FK → leads)
- rating
- comment
- created_at

boosts
- id
- listing_id (FK → listings)
- type (a_class)
- price_per_day
- start_date
- end_date
- status (active | ended)

payments
- id
- user_id (FK → users)
- amount
- type (topup | lead | boost)
- description
- created_at

balance_log
- id
- user_id (FK → users)
- amount
- type (credit | debit)
- reference_id
- created_at
```

---

## SEO strategiyasi

### URL tuzilmasi
```
/kurslar/[kategoriya]/[kurs-nomi-shahar]
/kurslar/dasturlash/python-kursi-toshkent
```

### Avtomatik generatsiya (Next.js generateMetadata)
- `<title>` — "Python kursi Toshkent | Darslinker.uz"
- `<description>` — kurs ma'lumotlaridan avtomatik
- `<h1>` — kurs nomi
- Schema markup — `Course` tipi

### Kategoriya sahifalari
```
/kurslar/dasturlash/ → barcha dasturlash kurslari
```

---

## Rang palitasi

| Rang | Hex | Ishlatilishi |
|------|-----|--------------|
| Qora | `#232324` | Asosiy matn, navbar |
| Ko'k | `#7ea2d4` | Tugmalar, accent, link |
| Och kulrang | `#eaefef` | Background, kartochka fon |

---

## Keyingi bosqichlar

- [ ] Wireframe / mockup
- [ ] Next.js loyiha yaratish
- [ ] DB schema yaratish (PostgreSQL)
- [ ] Auth tizimi (telefon + SMS)
- [ ] Kurs egasi dashboard
- [ ] Lead tizimi + Telegram bot
- [ ] A class boost logikasi
- [ ] Payme + Click integratsiya
- [ ] Admin panel
- [ ] SEO optimizatsiya
- [ ] Beta test
- [ ] Ishga tushirish
