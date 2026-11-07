// lib/data.ts

export interface EventItem {
  id: string;
  title: string;
  category: "ჰაკათონი" | "ვორქშოფი" | "გაცვლითი პროგრამა" | "სტაჟირება" | "სხვა";
  university: string;
  date: string;
  location: string;
  organizer: string;
  summary: string;
  tags: string[];
  link: string;
}

export interface TeammateItem {
  id: string;
  name: string;
  university: string;
  role: string;
  targetEvent: string;
  lookingFor: string;
  skills: string[];
  contact: string;
  bio: string;
}

export const REAL_EVENTS: EventItem[] = [
  
   {
  id: "tsu-ilia-189",
  title: "ილია ჭავჭავაძის დაბადებიდან 189 წლისთავისადმი მიძღვნილი ღონისძიება",
  category: "ვორქშოფი",
  university: "თსუ (TSU)",
  date: "7-8 ნოემბერი, 2026",
  location: "თსუ (თბილისი)",
  organizer: "თსუ სოციალურ და პოლიტიკურ მეცნიერებათა სტუდენტური თვითმმართველობა",
  summary: "ილია ჭავჭავაძის დაბადებიდან 189 წლისთავისადმი მიძღვნილი საიუბილეო და შემეცნებითი სტუდენტური ღონისძიება.",
  tags: ["ილია ჭავჭავაძე", "თსუ", "ისტორია", "კულტურა"],
  link: "https://www.facebook.com/share/p/1KSfU3jCiD/" // აქ ჩასვი კონკრეტული პოსტის ლინკი

  },

  {
  id: "ciu-cup-2",
  title: "საფეხბურთო ჩემპიონატი — CIU Cup 2",
  category: "სხვა", // ან შეგიძლია დაამატო კატეგორია "სპორტი"
  university: "CIU",
  date: "ოქტომბერი / ნოემბერი, 2026",
  location: "კავკასიის საერთაშორისო უნივერსიტეტი (თბილისი)",
  organizer: "CIU Student Self Government",
  summary: "კავკასიის საერთაშორისო უნივერსიტეტის შიდა საფეხბურთო ჩემპიონატი CIU Cup 2 სტუდენტური გუნდებისთვის.",
  tags: ["ფეხბურთი", "CIU", "სპორტი", "ჩემპიონატი"],
  link: "https://www.facebook.com/share/p/1Dnkvgxivh/" // აქ ჩასვი თარიღზე ("2 ოქტომბერი") დაჭერით დაკოპირებული ზუსტი ლინკი
},

{
  id: "ug-law-training-2026",
  title: "ტრენინგი სამართლის სტუდენტებისთვის: შედარებითი სისხლის სამართალი",
  category: "ვორქშოფი", // ან "ტრენინგი"
  university: "UG (საქართველოს უნივერსიტეტი)",
  date: "ნოემბერი, 2026",
  location: "საქართველოს უნივერსიტეტი (UG)",
  organizer: "University of Georgia (UG)",
  summary: "ტრენინგი სამართლის სტუდენტებისთვის თემაზე: შედარებითი სისხლის სამართალი — გერმანული და ქართული პერსპექტივები.",
  tags: ["სამართალი", "UG", "ტრენინგი", "სისხლის სამართალი"],
  link: "https://www.facebook.com/share/p/1ED4ewgQPt/" // აქ ჩასვი პოსტის გამოქვეყნების დროს ("2 დღე") დაჭერით დაკოპირებული ზუსტი ლინკი
}
  
];

export const REAL_TEAMMATES: TeammateItem[] = [
  {
    id: "t1",
    name: "ავთანდილ ბაღათურია",
    university: "CIU",
    role: "Full-Stack Developer",
    targetEvent: "",
    lookingFor: "",
    skills: [""],
    contact: "https://t.me/avto_dev",
    bio: ""
  }
];