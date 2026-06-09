export const moods = [
  { label: "😴 خواب‌آلودم", value: "خواب‌آلودم" },
  { label: "🔥 انرژی می‌خواهم", value: "انرژی" },
  { label: "😌 آرامش می‌خواهم", value: "آرامش" },
  { label: "🥰 هوس شیرینی کردم", value: "هوس شیرینی کردم" },
  { label: "📚 دارم کار می‌کنم", value: "دارم کار می‌کنم" },
  { label: "🎉 با دوستام اومدم", value: "با دوستام اومدم" }
] as const;

export const flavors = [
  { label: "🍫 شکلاتی", value: "شکلاتی" },
  { label: "🍯 کاراملی", value: "کاراملی" },
  { label: "🌰 فندقی", value: "فندقی" },
  { label: "🍦 وانیلی", value: "وانیلی" },
  { label: "🍓 میوه‌ای", value: "میوه‌ای" },
  { label: "☕ کلاسیک", value: "کلاسیک" }
] as const;

export const temperatures = [
  { label: "🔥 گرم", value: "گرم" },
  { label: "🧊 سرد", value: "سرد" }
] as const;

export const bases = [
  { label: "☕ قهوه‌دار", value: "قهوه‌دار" },
  { label: "🥛 بدون قهوه", value: "بدون قهوه" },
  { label: "🎲 فرقی ندارد", value: "فرقی ندارد" }
] as const;

export const extras = ["خامه", "کارامل", "فندق", "وانیل", "دارچین", "شات اضافه"] as const;

export type MoodChoice = (typeof moods)[number]["value"];
export type FlavorChoice = (typeof flavors)[number]["value"];
export type TempChoice = (typeof temperatures)[number]["value"];
export type BaseChoice = (typeof bases)[number]["value"];

export type Drink = {
  name: string;
  mood: MoodChoice;
  flavor: FlavorChoice;
  temperature: TempChoice;
  base: BaseChoice;
  ingredients: string[];
  gradient: string;
};

export type RecommendationAnswers = {
  mood?: MoodChoice;
  flavor?: FlavorChoice;
  temperature?: TempChoice;
  base?: BaseChoice;
};

export const drinks: Drink[] = [
  {
    name: "آیس کارامل لاته",
    mood: "انرژی",
    flavor: "کاراملی",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "کارامل", "یخ"],
    gradient: "bg-[linear-gradient(145deg,#fff7da,#c9a227_48%,#6f4228)]"
  },
  {
    name: "کارامل ماکیاتو",
    mood: "آرامش",
    flavor: "کاراملی",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر بخار داده شده", "کارامل", "فوم شیر"],
    gradient: "bg-[linear-gradient(145deg,#fff5d7,#d7a93a_45%,#4b2e1f)]"
  },
  {
    name: "فراپه کارامل",
    mood: "هوس شیرینی کردم",
    flavor: "کاراملی",
    temperature: "سرد",
    base: "فرقی ندارد",
    ingredients: ["شیر", "یخ", "کارامل", "خامه"],
    gradient: "bg-[linear-gradient(145deg,#fffaf0,#e3bd63_45%,#8a5a32)]"
  },
  {
    name: "موکا گرم",
    mood: "آرامش",
    flavor: "شکلاتی",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "شکلات"],
    gradient: "bg-[linear-gradient(145deg,#f7dec0,#7b4930_45%,#2f1b13)]"
  },
  {
    name: "آیس موکا",
    mood: "انرژی",
    flavor: "شکلاتی",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "شکلات", "یخ"],
    gradient: "bg-[linear-gradient(145deg,#f8e3cf,#8f5a3e_42%,#26130d)]"
  },
  {
    name: "هات چاکلت",
    mood: "هوس شیرینی کردم",
    flavor: "شکلاتی",
    temperature: "گرم",
    base: "بدون قهوه",
    ingredients: ["شیر", "شکلات", "خامه"],
    gradient: "bg-[linear-gradient(145deg,#fff2e2,#9d684c_45%,#3a2015)]"
  },
  {
    name: "آیس چاکلت",
    mood: "با دوستام اومدم",
    flavor: "شکلاتی",
    temperature: "سرد",
    base: "بدون قهوه",
    ingredients: ["شیر", "شکلات", "یخ", "خامه"],
    gradient: "bg-[linear-gradient(145deg,#f9eee2,#a47155_44%,#3b2218)]"
  },
  {
    name: "وانیل لاته",
    mood: "آرامش",
    flavor: "وانیلی",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "وانیل"],
    gradient: "bg-[linear-gradient(145deg,#fff7e4,#dfc88d_48%,#765032)]"
  },
  {
    name: "آیس وانیل لاته",
    mood: "انرژی",
    flavor: "وانیلی",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "وانیل", "یخ"],
    gradient: "bg-[linear-gradient(145deg,#fff9e9,#d9c27c_45%,#64452b)]"
  },
  {
    name: "هزلنات لاته",
    mood: "دارم کار می‌کنم",
    flavor: "فندقی",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "فندق"],
    gradient: "bg-[linear-gradient(145deg,#f6e5c9,#b98144_45%,#4a2b1b)]"
  },
  {
    name: "آیس هزلنات",
    mood: "انرژی",
    flavor: "فندقی",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "فندق", "یخ"],
    gradient: "bg-[linear-gradient(145deg,#f8e8cc,#bf8648_45%,#52311f)]"
  },
  {
    name: "آمریکانو",
    mood: "دارم کار می‌کنم",
    flavor: "کلاسیک",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "آب داغ"],
    gradient: "bg-[linear-gradient(145deg,#f2ddc4,#6a3f2a_46%,#21120d)]"
  },
  {
    name: "آیس آمریکانو",
    mood: "خواب‌آلودم",
    flavor: "کلاسیک",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "آب سرد", "یخ"],
    gradient: "bg-[linear-gradient(145deg,#e8f5ff,#7a4c35_45%,#23140f)]"
  },
  {
    name: "اسپرسو دبل",
    mood: "خواب‌آلودم",
    flavor: "کلاسیک",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["دو شات اسپرسو"],
    gradient: "bg-[linear-gradient(145deg,#e9c8a3,#5c3422_45%,#160c08)]"
  },
  {
    name: "کاپوچینو",
    mood: "آرامش",
    flavor: "کلاسیک",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "فوم شیر"],
    gradient: "bg-[linear-gradient(145deg,#fff1dc,#b37a45_44%,#422617)]"
  },
  {
    name: "میلک‌شیک توت‌فرنگی",
    mood: "هوس شیرینی کردم",
    flavor: "میوه‌ای",
    temperature: "سرد",
    base: "بدون قهوه",
    ingredients: ["شیر", "بستنی", "توت‌فرنگی"],
    gradient: "bg-[linear-gradient(145deg,#fff4f4,#e97686_45%,#7e3642)]"
  },
  {
    name: "اسموتی بری",
    mood: "با دوستام اومدم",
    flavor: "میوه‌ای",
    temperature: "سرد",
    base: "بدون قهوه",
    ingredients: ["بری", "یخ", "شیر یا ماست"],
    gradient: "bg-[linear-gradient(145deg,#fff1f7,#b85b86_45%,#4c2239)]"
  },
  {
    name: "لیموناد ویژه دی",
    mood: "انرژی",
    flavor: "میوه‌ای",
    temperature: "سرد",
    base: "فرقی ندارد",
    ingredients: ["لیمو", "یخ", "نعناع", "سیروپ مخصوص"],
    gradient: "bg-[linear-gradient(145deg,#ffffe4,#d6c94d_45%,#497842)]"
  }
];

export function recommendDrink(answers: RecommendationAnswers) {
  const scored = drinks.map((drink) => {
    let score = 0;
    if (answers.flavor && drink.flavor === answers.flavor) score += 3;
    if (answers.temperature && drink.temperature === answers.temperature) score += 2;
    if (answers.base && (drink.base === answers.base || answers.base === "فرقی ندارد" || drink.base === "فرقی ندارد")) {
      score += 2;
    }
    if (answers.mood && drink.mood === answers.mood) score += 1;
    return { drink, score };
  });

  const best = scored.sort((first, second) => second.score - first.score)[0].drink;
  const matchedParts = [
    answers.flavor && best.flavor === answers.flavor ? `طعم ${answers.flavor}` : null,
    answers.temperature && best.temperature === answers.temperature ? `نوشیدنی ${answers.temperature}` : null,
    answers.base && (best.base === answers.base || answers.base === "فرقی ندارد" || best.base === "فرقی ندارد")
      ? `پایه ${answers.base}`
      : null,
    answers.mood && best.mood === answers.mood ? `حال‌وهوای ${answers.mood}` : null
  ].filter(Boolean);

  return {
    drink: best,
    reason: matchedParts.length
      ? `چون با ${matchedParts.join("، ")} هماهنگ است، این انتخاب بیشترین امتیاز را از باریستای هوشمند گرفت.`
      : "این نوشیدنی متعادل‌ترین انتخاب منوی کافه دی برای شروع است."
  };
}
