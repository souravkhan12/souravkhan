"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  LuCheck,
  LuX,
  LuFlame,
  LuArrowRight,
  LuShare2,
  LuCopy,
} from "react-icons/lu";
import { motion } from "motion/react";
import { MOTION } from "@/config/theme";
import { useCopy } from "@/hooks/use-copy";
import { useMounted } from "@/hooks/use-mounted";
import type { QuizQuestion } from "@/lib/quiz";

type Progress = {
  /** dayIndex of the most recently answered question. */
  lastDay: number;
  streak: number;
  answered: number;
  correct: number;
  /** Whether the last answer was right — so a reload can still show the share card. */
  lastCorrect?: boolean;
};

const STORAGE_KEY = "quiz-progress";
const EMPTY: Progress = { lastDay: -1, streak: 0, answered: 0, correct: 0 };

/**
 * The share text.
 *
 * Deliberately spoiler-free: it reports whether you got it and how long your
 * streak is, never the answer or which option you picked. That's the whole
 * mechanic — a share that gives the answer away is a share nobody clicks
 * through, and the click-through is the point.
 */
function buildShareText({
  puzzleNumber,
  correct,
  streak,
  url,
}: {
  puzzleNumber: number;
  correct: boolean;
  streak: number;
  url: string;
}): string {
  const lines = [
    `guess the output #${puzzleNumber}`,
    "",
    correct ? "🟩 got it" : "🟥 missed it",
  ];

  if (streak > 1) lines.push(`🔥 ${streak} day streak`);

  lines.push("", url);
  return lines.join("\n");
}

/* --- localStorage as an external store ------------------------------------
   useSyncExternalStore is the right primitive here: it gives us a correct SSR
   snapshot (no stored progress) and a client snapshot after hydration, without
   a setState-in-effect cascade. */

let snapshot: string | null = null;
let listeners: Array<() => void> = [];

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

function getSnapshot(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Must be referentially stable between calls or React loops forever.
    if (raw !== snapshot) snapshot = raw;
    return snapshot;
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

function writeProgress(next: Progress) {
  const serialized = JSON.stringify(next);
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    /* private mode — the question still works, the streak just won't persist */
  }
  snapshot = serialized;
  for (const listener of listeners) listener();
}

/**
 * One JavaScript snippet a day with a non-obvious result. Deterministic per UTC
 * day, so everyone sees the same question — and the explanation can link into a
 * post, which is the point: it turns a daily habit into blog traffic.
 */
export function CodeQuiz({
  question,
  day,
  puzzleNumber,
  shareUrl,
}: {
  question: QuizQuestion;
  day: number;
  /** Monotonic day counter, shown in the share card. */
  puzzleNumber: number;
  /** Absolute URL the share card points at. */
  shareUrl: string;
}) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { copied, copy } = useCopy();

  /* `navigator.share` can't be read during render without the server and the
     first client pass disagreeing about which icon to draw, so the swap waits
     until after hydration. */
  const mounted = useMounted();
  const canNativeShare =
    mounted && typeof navigator !== "undefined" && !!navigator.share;

  const progress = useMemo<Progress>(() => {
    if (!raw) return EMPTY;
    try {
      return { ...EMPTY, ...(JSON.parse(raw) as Partial<Progress>) };
    } catch {
      return EMPTY;
    }
  }, [raw]);

  const [picked, setPicked] = useState<number | null>(null);

  // Already answered today: show the explanation rather than let them re-roll.
  const playedToday = progress.lastDay === day;
  const revealed = picked !== null || playedToday;

  function choose(index: number) {
    if (revealed) return;
    setPicked(index);

    const isCorrect = index === question.answer;
    // Consecutive days only; a gap resets the streak.
    const continues = progress.lastDay === day - 1;

    writeProgress({
      lastDay: day,
      streak: isCorrect ? (continues ? progress.streak + 1 : 1) : 0,
      answered: progress.answered + 1,
      correct: progress.correct + (isCorrect ? 1 : 0),
      lastCorrect: isCorrect,
    });
  }

  // On a reload we no longer have `picked`, so the stored result is what tells
  // us whether today was a hit — otherwise the share card vanishes on refresh.
  const wasCorrect =
    picked !== null ? picked === question.answer : progress.lastCorrect;

  async function share() {
    const text = buildShareText({
      puzzleNumber,
      correct: wasCorrect === true,
      streak: progress.streak,
      url: shareUrl,
    });

    /* Native share sheet where there is one — on a phone that's the difference
       between "copied, now go find an app" and one tap into a group chat. */
    if (canNativeShare) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        /* dismissed, or not permitted — fall through to the clipboard */
      }
    }

    await copy(text);
  }

  const accuracy =
    progress.answered > 0
      ? Math.round((progress.correct / progress.answered) * 100)
      : null;

  return (
    <div className="bg-background shadow-soft overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <span className="font-code text-2xs text-soft lowercase">
          guess the output · daily
        </span>
        <div className="font-code text-2xs text-soft flex items-center gap-3">
          {progress.streak > 0 && (
            <span className="text-blue inline-flex items-center gap-1">
              <LuFlame size={12} aria-hidden="true" />
              {progress.streak} day{progress.streak === 1 ? "" : "s"}
            </span>
          )}
          {accuracy !== null && <span>{accuracy}% correct</span>}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-sm font-medium">{question.prompt}</p>

        <pre className="bg-surface font-code text-2xs mt-4 overflow-x-auto rounded-xl p-4 leading-relaxed">
          <code>{question.snippet}</code>
        </pre>

        {/* Options */}
        <div className="mt-4 grid gap-2">
          {question.options.map((option, i) => {
            const isAnswer = i === question.answer;
            const isPicked = i === picked;

            let tone =
              "border-border hover:border-blue hover:bg-blue/5 cursor-pointer";
            if (revealed) {
              if (isAnswer)
                tone =
                  "border-emerald-500/50 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400";
              else if (isPicked)
                tone = "border-red-500/50 bg-red-500/5 text-red-600";
              else tone = "border-border opacity-50";
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={revealed}
                aria-pressed={isPicked}
                className={`font-code text-2xs flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left transition-[color,background-color,border-color,transform] active:scale-[0.99] ${tone}`}
              >
                <span className="min-w-0 break-words">{option}</span>
                {revealed && isAnswer && (
                  <LuCheck size={14} className="shrink-0" aria-hidden="true" />
                )}
                {revealed && isPicked && !isAnswer && (
                  <LuX size={14} className="shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION.duration.normal }}
            className="border-border mt-5 border-t pt-4"
          >
            {picked === null ? (
              <p className="font-code text-2xs text-soft">
                you already played today — here&apos;s the answer. new question
                at midnight utc.
              </p>
            ) : (
              <p
                className={`font-code text-2xs ${
                  picked === question.answer
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500"
                }`}
              >
                {picked === question.answer ? "correct" : "not quite"}
              </p>
            )}

            <p className="text-soft mt-2 text-sm leading-relaxed">
              {question.explanation}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {/* Only offered once there's a result to report — sharing a
                  puzzle you haven't attempted says nothing. */}
              {wasCorrect !== undefined && (
                <button
                  type="button"
                  onClick={share}
                  className="border-border hover:border-blue hover:text-blue font-code text-2xs inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-gray-600 lowercase transition-[color,border-color,transform] active:scale-95 dark:text-gray-400"
                >
                  {copied ? (
                    <LuCheck size={12} aria-hidden="true" />
                  ) : canNativeShare ? (
                    <LuShare2 size={12} aria-hidden="true" />
                  ) : (
                    <LuCopy size={12} aria-hidden="true" />
                  )}
                  {copied ? "copied to clipboard" : "share result"}
                </button>
              )}

              {question.postSlug && (
                <Link
                  href={`/blog/${question.postSlug}`}
                  className="text-blue inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
                >
                  read the deep dive{" "}
                  <LuArrowRight size={13} aria-hidden="true" />
                </Link>
              )}

              <Link
                href={`/arcade/quiz/${question.id}`}
                className="hover:text-blue font-code text-2xs text-soft lowercase transition-colors"
              >
                permalink for this one →
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
