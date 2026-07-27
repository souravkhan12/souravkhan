"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { LuCheck, LuX, LuFlame, LuArrowRight } from "react-icons/lu";
import { motion } from "motion/react";
import { MOTION } from "@/config/theme";
import type { QuizQuestion } from "@/lib/quiz";

type Progress = {
  /** dayIndex of the most recently answered question. */
  lastDay: number;
  streak: number;
  answered: number;
  correct: number;
};

const STORAGE_KEY = "quiz-progress";
const EMPTY: Progress = { lastDay: -1, streak: 0, answered: 0, correct: 0 };

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
}: {
  question: QuizQuestion;
  day: number;
}) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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
    });
  }

  const accuracy =
    progress.answered > 0
      ? Math.round((progress.correct / progress.answered) * 100)
      : null;

  return (
    <div className="border-border border">
      {/* Header */}
      <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b bg-gray-50 px-4 py-2.5 dark:bg-black">
        <span className="font-code text-[11px] text-gray-500 lowercase">
          guess the output · daily
        </span>
        <div className="font-code flex items-center gap-3 text-[11px] text-gray-500">
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

        <pre className="border-border font-code mt-4 overflow-x-auto border bg-gray-50 p-4 text-[13px] leading-relaxed dark:bg-black">
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
                className={`font-code flex items-center justify-between gap-3 border px-4 py-2.5 text-left text-[13px] transition-colors ${tone}`}
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
              <p className="font-code text-[11px] text-gray-500">
                you already played today — here&apos;s the answer. new question
                at midnight utc.
              </p>
            ) : (
              <p
                className={`font-code text-[11px] ${
                  picked === question.answer
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500"
                }`}
              >
                {picked === question.answer ? "correct" : "not quite"}
              </p>
            )}

            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {question.explanation}
            </p>

            {question.postSlug && (
              <Link
                href={`/blog/${question.postSlug}`}
                className="text-blue mt-3 inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
              >
                read the deep dive <LuArrowRight size={13} aria-hidden="true" />
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
