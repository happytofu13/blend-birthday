"use client";

import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Stethoscope, Sparkles } from "lucide-react";

type Gratitude = { text: string; at: string };

const DEFAULT_QUOTES = [
  {
     text: "Even when the days are hard, you bring calm into chaos.",
    by: "Fida",
  },
];

function useTodayLocal() {
  return useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);
}

function isBlendBirthday(d = new Date()) {
  return d.getMonth() === 0 && d.getDate() === 7; // Jan 7
}

function EggChick({ stage }: { stage: "egg" | "cracked" | "chick" }) {
  const isEgg = stage === "egg";
  const isCracked = stage === "cracked";
  const isChick = stage === "chick";

  return (
    <div className="relative h-56 w-56 select-none">
      <AnimatePresence mode="wait">
        {(isEgg || isCracked) && (
          <motion.div
            key={stage}
            initial={{ scale: 0.9, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={isEgg ? "An egg" : "A cracked egg"}
          >
            <div className="relative">
              <div className="absolute -bottom-3 left-1/2 h-4 w-36 -translate-x-1/2 rounded-full bg-black/10 blur-sm" />
              <motion.div
                className="h-44 w-36 rounded-[999px] bg-white/80 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur"
                animate={{ rotate: isCracked ? [0, -2, 2, -1, 1, 0] : 0 }}
                transition={{ duration: 0.6 }}
              />
              <AnimatePresence>
                {isCracked && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="pointer-events-none absolute inset-0"
                  >
                    <svg
                      className="absolute left-1/2 top-10 -translate-x-1/2"
                      width="120"
                      height="130"
                      viewBox="0 0 120 130"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M60 5 L55 25 L70 40 L52 55 L68 72 L50 90 L62 110"
                        stroke="rgba(0,0,0,0.25)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {isChick && (
          <motion.div
            key="chick"
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="A small chicken"
          >
            <div className="relative">
              <div className="absolute -bottom-3 left-1/2 h-4 w-36 -translate-x-1/2 rounded-full bg-black/10 blur-sm" />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-44 w-44"
              >
                <div className="absolute left-1/2 top-10 h-28 w-28 -translate-x-1/2 rounded-full bg-yellow-300/90 shadow-[0_18px_50px_rgba(0,0,0,0.12)]" />
                <div className="absolute left-1/2 top-4 h-20 w-20 -translate-x-1/2 rounded-full bg-yellow-200/90" />
                <div className="absolute left-[44%] top-12 h-2.5 w-2.5 rounded-full bg-black/70" />
                <div className="absolute left-[56%] top-12 h-2.5 w-2.5 rounded-full bg-black/70" />
                <div className="absolute left-1/2 top-[54px] h-0 w-0 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-orange-400" />
                <motion.div
                  className="absolute left-6 top-[78px] h-14 w-10 rounded-[999px] bg-yellow-200/80"
                  animate={{ rotate: [0, -12, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute right-6 top-[78px] h-14 w-10 rounded-[999px] bg-yellow-200/80"
                  animate={{ rotate: [0, 12, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute left-[42%] top-[144px] h-2 w-8 rounded-full bg-orange-400/80" />
                <div className="absolute left-[54%] top-[144px] h-2 w-8 rounded-full bg-orange-400/80" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Page() {
  const today = useTodayLocal();
  const birthday = useMemo(() => isBlendBirthday(new Date()), []);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [customQuote, setCustomQuote] = useState(() => {
    try {
      return localStorage.getItem("blend_custom_quote") ?? "";
    } catch {
      return "";
    }
  });

  const [customBy, setCustomBy] = useState(() => {
    try {
      return localStorage.getItem("blend_custom_quote_by") ?? "";
    } catch {
      return "";
    }
  });

  const quote = useMemo(() => {
    const base = DEFAULT_QUOTES[quoteIndex % DEFAULT_QUOTES.length];
    const text = customQuote.trim() || base.text;
    const by = (customBy.trim() || base.by).trim();
    return { text, by };
  }, [quoteIndex, customQuote, customBy]);

  const [stage, setStage] = useState<"egg" | "cracked" | "chick">("egg");
  const [gratitude, setGratitude] = useState("");
  const [gratitudes, setGratitudes] = useState<Gratitude[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cycleQuote = () => setQuoteIndex((i) => i + 1);

  const saveCustomQuote = () => {
    try {
      localStorage.setItem("blend_custom_quote", customQuote);
      localStorage.setItem("blend_custom_quote_by", customBy);
    } catch {}
  };

  const resetCustomQuote = () => {
    setCustomQuote("");
    setCustomBy("");
    try {
      localStorage.removeItem("blend_custom_quote");
      localStorage.removeItem("blend_custom_quote_by");
    } catch {}
  };

  const crackEgg = () => {
    if (stage === "egg") {
      setStage("cracked");
      setTimeout(() => inputRef.current?.focus?.(), 150);
    }
  };

  const hatchChick = () => {
    const trimmed = gratitude.trim();
    if (!trimmed) return;
    setGratitudes((g) => [{ text: trimmed, at: new Date().toISOString() }, ...g]);
    setGratitude("");
    setStage("chick");
  };

  const resetEgg = () => {
    setStage("egg");
    setGratitude("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-[0.25]">
        <div className="absolute left-10 top-14 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-10 top-64 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-5xl px-6 py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            <span>
              {birthday ? (
                <>
                  Happy Birthday, <span className="font-semibold text-white">Blend</span>! • 7 January
                </>
              ) : (
                <>
                  For <span className="font-semibold text-white">Blend</span> • Birthday on 7 January
                </>
              )}
            </span>
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Joy can grow even in the toughest shifts.
          </h1>
<img
  src="/blend.jpg"
  alt="Blend"
  className="mt-6 h-40 w-40 rounded-full object-cover border border-white/20 shadow-lg"
/>

          <p className="max-w-2xl text-pretty text-base text-white/75 md:text-lg">
            For a doctor who shows up when life is at its messiest — may your new year be filled with calm moments,
            steady hands, and bright little hatchlings of gratitude.
          </p>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <Stethoscope className="h-4 w-4" />
            <span>Today: {today}</span>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full">
                <p className="text-sm font-medium text-white/70">Wholesome quote</p>

                <motion.blockquote
                  key={quoteIndex + (customQuote.trim() ? 1000 : 0)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-3 text-pretty text-xl leading-relaxed md:text-2xl"
                >
                  “{quote.text}”
                </motion.blockquote>

                <p className="mt-3 text-sm text-white/60">— {quote.by}</p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium text-white/70">Edit the quote (optional)</p>
                  <p className="mt-1 text-xs text-white/55">
                    This saves in the browser so Blend keeps seeing your custom quote.
                  </p>

                  <div className="mt-3 grid gap-2">
                    <input
                      value={customQuote}
                      onChange={(e) => setCustomQuote(e.target.value)}
                      placeholder="Type your inspiring quote here…"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <input
                      value={customBy}
                      onChange={(e) => setCustomBy(e.target.value)}
                      placeholder="Quote author (e.g., You, Rumi, Unknown)…"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-white/20"
                    />

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={saveCustomQuote}
                        className="rounded-full bg-white text-slate-950 px-4 py-2 text-sm font-medium hover:bg-white/90"
                      >
                        Save quote
                      </button>
                      <button
                        onClick={resetCustomQuote}
                        className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={cycleQuote}
                className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                New quote
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-white/85">
                <Heart className="h-4 w-4" />
                <p className="text-sm font-medium">Tiny practice for hard days</p>
              </div>

              <p className="mt-2 text-sm text-white/70">
                Crack the egg, write one thing you’re grateful for, and watch it turn into a little chicken.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={crackEgg}
                    disabled={stage !== "egg"}
                    className="rounded-full bg-white text-slate-950 px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-50"
                  >
                    Crack the egg
                  </button>

                  <button
                    onClick={resetEgg}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
                  >
                    Reset
                  </button>
                </div>

                <AnimatePresence>
                  {stage === "cracked" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 flex flex-col gap-2">
                        <label className="text-sm text-white/70">What are you grateful for today?</label>

                        <div className="flex gap-2">
                          <input
                            ref={inputRef}
                            value={gratitude}
                            onChange={(e) => setGratitude(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") hatchChick();
                            }}
                            placeholder="e.g., a calm patient, a kind nurse, warm coffee…"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-white/20"
                          />

                          <button
                            onClick={hatchChick}
                            className="rounded-xl bg-white text-slate-950 px-4 py-2 text-sm font-medium hover:bg-white/90"
                          >
                            Hatch
                          </button>
                        </div>

                        <p className="text-xs text-white/55">
                          Tip: press <span className="font-medium text-white/70">Enter</span> to hatch.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {stage === "chick" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-sm text-white/75">Your gratitude hatched a chick. 🐣</p>
                      <p className="mt-1 text-sm text-white">“{gratitudes?.[0]?.text ?? ""}”</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={resetEgg}
                          className="rounded-full bg-white text-slate-950 px-4 py-2 text-sm font-medium hover:bg-white/90"
                        >
                          Crack another egg
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">Your egg</p>
                <p className="mt-2 text-sm text-white/60">Tap the egg to crack it.</p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                Stage: <span className="font-medium text-white">{stage}</span>
              </div>
            </div>

            <motion.button
              onClick={crackEgg}
              className="mt-6 flex w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Crack the egg"
            >
              <EggChick stage={stage} />
            </motion.button>

            <div className="mt-8">
              <p className="text-sm font-medium text-white/70">Gratitude hatchlings</p>
              <p className="mt-1 text-sm text-white/60">
                Each egg becomes a small reminder that good things still exist.
              </p>

              <div className="mt-4 space-y-2">
                <AnimatePresence>
                  {gratitudes.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60"
                    >
                      No hatchlings yet — crack your first egg. 🥚
                    </motion.div>
                  ) : (
                    gratitudes.slice(0, 6).map((g) => (
                      <motion.div
                        key={g.at}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-sm text-white">{g.text}</p>
                        <p className="mt-1 text-xs text-white/55">
                          {new Date(g.at).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {gratitudes.length > 6 && (
                <p className="mt-3 text-xs text-white/50">Showing the latest 6 hatchlings.</p>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-12 border-t border-white/10 pt-8 text-sm text-white/55">
          <p>
            Made with care for <span className="font-medium text-white/75">Blend</span> — thank you for the lives you
            help save.
          </p>
          <p className="mt-2 text-xs text-white/45">
            Hint: Replace the quote with a personal memory to make this even sweeter.
          </p>
        </footer>
      </main>
    </div>
  );
}
