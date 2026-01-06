"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Stethoscope, Sparkles, Music } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// ---------- Quotes (random multilingual) ----------
const DEFAULT_QUOTES = [
  {
    text: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    by: "Viktor E. Frankl",
  },
  {
    text: "إِنَّ مَعَ العُسْرِ يُسْرًا.",
    by: "علي بن أبي طالب",
  },
  {
    text: "Allt stort som skedde i världen skedde först i någon människas fantasi.",
    by: "Astrid Lindgren",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    by: "Albert Einstein",
  },
  {
    text: "كلُّ ما في الحياةِ عظيمٌ يبدأُ صغيرًا.",
    by: "جبران خليل جبران",
  },
  {
    text: "Vägen till helighet går genom vardagen.",
    by: "Dag Hammarskjöld",
  },
  {
    text: "The wound is the place where the Light enters you.",
    by: "Jalal al-Din Rumi",
  },
  {
    text: "إنَّ اللهَ إذا أحبَّ عبدًا ابتلاه.",
    by: "الحسن البصري",
  },
  {
    text: "Att leva är att förändras.",
    by: "Selma Lagerlöf",
  },
  {
    text: "Nothing in life is to be feared, it is only to be understood.",
    by: "Marie Curie",
  },
];

const isArabic = (s: string) => /[\u0600-\u06FF]/.test(s);

// ---------- Helpers ----------
function isBlendBirthday(d = new Date()) {
  return d.getMonth() === 0 && d.getDate() === 7; // Jan 7
}

function formatToday() {
  const d = new Date();
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type GratitudeRow = {
  id: number;
  text: string;
  created_at: string;
};

// ---------- Egg / Chick visual ----------
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

// ---------- Main Page ----------
export default function Page() {
  const today = useMemo(() => formatToday(), []);
  const birthday = useMemo(() => isBlendBirthday(new Date()), []);

  // Random first quote
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * DEFAULT_QUOTES.length)
  );

  const quote = useMemo(() => DEFAULT_QUOTES[quoteIndex], [quoteIndex]);

  // Random new quote (no immediate repeat)
  const newQuote = () => {
    setQuoteIndex((current) => {
      if (DEFAULT_QUOTES.length <= 1) return current;
      let next = current;
      while (next === current) {
        next = Math.floor(Math.random() * DEFAULT_QUOTES.length);
      }
      return next;
    });
  };

  // Egg state
  const [stage, setStage] = useState<"egg" | "cracked" | "chick">("egg");
  const [gratitude, setGratitude] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Supabase logs shared globally
  const [gratitudes, setGratitudes] = useState<GratitudeRow[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Load logs for everyone
  useEffect(() => {
    const loadLogs = async () => {
      setLoadingLogs(true);
      const { data, error } = await supabase
        .from("gratitude_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error) setGratitudes((data as GratitudeRow[]) ?? []);
      setLoadingLogs(false);
    };

    loadLogs();
  }, []);

  const crackEgg = () => {
    if (stage === "egg") {
      setStage("cracked");
      setTimeout(() => inputRef.current?.focus?.(), 200);
    }
  };

  const resetEgg = () => {
    setStage("egg");
    setGratitude("");
  };

  const hatchChick = async () => {
    const trimmed = gratitude.trim();
    if (!trimmed) return;
if (!supabase) {
  alert("Database is not connected yet. Please try again later.");
  return;
}
    // 1) Insert into Supabase
  const { error } = await supabase
    .from("gratitude_log")
    .insert([{ text: trimmed }]);

  if (error) {
    alert("Could not save your gratitude. Please try again.");
    return;
  }

  // 2) Reload latest logs
  const { data } = await supabase
    .from("gratitude_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  setGratitudes((data as GratitudeRow[]) ?? []);
  setGratitude("");
  setStage("chick");
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-[0.25]">
        <div className="absolute left-10 top-14 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-10 top-64 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-5xl px-6 py-14 md:py-20">
        {/* Top Header */}
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

          <p className="max-w-2xl text-pretty text-base text-white/75 md:text-lg">
  May your work be filled with calm power, steady hands, and gratitude.</p>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <Stethoscope className="h-4 w-4" />
            <span>Today: {today}</span>
          </div>

          {/* Optional photo (put blend.jpg in /public) */}
          <div className="mt-6 flex items-center gap-4">
            <img
              src="/blend.jpg"
              alt="Blend"
              className="h-20 w-20 rounded-full object-cover border border-white/20 shadow-lg"
            />
            <div className="text-sm text-white/65">
  <p className="font-medium text-white/80">Blend</p>
</div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
          {/* Left Panel: Quote + Egg input */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full">
                <motion.blockquote
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-2 text-pretty text-xl leading-relaxed md:text-2xl"
                  dir={isArabic(quote.text) ? "rtl" : "ltr"}
                >
                  “{quote.text}”
                </motion.blockquote>

                <p className="mt-3 text-sm text-white/60">— {quote.by}</p>
              </div>

              <button
                onClick={newQuote}
                className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
              >
                New quote
              </button>
            </div>

            {/* Music (optional) */}
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-white/80">
                <Music className="h-4 w-4" />
                <p className="text-sm font-medium">Music</p>
              </div>
              <p className="mt-2 text-xs text-white/60">
                Put your music file in <span className="font-medium text-white/70">/public/music.mp3</span>
              </p>

              <audio controls className="mt-3 w-full">
                <source src="/music.mp3" type="audio/mpeg" />
              </audio>
            </div>

            {/* Egg interaction */}
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-2 text-white/85">
                <Heart className="h-4 w-4" />
                <p className="text-sm font-medium">Crack an egg, write gratitude</p>
              </div>

              <p className="mt-2 text-sm text-white/70">
                Crack the egg, write something you’re grateful for, and watch it hatch.
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

          {/* Right Panel: Egg visual + history */}
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
              <p className="text-sm font-medium text-white/70">Gratitude history</p>
              <p className="mt-1 text-sm text-white/60">
                Saved for everyone — so joy can be shared.
              </p>

              <div className="mt-4 space-y-2">
                {loadingLogs ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    Loading gratitude history…
                  </div>
                ) : gratitudes.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60">
                    No hatchlings yet — crack your first egg. 🥚
                  </div>
                ) : (
                  <AnimatePresence>
                    {gratitudes.slice(0, 12).map((g) => (
                      <motion.div
                        key={g.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-sm text-white">{g.text}</p>
                        <p className="mt-1 text-xs text-white/55">
                          {new Date(g.created_at).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {gratitudes.length > 12 && (
                <p className="mt-3 text-xs text-white/50">Showing the latest 12 entries.</p>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-12 border-t border-white/10 pt-8 text-sm text-white/55">
          <p>
            Made with care for <span className="font-medium text-white/75">Blend</span> — thank you for the lives you help save.
          </p>
        </footer>
      </main>
    </div>
  );
}
