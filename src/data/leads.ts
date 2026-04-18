export interface Lead {
  id: number;
  name: string;
  phone: string;
  telegram?: string;
  course: string;
  time: string;
  status: string;
  note?: string;
}

export const initialLeads: Lead[] = [
  { id: 1, name: "Jasur Karimov", phone: "+998 90 123 45 67", telegram: "@jasurk", course: "JavaScript & React", time: "2 daqiqa oldin", status: "yangi" },
  { id: 2, name: "Madina Rahimova", phone: "+998 91 234 56 78", telegram: "@madina_r", course: "UI/UX dizayn Figma", time: "15 daqiqa oldin", status: "yangi" },
  { id: 3, name: "Bobur Toshmatov", phone: "+998 93 345 67 89", course: "IELTS Intensive 7.0+", time: "1 soat oldin", status: "yangi" },
  { id: 4, name: "Nilufar Azimova", phone: "+998 94 456 78 90", telegram: "@nilufara", course: "Python Backend", time: "2 soat oldin", status: "yangi" },
  { id: 5, name: "Sardor Umarov", phone: "+998 90 567 89 01", course: "Data Science & AI", time: "3 soat oldin", status: "yangi" },
  { id: 6, name: "Zarina Aliyeva", phone: "+998 91 678 90 12", telegram: "@zarina_ali", course: "Digital Marketing", time: "5 soat oldin", status: "yangi" },
  { id: 7, name: "Otabek Nazarov", phone: "+998 93 789 01 23", telegram: "@otabek_n", course: "Flutter mobil ilova", time: "6 soat oldin", status: "yangi" },
  { id: 8, name: "Kamola Rustamova", phone: "+998 94 890 12 34", course: "Grafik dizayn Pro", time: "8 soat oldin", status: "yangi" },
  { id: 9, name: "Sherzod Ibragimov", phone: "+998 90 901 23 45", telegram: "@sherzod_i", course: "JavaScript & React", time: "Kecha", status: "yangi" },
  { id: 10, name: "Dildora Xasanova", phone: "+998 91 012 34 56", telegram: "@dildora_x", course: "Rus tili — noldan B1", time: "Kecha", status: "yangi" },
];
