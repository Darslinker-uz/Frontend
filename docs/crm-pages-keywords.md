# CRM/LMS sahifalari — kalit so'zlar rejasi

Sana: 2026-10-23 · Manba: egasi GPT bilan topgan ro'yxat + tuzatishlar · Jami: 24 sahifa

## Ishlatish qoidalari

- **Asosiy keyword** — title, H1, meta description, birinchi paragraf (bir marta, tabiiy gap ichida).
- **Yaqin iboralar** — H2 va matn ichida, har biri ko'pi bilan 1 marta, faqat ma'nosi kelgan joyda. Hammasini ishlatish shart emas.
- **AEO/GEO savoli** — H2 yoki FAQ savoli, ostida 2–3 gaplik aniq javob (FAQPage schema).
- **Ruscha iboralar** — o'zbekcha sahifaga qo'yilmaydi; ruscha versiya qilinsa, o'sha sahifalarga.
- Tutuq belgisi matnda doim `'` (o'quv), `‘` emas.
- Faqat tasdiqlangan imkoniyatlar yoziladi (src/lib/crm-content.ts va egasining tasdiqlari).
- Bosh sahifa "o'quv markazi uchun CRM" so'rovini ushlaydi — ichki sahifalar uni asosiy keyword qilmaydi.

## A. Imkoniyatlar

| Sahifa | Asosiy keyword | Yaqin iboralar | AEO/GEO savoli |
|---|---|---|---|
| /features | o'quv markazi boshqaruv tizimi imkoniyatlari | o'quv markazini boshqarish dasturi; o'quv markazi boshqaruv tizimi; o'quv markazi uchun dastur | O'quv markazini boshqarish uchun qanday dastur kerak? |
| /features/attendance | o'quv markazi davomat tizimi | davomat jurnali elektron; o'quvchilar davomati dasturi; davomatni nazorat qilish | O'quvchilar davomati qanday yuritiladi? |
| /features/payments | o'quv markazida to'lov va qarzdorlik hisobi | o'quvchilar to'lovi nazorati; kurs to'lovlarini hisoblash; o'quv markazi qarzdorlar ro'yxati | O'quv markazidagi qarzdorlikni qanday nazorat qilish mumkin? |
| /features/lms | o'quv markazi uchun LMS | LMS tizimi; o'quv jarayonini boshqarish tizimi; CRM va LMS farqi; o'quvchilar natijalarini kuzatish | LMS nima va o'quv markaziga nima uchun kerak? |
| /features/live-quiz | o'quv markazi uchun jonli quiz | dars uchun online quiz; o'quvchilar bilimini tekshirish testi; darsda viktorina o'tkazish; gamifikatsiya ta'limda | Jonli quiz o'quvchilar faolligiga qanday yordam beradi? |
| /features/telegram | o'quv markazi uchun Telegram bot | Telegram mini app CRM; o'quv markazi Telegram integratsiyasi; Telegram orqali boshqariladigan CRM | Telegram mini ilova nima va u qanday ishlaydi? |
| /features/parents | ota-onaga davomat xabari | ota-ona farzandini nazorat qilish; Telegram orqali to'lov eslatmasi; ota-onalarga avtomatik xabar | Ota-ona farzandining davomatini qanday biladi? |
| /features/easy-to-use | o'quv markazi uchun oson CRM | oddiy o'quv markazi boshqaruv dasturi; Excel'dan CRM'ga o'tish; o'quvchilar ro'yxatini Excel'dan yuklash | Excel'dagi o'quvchilar bazasini CRM'ga qanday ko'chirish mumkin? |
| /features/customization | o'quv markazi uchun moslashuvchan CRM | CRM'da logo va ranglarni sozlash; xodimlar uchun rollar; markazga mos boshqaruv tizimi | CRM'ni o'quv markazining ish tartibiga moslash mumkinmi? |
| /features/security | CRM ma'lumotlar xavfsizligi | xavfsiz CRM; o'quv markazi ma'lumotlarini himoya qilish; CRM zaxira nusxa; ma'lumotlarni eksport qilish | O'quv markazi CRM'ida ma'lumotlar xavfsizmi? |
| /features/support | o'quv markazi CRM o'rnatish va sozlash | CRM'ni sozlab berish; supporti yaxshi CRM; kerakli funksiyani qo'shib beradigan CRM; do'stona support | O'quv markazi CRM'ini o'rnatib va sozlab beradigan kompaniya bormi? |
| /features/branches | o'quv markazining filiallarini boshqarish | bir nechta filial hisobi; filiallar bo'yicha davomat va to'lov; ko'p filialli markaz CRM'i; o'quv markazlari tarmog'i uchun CRM; filiallar bo'yicha umumiy hisobot; tarmoq markazlari boshqaruvi | Bir nechta o'quv markazini bitta tizimda boshqarish mumkinmi? |
| /features/students | o'quvchilar bazasini yuritish dasturi | o'quvchilar hisobi; o'quvchilar ro'yxati dasturi; o'quvchi tarixi va to'lovlari | O'quvchilar bazasida qanday ma'lumotlar yuritiladi? |
| /features/leads | o'quv markazi uchun lidlar va arizalar hisobi | kursga kelgan arizalarni boshqarish; yangi o'quvchilarni jalb qilish; kursga yozilish arizalari | Kursga kelgan arizalarni yo'qotmasdan qanday kuzatish mumkin? |
| /features/schedule | o'quv markazi dars jadvali dasturi | guruhlar dars jadvali; o'qituvchi jadvali; dars vaqtini rejalashtirish | Guruhlar va o'qituvchilar jadvalini qanday tuzish mumkin? |
| /features/reports | o'quv markazi uchun hisobot va analitika | o'quv markazi daromad hisoboti; davomat hisoboti; qarzdorlik hisoboti | Rahbar o'quv markazi natijalarini qaysi hisobotlardan ko'ra oladi? |

## B. Qaror bosqichi

| Sahifa | Asosiy keyword | Yaqin iboralar | AEO/GEO savoli |
|---|---|---|---|
| /pricing | o'quv markazi CRM narxi | o'quv markazini boshqarish dasturi narxi; CRM oylik to'lovi; o'quv markazi uchun CRM tariflari | O'quv markazi CRM'i qancha turadi va tarifga nimalar kiradi? |
| /crm-comparison | O'zbekistondagi o'quv markazlari CRM tizimlari | o'quv markazi uchun eng yaxshi CRM (sarlavhada: "…qanday tanlash kerak"); o'quv markazlari uchun CRM taqqoslash; CRM tizimlari narxlari | O'quv markazi uchun CRM tanlashda nimalarni solishtirish kerak? |

/crm-comparison — neytral: mezonlar va tekshirilgan faktlar, "eng yaxshisi biz" yo'q.

## C. Markaz turi bo'yicha

| Sahifa | Asosiy keyword | Yaqin iboralar | AEO/GEO savoli |
|---|---|---|---|
| /for/language-centers | til markazi uchun CRM | til o'quv markazini boshqarish dasturi; ingliz tili markazi davomat va to'lov tizimi | Til markazi guruhlari va to'lovlarini qanday boshqarish mumkin? |
| /for/exam-prep | abituriyent tayyorlov markazi uchun CRM | test markazi boshqaruv dasturi; abituriyent guruhlari va davomat hisobi | Imtihonga tayyorlov guruhlarining davomatini va natijalarini qanday kuzatish mumkin? |
| /for/it-schools | IT o'quv markazi uchun CRM | IT akademiya boshqaruv tizimi; dasturlash kurslari uchun o'quvchilar hisobi | IT akademiyada guruhlar va o'quvchilarni qanday boshqarish mumkin? |
| /for/kids-centers | bolalar o'quv markazi uchun CRM | bolalar markazi davomat dasturi; ota-onalarga avtomatik xabar; bolalar kurslari o'quvchilari hisobi | Bolalar markazida ota-onalarni davomatdan qanday xabardor qilish mumkin? |
| /for/small-centers | kichik o'quv markazi uchun CRM | yangi o'quv markazi boshqaruv dasturi; kichik markaz uchun arzon CRM; sodda CRM o'quv markazi | Kichik o'quv markaziga qaysi boshqaruv tizimi mos? |
| /for/tutors | repetitorlar uchun o'quvchilar hisobi dasturi | repetitor dars jadvali dasturi; repetitor to'lov nazorati; repetitor o'quvchilari bazasi | Repetitor dars jadvali va o'quvchilar to'lovini qanday yuritadi? |

/for/multi-branch — olib tashlandi (/features/branches bilan bir xil intent; iboralari o'sha sahifaga qo'shildi).

## Ruscha iboralar (kelajakdagi RU versiya uchun)

CRM для учебного центра · учет посещаемости учеников · учет оплат учебного центра · уведомления родителям Telegram · простая CRM для учебного центра · CRM с настройкой ролей · CRM для сети учебных центров · база учеников учебного центра · CRM для заявок учебного центра · расписание учебного центра · dashboard учебного центра · цена CRM для учебного центра · сравнение CRM для учебного центра Узбекистан · CRM для языковой школы · CRM для курсов подготовки к экзаменам · CRM для IT школы · CRM для детского учебного центра · CRM для небольшого учебного центра · программа для репетитора учет учеников
