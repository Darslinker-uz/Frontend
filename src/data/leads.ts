export interface Lead {
  id: number;
  name: string;
  phone: string;
  course: string;
  time: string;
  status: string;
  note?: string;
}

export const initialLeads: Lead[] = [
  { id: 1, name: "Jasur Karimov", phone: "+998 90 123 45 67", course: "JavaScript & React", time: "2 daqiqa oldin", status: "yangi" },
  { id: 2, name: "Madina Rahimova", phone: "+998 91 234 56 78", course: "UI/UX dizayn Figma", time: "15 daqiqa oldin", status: "yangi" },
  { id: 3, name: "Bobur Toshmatov", phone: "+998 93 345 67 89", course: "IELTS Intensive 7.0+", time: "1 soat oldin", status: "yangi" },
  { id: 4, name: "Nilufar Azimova", phone: "+998 94 456 78 90", course: "Python Backend", time: "2 soat oldin", status: "yangi" },
  { id: 5, name: "Sardor Umarov", phone: "+998 90 567 89 01", course: "Data Science & AI", time: "3 soat oldin", status: "yangi" },
  { id: 6, name: "Zarina Aliyeva", phone: "+998 91 678 90 12", course: "Digital Marketing", time: "5 soat oldin", status: "yangi" },
  { id: 7, name: "Otabek Nazarov", phone: "+998 93 789 01 23", course: "Flutter mobil ilova", time: "6 soat oldin", status: "yangi" },
  { id: 8, name: "Kamola Rustamova", phone: "+998 94 890 12 34", course: "Grafik dizayn Pro", time: "8 soat oldin", status: "yangi" },
  { id: 9, name: "Sherzod Ibragimov", phone: "+998 90 901 23 45", course: "JavaScript & React", time: "Kecha", status: "yangi" },
  { id: 10, name: "Dildora Xasanova", phone: "+998 91 012 34 56", course: "Rus tili — noldan B1", time: "Kecha", status: "yangi" },
];
