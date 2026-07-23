"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const CONFETTI = ["🎉", "✨", "🚀", "💜", "🟢", "🔵", "🟡", "🧡", "⭐", "🎊"];

export default function EasterEggs() {
  const [party, setParty] = useState(false);

  const start = useCallback(() => {
    setParty(true);
    window.clearTimeout((start as { _t?: number })._t);
    (start as { _t?: number })._t = window.setTimeout(
      () => setParty(false),
      5200,
    );
  }, []);

  // Styled console greeting — a wink for anyone who opens dev tools.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      "%c$ whoami\n%csourav khan — software engineer\n%ctry the ⌘K menu, or the konami code ↑↑↓↓←→←→ba 😉\nlike what you see? → souravkhan654@gmail.com",
      "color:#5d8cd7;font-weight:bold;font-family:monospace",
      "color:#10b981;font-family:monospace",
      "color:#8b5cf6;font-family:monospace",
    );
  }, []);

  // Konami code + a shared "party-mode" event (fired by the palette egg too).
  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = key === KONAMI[idx] ? idx + 1 : key === KONAMI[0] ? 1 : 0;
      if (idx === KONAMI.length) {
        idx = 0;
        start();
      }
    };
    const onParty = () => start();
    window.addEventListener("keydown", onKey);
    window.addEventListener("party-mode", onParty);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("party-mode", onParty);
    };
  }, [start]);

  return (
    <AnimatePresence>
      {party && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 28 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.4;
            const duration = 2.4 + Math.random() * 1.6;
            const emoji = CONFETTI[i % CONFETTI.length];
            return (
              <motion.span
                key={i}
                className="absolute top-[-8%] text-2xl"
                style={{ left: `${left}%` }}
                initial={{ y: 0, rotate: 0, opacity: 1 }}
                animate={{
                  y: "115vh",
                  rotate: Math.random() > 0.5 ? 360 : -360,
                  opacity: [1, 1, 0.9, 0],
                }}
                transition={{ duration, delay, ease: "easeIn" }}
              >
                {emoji}
              </motion.span>
            );
          })}

          <motion.div
            className="border-border bg-background absolute top-6 left-1/2 -translate-x-1/2 border px-4 py-2 text-sm font-medium shadow-xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            🎉 you found party mode — thanks for exploring!
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
