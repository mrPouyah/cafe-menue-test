"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  BaseChoice,
  Drink,
  FlavorChoice,
  MoodChoice,
  TempChoice,
  bases,
  drinks,
  extras,
  flavors,
  moods,
  recommendDrink,
  temperatures
} from "@/lib/menu-data";

type Answers = {
  mood?: MoodChoice;
  flavor?: FlavorChoice;
  temperature?: TempChoice;
  base?: BaseChoice;
  extras: string[];
};

const questionCount = 5;

const screenVariants = {
  initial: { opacity: 0, x: -18, scale: 0.985 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 18, scale: 0.985 }
};

export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ extras: [] });
  const [ordered, setOrdered] = useState(false);
  const result = useMemo(() => recommendDrink(answers), [answers]);
  const similar = useMemo(() => findSimilarDrink(result.drink), [result.drink]);

  const restart = () => {
    setStepIndex(0);
    setAnswers({ extras: [] });
    setOrdered(false);
  };

  const goNext = () => setStepIndex((current) => Math.min(current + 1, 6));
  const goBack = () => setStepIndex((current) => Math.max(current - 1, 0));

  const answerMood = (value: MoodChoice) => {
    setAnswers((current) => ({ ...current, mood: value }));
    goNext();
  };

  const answerFlavor = (value: FlavorChoice) => {
    setAnswers((current) => ({ ...current, flavor: value }));
    goNext();
  };

  const answerTemperature = (value: TempChoice) => {
    setAnswers((current) => ({ ...current, temperature: value }));
    goNext();
  };

  const answerBase = (value: BaseChoice) => {
    setAnswers((current) => ({ ...current, base: value }));
    goNext();
  };

  const toggleExtra = (extra: string) => {
    setAnswers((current) => ({
      ...current,
      extras: current.extras.includes(extra)
        ? current.extras.filter((item) => item !== extra)
        : [...current.extras, extra]
    }));
  };

  return (
    <main className="safe-screen flex items-center justify-center bg-cafe-background px-2 py-3 text-cafe-brown sm:px-4">
      <div className={`app-shell ${stepIndex === 6 ? "result-shell" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.section
            key={stepIndex}
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex min-h-full flex-col"
          >
            {stepIndex === 0 && <StartScreen onStart={goNext} />}
            {stepIndex === 1 && (
              <QuestionScreen
                step={2}
                title="امروز چه حسی داری؟"
                canContinue={Boolean(answers.mood)}
                onBack={goBack}
                onNext={goNext}
                hideNextButton
              >
                <OptionList
                  options={moods}
                  selected={answers.mood}
                  onSelect={answerMood}
                />
              </QuestionScreen>
            )}
            {stepIndex === 2 && (
              <QuestionScreen
                step={3}
                title="چه طعمی دوست داری؟"
                canContinue={Boolean(answers.flavor)}
                onBack={goBack}
                onNext={goNext}
                hideNextButton
              >
                <OptionList
                  options={flavors}
                  selected={answers.flavor}
                  onSelect={answerFlavor}
                  imageLike
                />
              </QuestionScreen>
            )}
            {stepIndex === 3 && (
              <QuestionScreen
                step={4}
                title="نوشیدنی گرم یا سرد؟"
                canContinue={Boolean(answers.temperature)}
                onBack={goBack}
                onNext={goNext}
                hideNextButton
              >
                <div className="grid gap-4">
                  {temperatures.map((option) => (
                    <VisualChoice
                      key={option.value}
                      icon={option.icon}
                      label={option.label}
                      helper={option.helper}
                      selected={answers.temperature === option.value}
                      visual={option.value === "گرم" ? "hot" : "cold"}
                      onClick={() => answerTemperature(option.value)}
                    />
                  ))}
                </div>
              </QuestionScreen>
            )}
            {stepIndex === 4 && (
              <QuestionScreen
                step={5}
                title="پایه نوشیدنی؟"
                canContinue={Boolean(answers.base)}
                onBack={goBack}
                onNext={goNext}
                hideNextButton
              >
                <div className="grid gap-3">
                  {bases.map((option) => (
                    <BaseChoiceCard
                      key={option.value}
                      option={option}
                      selected={answers.base === option.value}
                      onClick={() => answerBase(option.value)}
                    />
                  ))}
                </div>
              </QuestionScreen>
            )}
            {stepIndex === 5 && (
              <QuestionScreen
                step={6}
                title="افزودنی‌ها"
                subtitle="هر چی دوست داری انتخاب کن"
                canContinue
                onBack={goBack}
                onNext={goNext}
                nextLabel="دیدن پیشنهاد باریستا"
                nextIcon="☕"
              >
                <div className="grid grid-cols-2 gap-3">
                  {extras.map((extra) => {
                    const isSelected = answers.extras.includes(extra.label);
                    return (
                      <button
                        type="button"
                        key={extra.label}
                        onClick={() => toggleExtra(extra.label)}
                        className={`extra-card ${isSelected ? "selected" : ""}`}
                      >
                        <span className="check-dot">{isSelected ? "✓" : ""}</span>
                        <span className="text-4xl">{extra.icon}</span>
                        <span className="text-sm font-black">{extra.label}</span>
                      </button>
                    );
                  })}
                </div>
              </QuestionScreen>
            )}
            {stepIndex === 6 && (
              <ResultScreen
                drink={result.drink}
                similar={similar}
                matchedParts={result.matchedParts}
                reason={result.reason}
                selectedExtras={answers.extras}
                ordered={ordered}
                onOrder={() => setOrdered(true)}
                onRestart={restart}
              />
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex min-h-full flex-col overflow-hidden rounded-[1.65rem] px-5 pb-5 pt-4">
      <div className="mb-7 flex items-center justify-between text-xs font-black text-cafe-goldLight/80">
        <span>9:41</span>
        <span className="tracking-[0.18em]">●●● ▰</span>
      </div>
      <div className="flex flex-1 flex-col items-center text-center">
        <LogoMark />
        <h1 className="mt-12 text-[2.55rem] leading-[1.25]">
          منوی هوشمند
          <span className="block text-gold-foil text-[3.1rem] leading-[1.1]">کافه دی</span>
        </h1>
        <div className="my-5 flex items-center gap-3 text-cafe-gold">
          <span className="h-px w-7 bg-cafe-gold/50" />
          <span className="text-2xl">☕</span>
          <span className="h-px w-7 bg-cafe-gold/50" />
        </div>
        <p className="max-w-64 text-base font-bold leading-8 text-cafe-brown/80">
          چند سؤال کوتاه جواب بده تا نوشیدنی مناسب تو رو پیدا کنیم.
        </p>
        <span className="mt-3 text-2xl text-cafe-gold">♡</span>
      </div>
      <div className="coffee-hero" aria-hidden="true">
        <span className="bean bean-one" />
        <span className="bean bean-two" />
        <span className="bean bean-three" />
        <div className="latte-cup">
          <span className="latte-art" />
        </div>
      </div>
      <div className="relative z-10 mt-auto">
        <DarkButton onClick={onStart} icon="←">
          شروع
        </DarkButton>
        <div className="mt-5 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cafe-gold" />
          <span className="h-2 w-2 rounded-full bg-cafe-gold/25" />
          <span className="h-2 w-2 rounded-full bg-cafe-gold/25" />
        </div>
      </div>
    </div>
  );
}

function QuestionScreen({
  step,
  title,
  subtitle,
  children,
  canContinue,
  onBack,
  onNext,
  nextLabel = "بعدی",
  nextIcon = "←",
  hideNextButton = false
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextIcon?: string;
  hideNextButton?: boolean;
}) {
  return (
    <div className="flex min-h-full flex-col px-5 pb-5 pt-6">
      <header className="mb-7">
        <div className="mb-5 grid grid-cols-[48px_1fr_48px] items-center">
          <button type="button" onClick={onBack} aria-label="بازگشت" className="round-icon">
            ›
          </button>
          <span className="text-center text-base font-black" dir="ltr">
            {step} / 6
          </span>
        </div>
        <SegmentedProgress active={step - 1} />
      </header>
      <div className="mb-5 text-center">
        <h2 className="text-[1.72rem] font-black leading-tight">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm font-bold text-cafe-brown/70">{subtitle}</p> : null}
        <p className="mt-3 text-2xl text-cafe-gold">♡</p>
      </div>
      <div className="flex-1">{children}</div>
      <footer className="mt-6 grid grid-cols-2 gap-3">
        {step > 3 ? (
          <LightButton onClick={onBack} icon="→">
            بازگشت
          </LightButton>
        ) : (
          <span />
        )}
        {!hideNextButton ? (
          <DarkButton onClick={onNext} disabled={!canContinue} icon={nextIcon}>
            {nextLabel}
          </DarkButton>
        ) : (
          <span />
        )}
      </footer>
    </div>
  );
}

function SegmentedProgress({ active }: { active: number }) {
  return (
    <div className="mx-auto flex w-48 gap-2" dir="ltr">
      {Array.from({ length: questionCount }).map((_, index) => (
        <span
          key={index}
          className={`h-1.5 flex-1 rounded-full ${index < active ? "bg-cafe-gold" : "bg-cafe-gold/15"}`}
        />
      ))}
    </div>
  );
}

function OptionList<T extends string>({
  options,
  selected,
  onSelect,
  imageLike = false
}: {
  options: readonly { label: string; value: T; icon: string }[];
  selected?: T;
  onSelect: (value: T) => void;
  imageLike?: boolean;
}) {
  return (
    <div className="grid gap-3">
      {options.map((option, index) => (
        <motion.button
          type="button"
          key={option.value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.035 }}
          onClick={() => onSelect(option.value)}
          className={`choice-card ${selected === option.value ? "selected" : ""}`}
        >
          <span className={imageLike ? "ingredient-visual" : "text-3xl"}>{option.icon}</span>
          <span className="text-base font-black">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

function VisualChoice({
  icon,
  label,
  helper,
  selected,
  visual,
  onClick
}: {
  icon: string;
  label: string;
  helper: string;
  selected: boolean;
  visual: "hot" | "cold";
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`visual-card ${selected ? "selected" : ""}`}>
      <div className={`temperature-art ${visual}`}>
        <span className="drink-shape" />
      </div>
      <div>
        <p className="text-lg font-black">
          {label} <span>{icon}</span>
        </p>
        <p className="mt-1 text-xs font-bold text-cafe-brown/55">{helper}</p>
      </div>
    </button>
  );
}

function BaseChoiceCard({
  option,
  selected,
  onClick
}: {
  option: (typeof bases)[number];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`base-card ${selected ? "selected" : ""}`}>
      <span className="ingredient-visual">{option.icon}</span>
      <span>
        <span className="block text-base font-black">{option.label}</span>
        <span className="mt-1 block text-xs font-bold text-cafe-brown/55">{option.helper}</span>
      </span>
    </button>
  );
}

function ResultScreen({
  drink,
  similar,
  matchedParts,
  reason,
  selectedExtras,
  ordered,
  onOrder,
  onRestart
}: {
  drink: Drink;
  similar: Drink;
  matchedParts: string[];
  reason: string;
  selectedExtras: string[];
  ordered: boolean;
  onOrder: () => void;
  onRestart: () => void;
}) {
  const ingredients = Array.from(new Set([...drink.ingredients, ...selectedExtras]));

  return (
    <div className="grid min-h-full gap-4 p-4 lg:grid-cols-[1fr_1.1fr]">
      <div className="result-photo">
        <button type="button" aria-label="علاقه‌مندی" className="round-icon absolute right-4 top-4 z-20 bg-white/90">
          ♡
        </button>
        <DrinkGlass visual={drink.visual} large />
        <div className="ingredients-card">
          <h3>مواد تشکیل‌دهنده</h3>
          <div className="grid grid-cols-2 gap-3 text-sm font-bold">
            {ingredients.map((item) => (
              <span key={item}>☕ {item}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="result-copy flex flex-col gap-4 rounded-[1.7rem] p-2">
        <div className="pt-4 text-center lg:text-right">
          <p className="text-base font-black">✨ پیشنهاد باریستا برای شما</p>
          <h2 className="mt-4 text-[2.45rem] font-black leading-tight text-cafe-brown">{drink.name}</h2>
          <p className="mt-3 text-base font-bold leading-7 text-cafe-brown">
            ترکیبی خوش‌طعم و انرژی‌بخش از {drink.ingredients.slice(0, 3).join("، ")}
          </p>
        </div>
        <div className="glass-panel">
          <h3 className="mb-4 text-base font-black text-cafe-gold">این نوشیدنی انتخاب شد چون:</h3>
          <div className="grid gap-3">
            {(matchedParts.length ? matchedParts : [reason]).map((part) => (
              <p key={part} className="flex items-center gap-2 text-sm font-bold">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-cafe-gold text-xs text-white">✓</span>
                {part}
              </p>
            ))}
          </div>
        </div>
        <div className="similar-card">
          <div>
            <p className="mb-2 text-sm font-black text-cafe-gold">پیشنهاد مشابه</p>
            <h3 className="text-lg font-black">{similar.name}</h3>
          </div>
          <DrinkGlass visual={similar.visual} />
          <span className="round-mini">←</span>
        </div>
        <div className="mt-auto grid grid-cols-[0.85fr_1.45fr] gap-3">
          <LightButton onClick={onRestart} icon="↻">
            شروع دوباره
          </LightButton>
          <DarkButton onClick={onOrder} icon="🛍️">
            {ordered ? "سفارش انتخاب شد" : "سفارش این نوشیدنی"}
          </DarkButton>
        </div>
      </div>
    </div>
  );
}

function DrinkGlass({ visual, large = false }: { visual: Drink["visual"]; large?: boolean }) {
  return (
    <div className={`drink-glass ${visual} ${large ? "large" : ""}`} aria-hidden="true">
      <span className="ice ice-one" />
      <span className="ice ice-two" />
      <span className="cream-line" />
      <span className="caramel-line" />
    </div>
  );
}

function LogoMark() {
  return (
    <div className="text-center">
      <div className="relative mx-auto h-16 w-16">
        <span className="text-gold-foil absolute inset-0 grid place-items-center text-6xl font-black leading-none">
          D
        </span>
        <span className="absolute bottom-2 right-1 h-7 w-5 rotate-45 rounded-full bg-gradient-to-br from-cafe-goldLight to-cafe-gold ring-2 ring-cafe-wood" />
      </div>
      <p className="-mt-1 text-lg text-cafe-goldLight">کافه دی</p>
    </div>
  );
}

function DarkButton({
  children,
  onClick,
  icon,
  disabled = false
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className="pill-button dark"
    >
      <span>{children}</span>
      {icon ? <span className="text-xl">{icon}</span> : null}
    </motion.button>
  );
}

function LightButton({
  children,
  onClick,
  icon
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: string;
}) {
  return (
    <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onClick} className="pill-button light">
      <span>{icon}</span>
      <span>{children}</span>
    </motion.button>
  );
}

function findSimilarDrink(drink: Drink) {
  return (
    drinks.find(
      (candidate) =>
        candidate.name !== drink.name &&
        candidate.flavor === drink.flavor &&
        candidate.temperature === drink.temperature
    ) ??
    drinks.find((candidate) => candidate.name !== drink.name && candidate.flavor === drink.flavor) ??
    drinks.find((candidate) => candidate.name !== drink.name) ??
    drink
  );
}
