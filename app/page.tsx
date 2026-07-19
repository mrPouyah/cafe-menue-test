"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
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

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const drinkPhoto = (visual: Drink["visual"]) => `${BASE_PATH}/images/drinks/${visual}.jpg`;
const ORDER_WEBHOOK_URL = process.env.NEXT_PUBLIC_ORDER_WEBHOOK_URL ?? "";

const moodItems = moods;
const flavorItems = flavors.map((flavor) => ({
  value: flavor.value,
  label: flavor.label,
  icon: flavor.icon,
  photoUrl: `${BASE_PATH}/images/flavors/${flavor.photo}.jpg`
}));
const temperatureItems = temperatures.map((temperature) => ({
  value: temperature.value,
  label: temperature.label,
  icon: temperature.icon,
  helper: temperature.helper,
  photoUrl: `${BASE_PATH}/images/temps/${temperature.value === "گرم" ? "hot" : "cold"}.jpg`
}));
const baseItems = bases.map((base) => ({
  value: base.value,
  label: base.label,
  icon: base.icon,
  helper: base.helper
}));
const extraItems = extras.map((extra) => ({
  value: extra.label,
  label: extra.label,
  icon: extra.icon,
  photoUrl: `${BASE_PATH}/images/${extra.photo}.jpg`
}));

async function sendOrderNotification(name: string, drink: string) {
  if (!ORDER_WEBHOOK_URL) {
    console.warn("Order webhook not configured — skipping notification.");
    return;
  }
  const response = await fetch(ORDER_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, drink })
  });
  if (!response.ok) {
    throw new Error("Failed to send order notification");
  }
}

let sharedAudioCtx: AudioContext | null = null;

function playSelectFeedback() {
  if (typeof window === "undefined") return;
  if ("vibrate" in navigator) navigator.vibrate(12);
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    sharedAudioCtx = sharedAudioCtx ?? new Ctor();
    const ctx = sharedAudioCtx;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = "sine";
    osc.frequency.setValueAtTime(1150, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.07);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // audio unavailable — selection still works silently
  }
}

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

type OrderPhase = "idle" | "name" | "sending" | "error" | "done";

export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ extras: [] });
  const [orderPhase, setOrderPhase] = useState<OrderPhase>("idle");
  const [customerName, setCustomerName] = useState("");
  const result = useMemo(() => recommendDrink(answers), [answers]);
  const similar = useMemo(() => findSimilarDrink(result.drink), [result.drink]);

  const restart = () => {
    setStepIndex(0);
    setAnswers({ extras: [] });
    setOrderPhase("idle");
    setCustomerName("");
  };

  const openOrderModal = () => {
    if (orderPhase === "idle") setOrderPhase("name");
  };

  const cancelOrderModal = () => {
    setOrderPhase("idle");
  };

  const submitOrder = async () => {
    const trimmedName = customerName.trim();
    if (!trimmedName) return;
    setOrderPhase("sending");
    try {
      await sendOrderNotification(trimmedName, result.drink.name);
      setOrderPhase("done");
    } catch {
      setOrderPhase("error");
    }
  };

  const goNext = () => setStepIndex((current) => Math.min(current + 1, 6));
  const goBack = () => setStepIndex((current) => Math.max(current - 1, 0));

  const answerMood = (value: MoodChoice) => {
    playSelectFeedback();
    setAnswers((current) => ({ ...current, mood: value }));
    goNext();
  };

  const answerFlavor = (value: FlavorChoice) => {
    playSelectFeedback();
    setAnswers((current) => ({ ...current, flavor: value }));
    goNext();
  };

  const answerTemperature = (value: TempChoice) => {
    playSelectFeedback();
    setAnswers((current) => ({ ...current, temperature: value }));
    goNext();
  };

  const answerBase = (value: BaseChoice) => {
    playSelectFeedback();
    setAnswers((current) => ({ ...current, base: value }));
    goNext();
  };

  const toggleExtra = (extra: string) => {
    playSelectFeedback();
    setAnswers((current) => ({
      ...current,
      extras: current.extras.includes(extra)
        ? current.extras.filter((item) => item !== extra)
        : [...current.extras, extra]
    }));
  };

  return (
    <main className="safe-screen flex items-center justify-center px-2 py-3 text-cafe-cream sm:px-4">
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
                <WheelPicker items={moodItems} selected={answers.mood} onSelect={answerMood} itemHeight={72} />
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
                <WheelPicker items={flavorItems} selected={answers.flavor} onSelect={answerFlavor} itemHeight={84} />
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
                <WheelPicker
                  items={temperatureItems}
                  selected={answers.temperature}
                  onSelect={answerTemperature}
                  itemHeight={88}
                />
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
                <WheelPicker items={baseItems} selected={answers.base} onSelect={answerBase} itemHeight={88} />
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
                <WheelPicker items={extraItems} selected={answers.extras} onSelect={toggleExtra} itemHeight={84} multi />
              </QuestionScreen>
            )}
            {stepIndex === 6 && (
              <ResultScreen
                drink={result.drink}
                similar={similar}
                matchedParts={result.matchedParts}
                reason={result.reason}
                selectedExtras={answers.extras}
                orderPhase={orderPhase}
                customerName={customerName}
                onOrderClick={openOrderModal}
                onNameChange={setCustomerName}
                onSubmitOrder={submitOrder}
                onCancelOrder={cancelOrderModal}
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
        <p className="max-w-64 text-base font-bold leading-8 text-cafe-cream/90">
          چند سؤال کوتاه جواب بده تا نوشیدنی مناسب تو رو پیدا کنیم.
        </p>
        <span className="mt-3 text-2xl text-cafe-gold">♡</span>
      </div>
      <div className="coffee-hero" aria-hidden="true">
        <div
          className="hero-photo"
          style={{ backgroundImage: `url(${BASE_PATH}/images/drinks/hero.jpg)` }}
        />
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
        {subtitle ? <p className="mt-2 text-sm font-bold text-cafe-cream/85">{subtitle}</p> : null}
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

type WheelOption<T extends string> = {
  value: T;
  label: string;
  icon?: string;
  helper?: string;
  photoUrl?: string;
};

function WheelPicker<T extends string>({
  items,
  selected,
  onSelect,
  itemHeight = 78,
  multi = false
}: {
  items: readonly WheelOption<T>[];
  selected: T | T[] | undefined;
  onSelect: (value: T) => void;
  itemHeight?: number;
  multi?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafId = useRef<number | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userInteracted = useRef(false);
  const draggingThumb = useRef(false);
  const initialized = useRef(false);
  const initialIndex = items.findIndex((item) => item.value === selected);
  const lastFiredIndexRef = useRef(initialIndex >= 0 ? initialIndex : 0);
  const [padding, setPadding] = useState(0);

  const isSelected = (value: T) => (multi ? Array.isArray(selected) && selected.includes(value) : selected === value);

  const applyTransforms = () => {
    const container = containerRef.current;
    if (!container) return;
    const offset = container.scrollTop / itemHeight;
    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const distance = index - offset;
      const abs = Math.min(Math.abs(distance), 3);
      const scale = 1 - abs * 0.14;
      const opacity = Math.max(1 - abs * 0.32, 0.18);
      el.style.transform = `perspective(600px) rotateX(${distance * 16}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
    });
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (track && thumb) {
      const scrollableHeight = container.scrollHeight - container.clientHeight;
      const trackHeight = track.clientHeight;
      const thumbHeight = Math.max((container.clientHeight / container.scrollHeight) * trackHeight, 24);
      const progress = scrollableHeight > 0 ? container.scrollTop / scrollableHeight : 0;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${progress * (trackHeight - thumbHeight)}px)`;
    }
  };

  const settleTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), items.length - 1);
    if (!multi && clamped !== lastFiredIndexRef.current) {
      lastFiredIndexRef.current = clamped;
      onSelect(items[clamped].value);
    }
  };

  const handleScroll = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(applyTransforms);
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const container = containerRef.current;
      if (!container || !userInteracted.current) return;
      settleTo(Math.round(container.scrollTop / itemHeight));
    }, 130);
  };

  const scrollToIndex = (index: number, smooth = true) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: index * itemHeight, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setPadding(Math.max((el.clientHeight - itemHeight) / 2, 0));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [itemHeight]);

  useEffect(() => {
    if (initialized.current || padding <= 0) return;
    scrollToIndex(lastFiredIndexRef.current, false);
    applyTransforms();
    initialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [padding]);

  const handleThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    draggingThumb.current = true;
    userInteracted.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleThumbPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingThumb.current) return;
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
    const scrollableHeight = container.scrollHeight - container.clientHeight;
    container.scrollTop = ratio * scrollableHeight;
    applyTransforms();
  };

  const handleThumbPointerUp = () => {
    if (!draggingThumb.current) return;
    draggingThumb.current = false;
    const container = containerRef.current;
    if (!container) return;
    const nearest = Math.round(container.scrollTop / itemHeight);
    scrollToIndex(nearest);
    settleTo(nearest);
  };

  return (
    <div className="wheel-wrap">
      <div
        className="wheel-picker"
        ref={containerRef}
        onScroll={handleScroll}
        onPointerDown={() => {
          userInteracted.current = true;
        }}
        onWheel={() => {
          userInteracted.current = true;
        }}
        style={{ paddingTop: padding, paddingBottom: padding }}
      >
        {items.map((item, index) => (
          <button
            type="button"
            key={item.value}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`wheel-item ${isSelected(item.value) ? "selected" : ""}`}
            style={{ height: itemHeight }}
            onClick={() => {
              scrollToIndex(index);
              lastFiredIndexRef.current = index;
              onSelect(item.value);
            }}
          >
            {item.photoUrl ? (
              <span className="wheel-photo" style={{ backgroundImage: `url(${item.photoUrl})` }} />
            ) : (
              <span className="ingredient-visual">{item.icon}</span>
            )}
            <span className="wheel-text">
              <span className="wheel-label">{item.label}</span>
              {item.helper ? <span className="wheel-helper">{item.helper}</span> : null}
            </span>
            {multi ? <span className="wheel-check">{isSelected(item.value) ? "✓" : ""}</span> : null}
          </button>
        ))}
      </div>
      <div className="wheel-frame" style={{ height: itemHeight }} aria-hidden="true" />
      <div className="wheel-track" ref={trackRef}>
        <div
          className="wheel-thumb-hit"
          ref={thumbRef}
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
        >
          <div className="wheel-thumb-bar" />
        </div>
      </div>
    </div>
  );
}

function ResultScreen({
  drink,
  similar,
  matchedParts,
  reason,
  selectedExtras,
  orderPhase,
  customerName,
  onOrderClick,
  onNameChange,
  onSubmitOrder,
  onCancelOrder,
  onRestart
}: {
  drink: Drink;
  similar: Drink;
  matchedParts: string[];
  reason: string;
  selectedExtras: string[];
  orderPhase: OrderPhase;
  customerName: string;
  onOrderClick: () => void;
  onNameChange: (value: string) => void;
  onSubmitOrder: () => void;
  onCancelOrder: () => void;
  onRestart: () => void;
}) {
  const ingredients = Array.from(new Set([...drink.ingredients, ...selectedExtras]));

  return (
    <div className="grid min-h-full gap-4 p-4">
      <div className="result-photo">
        <button type="button" aria-label="علاقه‌مندی" className="round-icon absolute right-4 top-4 z-20 bg-white/90 text-cafe-gold">
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
          <h2 className="mt-4 text-[2.45rem] font-black leading-tight">{drink.name}</h2>
          <p className="mt-3 text-base font-bold leading-7 text-cafe-cream/90">
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
          <DarkButton onClick={onOrderClick} disabled={orderPhase === "done"} icon="🛍️">
            {orderPhase === "done" ? "سفارش ثبت شد ✓" : "سفارش این نوشیدنی"}
          </DarkButton>
        </div>
      </div>
      {orderPhase !== "idle" && orderPhase !== "done" && (
        <OrderNameModal
          value={customerName}
          onChange={onNameChange}
          onSubmit={onSubmitOrder}
          onCancel={onCancelOrder}
          status={orderPhase}
        />
      )}
    </div>
  );
}

function OrderNameModal({
  value,
  onChange,
  onSubmit,
  onCancel,
  status
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  status: Extract<OrderPhase, "name" | "sending" | "error">;
}) {
  return (
    <div className="order-modal-backdrop">
      <motion.form
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="order-modal-card"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <p className="text-lg font-black">اسمت چیه؟</p>
        <p className="mt-1 text-xs font-bold text-cafe-cream/75">
          تا سفارشت رو به نام خودت برای باریستا بفرستیم
        </p>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="نام و نام خانوادگی"
          className="order-modal-input"
          autoFocus
          disabled={status === "sending"}
        />
        {status === "error" && (
          <p className="mt-2 text-xs font-bold text-red-300">
            ارسال سفارش با مشکل مواجه شد. دوباره امتحان کن.
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <LightButton onClick={onCancel} icon="✕">
            انصراف
          </LightButton>
          <DarkButton onClick={onSubmit} disabled={!value.trim() || status === "sending"} icon="🛍️">
            {status === "sending" ? "در حال ارسال..." : "ثبت سفارش"}
          </DarkButton>
        </div>
      </motion.form>
    </div>
  );
}

function DrinkGlass({ visual, large = false }: { visual: Drink["visual"]; large?: boolean }) {
  return (
    <div
      className={`drink-glass ${large ? "large" : ""}`}
      style={{ backgroundImage: `url(${drinkPhoto(visual)})` }}
      aria-hidden="true"
    />
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
