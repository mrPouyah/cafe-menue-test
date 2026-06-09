"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  BaseChoice,
  Drink,
  FlavorChoice,
  MoodChoice,
  TempChoice,
  drinks,
  extras,
  flavors,
  moods,
  recommendDrink,
  temperatures,
  bases
} from "@/lib/menu-data";

type Answers = {
  mood?: MoodChoice;
  flavor?: FlavorChoice;
  temperature?: TempChoice;
  base?: BaseChoice;
  extras: string[];
};

const steps = ["شروع", "حس", "طعم", "دما", "پایه", "افزودنی", "پیشنهاد"] as const;
type Step = (typeof steps)[number];

const stepOrder: Step[] = [...steps];

const screenVariants = {
  initial: { opacity: 0, y: 22, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.98 }
};

export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ extras: [] });
  const currentStep = stepOrder[stepIndex];
  const progress = (stepIndex / (stepOrder.length - 1)) * 100;

  const result = useMemo(() => recommendDrink(answers), [answers]);
  const similar = useMemo(() => findSimilarDrink(result.drink), [result.drink]);

  const goNext = () => setStepIndex((value) => Math.min(value + 1, stepOrder.length - 1));
  const goBack = () => setStepIndex((value) => Math.max(value - 1, 0));
  const restart = () => {
    setAnswers({ extras: [] });
    setStepIndex(0);
  };

  const updateAnswer = <T extends keyof Answers>(key: T, value: Answers[T]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    window.setTimeout(goNext, 180);
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
    <main className="safe-screen flex items-center justify-center px-4 py-5 text-cafe-brown">
      <div className="relative w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-white/70 bg-cafe-background/82 shadow-soft backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(135deg,rgba(75,46,31,0.10),rgba(201,162,39,0.22),transparent)]" />
        <div className="relative flex min-h-[calc(100svh-2.5rem)] flex-col px-5 pb-6 pt-5 sm:min-h-[780px]">
          <TopBar
            currentStep={currentStep}
            progress={progress}
            canGoBack={stepIndex > 0 && currentStep !== "پیشنهاد"}
            onBack={goBack}
            onRestart={restart}
          />

          <AnimatePresence mode="wait">
            <motion.section
              key={currentStep}
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.34, ease: "easeOut" }}
              className="flex flex-1 flex-col"
            >
              {currentStep === "شروع" && <StartScreen onStart={goNext} />}
              {currentStep === "حس" && (
                <ChoiceScreen
                  eyebrow="قدم ۱ از ۵"
                  question="امروز چه حسی داری؟"
                  options={moods}
                  selected={answers.mood}
                  onSelect={(value) => updateAnswer("mood", value)}
                />
              )}
              {currentStep === "طعم" && (
                <ChoiceScreen
                  eyebrow="قدم ۲ از ۵"
                  question="چه طعمی دوست داری؟"
                  options={flavors}
                  selected={answers.flavor}
                  onSelect={(value) => updateAnswer("flavor", value)}
                />
              )}
              {currentStep === "دما" && (
                <ChoiceScreen
                  eyebrow="قدم ۳ از ۵"
                  question="نوشیدنی گرم یا سرد؟"
                  options={temperatures}
                  selected={answers.temperature}
                  onSelect={(value) => updateAnswer("temperature", value)}
                  columns="two"
                />
              )}
              {currentStep === "پایه" && (
                <ChoiceScreen
                  eyebrow="قدم ۴ از ۵"
                  question="پایه نوشیدنی؟"
                  options={bases}
                  selected={answers.base}
                  onSelect={(value) => updateAnswer("base", value)}
                />
              )}
              {currentStep === "افزودنی" && (
                <ExtrasScreen
                  selected={answers.extras}
                  onToggle={toggleExtra}
                  onResult={goNext}
                />
              )}
              {currentStep === "پیشنهاد" && (
                <ResultScreen
                  drink={result.drink}
                  reason={result.reason}
                  similar={similar}
                  selectedExtras={answers.extras}
                  onRestart={restart}
                />
              )}
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function TopBar({
  currentStep,
  progress,
  canGoBack,
  onBack,
  onRestart
}: {
  currentStep: Step;
  progress: number;
  canGoBack: boolean;
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <header className="relative z-10 mb-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="بازگشت"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl shadow-sm transition disabled:opacity-0"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="text-xs font-bold text-cafe-gold">کافه دی</p>
          <p className="text-sm font-black">{currentStep === "پیشنهاد" ? "پیشنهاد باریستا" : "باریستای هوشمند"}</p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          aria-label="شروع دوباره"
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-lg shadow-sm transition active:scale-95"
        >
          ↻
        </button>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/70">
        <motion.div
          className="h-full rounded-full bg-cafe-gold"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </header>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-between pb-3 pt-4">
      <div>
        <motion.div
          initial={{ rotate: -6, scale: 0.94 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto mb-8 h-56 w-56 rounded-[2rem] bg-[radial-gradient(circle_at_48%_28%,#fff7df_0_18%,#c9a227_19%_28%,#6b402a_29%_50%,#2f1b13_51%_74%,#f7ead5_75%)] p-4 shadow-soft"
        >
          <div className="flex h-full items-end justify-center rounded-[1.35rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.75))] pb-6 text-6xl">
            ☕
          </div>
        </motion.div>
        <h1 className="text-4xl font-black leading-tight tracking-normal">منوی هوشمند کافه دی</h1>
        <p className="mt-4 text-lg leading-8 text-cafe-brown/72">
          چند سؤال کوتاه جواب بده تا نوشیدنی مناسب تو رو پیدا کنیم.
        </p>
      </div>
      <PrimaryButton onClick={onStart}>شروع</PrimaryButton>
    </div>
  );
}

function ChoiceScreen<T extends string>({
  eyebrow,
  question,
  options,
  selected,
  onSelect,
  columns = "one"
}: {
  eyebrow: string;
  question: string;
  options: readonly { label: string; value: T }[];
  selected?: T;
  onSelect: (value: T) => void;
  columns?: "one" | "two";
}) {
  return (
    <div className="flex flex-1 flex-col">
      <ScreenTitle eyebrow={eyebrow} question={question} />
      <div className={columns === "two" ? "grid grid-cols-2 gap-3" : "grid gap-3"}>
        {options.map((option, index) => (
          <motion.button
            type="button"
            key={option.value}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.045 }}
            onClick={() => onSelect(option.value)}
            className={`min-h-16 rounded-2xl border px-4 py-4 text-right text-lg font-extrabold shadow-sm transition active:scale-[0.98] ${
              selected === option.value
                ? "border-cafe-gold bg-cafe-brown text-white"
                : "border-white bg-white text-cafe-brown"
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ExtrasScreen({
  selected,
  onToggle,
  onResult
}: {
  selected: string[];
  onToggle: (extra: string) => void;
  onResult: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <ScreenTitle eyebrow="قدم ۵ از ۵" question="افزودنی‌ها" />
        <div className="grid grid-cols-2 gap-3">
          {extras.map((extra, index) => {
            const isActive = selected.includes(extra);
            return (
              <motion.button
                type="button"
                key={extra}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.045 }}
                onClick={() => onToggle(extra)}
                className={`min-h-16 rounded-2xl border px-4 py-3 text-center text-base font-extrabold shadow-sm transition active:scale-[0.98] ${
                  isActive
                    ? "border-cafe-gold bg-cafe-brown text-white"
                    : "border-white bg-white text-cafe-brown"
                }`}
              >
                <span className="mb-1 block text-xl">{isActive ? "✓" : "+"}</span>
                {extra}
              </motion.button>
            );
          })}
        </div>
      </div>
      <PrimaryButton onClick={onResult}>دیدن پیشنهاد باریستا</PrimaryButton>
    </div>
  );
}

function ResultScreen({
  drink,
  reason,
  similar,
  selectedExtras,
  onRestart
}: {
  drink: Drink;
  reason: string;
  similar: Drink;
  selectedExtras: string[];
  onRestart: () => void;
}) {
  const [ordered, setOrdered] = useState(false);
  const ingredients = Array.from(new Set([...drink.ingredients, ...selectedExtras])).join("، ");

  return (
    <div className="flex flex-1 flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`mb-5 grid h-64 place-items-center rounded-[2rem] ${drink.gradient} shadow-soft`}
      >
        <div className="relative h-40 w-28">
          <div className="absolute inset-x-2 bottom-0 h-32 rounded-b-[2rem] rounded-t-xl bg-white/70 shadow-inner" />
          <div className="absolute inset-x-0 bottom-2 h-24 rounded-b-[1.6rem] rounded-t-lg bg-cafe-brown/85" />
          <div className="absolute inset-x-3 top-2 h-16 rounded-full bg-white/75" />
          <div className="absolute inset-x-9 top-0 h-5 rounded-full bg-cafe-gold" />
        </div>
      </motion.div>

      <div className="rounded-[1.6rem] bg-white p-5 shadow-sm">
        <p className="mb-2 text-sm font-black text-cafe-gold">پیشنهاد نهایی</p>
        <h2 className="text-3xl font-black leading-tight">{drink.name}</h2>
        <InfoBlock title="مواد تشکیل‌دهنده" body={ingredients} />
        <InfoBlock title="چرا این نوشیدنی؟" body={reason} />
        <InfoBlock title="پیشنهاد مشابه" body={similar.name} />
      </div>

      <div className="mt-auto grid gap-3 pt-5">
        <PrimaryButton onClick={() => setOrdered(true)}>
          {ordered ? "سفارش انتخاب شد" : "سفارش این نوشیدنی"}
        </PrimaryButton>
        <button
          type="button"
          onClick={onRestart}
          className="h-14 rounded-2xl border border-cafe-brown/12 bg-white text-base font-black text-cafe-brown transition active:scale-[0.98]"
        >
          شروع دوباره
        </button>
      </div>
    </div>
  );
}

function ScreenTitle({ eyebrow, question }: { eyebrow: string; question: string }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-black text-cafe-gold">{eyebrow}</p>
      <h2 className="text-3xl font-black leading-tight">{question}</h2>
    </div>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-4 border-t border-cafe-brown/10 pt-4">
      <p className="text-sm font-black text-cafe-brown/55">{title}</p>
      <p className="mt-1 text-base font-bold leading-7 text-cafe-brown">{body}</p>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="h-14 w-full rounded-2xl bg-cafe-brown px-5 text-base font-black text-white shadow-button"
    >
      {children}
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
