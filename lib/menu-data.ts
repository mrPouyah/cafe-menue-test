export const moods = [
  { label: "خواب‌آلودم", value: "خواب‌آلودم", icon: "😴" },
  { label: "انرژی می‌خواهم", value: "انرژی", icon: "🔥" },
  { label: "آرامش می‌خواهم", value: "آرامش", icon: "😌" },
  { label: "هوس شیرینی کردم", value: "هوس شیرینی کردم", icon: "🥰" },
  { label: "دارم کار می‌کنم", value: "دارم کار می‌کنم", icon: "📚" },
  { label: "با دوستام اومدم", value: "با دوستام اومدم", icon: "🎉" }
] as const;

export const flavors = [
  { label: "شکلاتی", value: "شکلاتی", icon: "🍫" },
  { label: "کاراملی", value: "کاراملی", icon: "🟫" },
  { label: "فندقی", value: "فندقی", icon: "🌰" },
  { label: "وانیلی", value: "وانیلی", icon: "🍦" },
  { label: "میوه‌ای", value: "میوه‌ای", icon: "🍓" },
  { label: "کلاسیک", value: "کلاسیک", icon: "☕" }
] as const;

export const temperatures = [
  { label: "گرم", value: "گرم", icon: "🔥", helper: "نوشیدنی داغ و آرامش‌بخش" },
  { label: "سرد", value: "سرد", icon: "🧊", helper: "خنک، سبک و پرانرژی" }
] as const;

export const bases = [
  { label: "قهوه‌دار", value: "قهوه‌دار", icon: "☕", helper: "با پایه اسپرسو" },
  { label: "بدون قهوه", value: "بدون قهوه", icon: "🥛", helper: "بدون کافئین" },
  { label: "فرقی ندارد", value: "فرقی ندارد", icon: "🎲", helper: "هر کدام خوبه" }
] as const;

export const extras = [
  { label: "خامه", icon: "🍦" },
  { label: "کارامل", icon: "〰️" },
  { label: "فندق", icon: "🌰" },
  { label: "وانیل", icon: "🌼" },
  { label: "دارچین", icon: "🪵" },
  { label: "شات اضافه", icon: "☕" }
] as const;

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
  visual: "caramel" | "mocha" | "vanilla" | "hazelnut" | "classic" | "berry" | "lemon";
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
    visual: "caramel"
  },
  {
    name: "کارامل ماکیاتو",
    mood: "آرامش",
    flavor: "کاراملی",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر بخار داده شده", "کارامل", "فوم شیر"],
    visual: "caramel"
  },
  {
    name: "فراپه کارامل",
    mood: "هوس شیرینی کردم",
    flavor: "کاراملی",
    temperature: "سرد",
    base: "فرقی ندارد",
    ingredients: ["شیر", "یخ", "کارامل", "خامه"],
    visual: "caramel"
  },
  {
    name: "موکا گرم",
    mood: "آرامش",
    flavor: "شکلاتی",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "شکلات"],
    visual: "mocha"
  },
  {
    name: "آیس موکا",
    mood: "انرژی",
    flavor: "شکلاتی",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "شکلات", "یخ"],
    visual: "mocha"
  },
  {
    name: "هات چاکلت",
    mood: "هوس شیرینی کردم",
    flavor: "شکلاتی",
    temperature: "گرم",
    base: "بدون قهوه",
    ingredients: ["شیر", "شکلات", "خامه"],
    visual: "mocha"
  },
  {
    name: "آیس چاکلت",
    mood: "با دوستام اومدم",
    flavor: "شکلاتی",
    temperature: "سرد",
    base: "بدون قهوه",
    ingredients: ["شیر", "شکلات", "یخ", "خامه"],
    visual: "mocha"
  },
  {
    name: "وانیل لاته",
    mood: "آرامش",
    flavor: "وانیلی",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "وانیل"],
    visual: "vanilla"
  },
  {
    name: "آیس وانیل لاته",
    mood: "انرژی",
    flavor: "وانیلی",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "وانیل", "یخ"],
    visual: "vanilla"
  },
  {
    name: "هزلنات لاته",
    mood: "دارم کار می‌کنم",
    flavor: "فندقی",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "فندق"],
    visual: "hazelnut"
  },
  {
    name: "آیس هزلنات",
    mood: "انرژی",
    flavor: "فندقی",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "فندق", "یخ"],
    visual: "hazelnut"
  },
  {
    name: "آمریکانو",
    mood: "دارم کار می‌کنم",
    flavor: "کلاسیک",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "آب داغ"],
    visual: "classic"
  },
  {
    name: "آیس آمریکانو",
    mood: "خواب‌آلودم",
    flavor: "کلاسیک",
    temperature: "سرد",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "آب سرد", "یخ"],
    visual: "classic"
  },
  {
    name: "اسپرسو دبل",
    mood: "خواب‌آلودم",
    flavor: "کلاسیک",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["دو شات اسپرسو"],
    visual: "classic"
  },
  {
    name: "کاپوچینو",
    mood: "آرامش",
    flavor: "کلاسیک",
    temperature: "گرم",
    base: "قهوه‌دار",
    ingredients: ["اسپرسو", "شیر", "فوم شیر"],
    visual: "classic"
  },
  {
    name: "میلک‌شیک توت‌فرنگی",
    mood: "هوس شیرینی کردم",
    flavor: "میوه‌ای",
    temperature: "سرد",
    base: "بدون قهوه",
    ingredients: ["شیر", "بستنی", "توت‌فرنگی"],
    visual: "berry"
  },
  {
    name: "اسموتی بری",
    mood: "با دوستام اومدم",
    flavor: "میوه‌ای",
    temperature: "سرد",
    base: "بدون قهوه",
    ingredients: ["بری", "یخ", "شیر یا ماست"],
    visual: "berry"
  },
  {
    name: "لیموناد ویژه دی",
    mood: "انرژی",
    flavor: "میوه‌ای",
    temperature: "سرد",
    base: "فرقی ندارد",
    ingredients: ["لیمو", "یخ", "نعناع", "سیروپ مخصوص"],
    visual: "lemon"
  }
];

export function recommendDrink(answers: RecommendationAnswers) {
  const scored = drinks.map((drink) => {
    let score = 0;
    if (answers.flavor && drink.flavor === answers.flavor) score += 3;
    if (answers.temperature && drink.temperature === answers.temperature) score += 2;
    if (
      answers.base &&
      (drink.base === answers.base || answers.base === "فرقی ندارد" || drink.base === "فرقی ندارد")
    ) {
      score += 2;
    }
    if (answers.mood && drink.mood === answers.mood) score += 1;
    return { drink, score };
  });

  const best = scored.sort((first, second) => second.score - first.score)[0].drink;
  const matchedParts = [
    answers.mood && best.mood === answers.mood ? `حس امروزت: ${answers.mood}` : null,
    answers.flavor && best.flavor === answers.flavor ? `طعم مورد علاقه: ${answers.flavor}` : null,
    answers.temperature && best.temperature === answers.temperature ? `دمای انتخابی: ${answers.temperature}` : null,
    answers.base &&
    (best.base === answers.base || answers.base === "فرقی ندارد" || best.base === "فرقی ندارد")
      ? `پایه نوشیدنی: ${answers.base}`
      : null
  ].filter(Boolean) as string[];

  return {
    drink: best,
    matchedParts,
    reason: matchedParts.length
      ? `این نوشیدنی چون با ${matchedParts.join("، ")} هماهنگ است بیشترین امتیاز را گرفت.`
      : "این نوشیدنی متعادل‌ترین انتخاب منوی کافه دی برای شروع است."
  };
}
