import fs from "fs";
import path from "path";
import { z } from "zod";

const QUIZ_FILE = path.join(process.cwd(), "content/quiz/questions.json");

const questionSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  snippet: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  answer: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
  /**
   * Headline for the puzzle's permalink — the archive page's <h1> and <title>.
   * Write it as the question someone would actually type into Google
   * ("Why does [10, 9, 1].sort() return [1, 10, 9]?"), because long-tail search
   * is the whole reason the permalinks exist. Falls back to `prompt`.
   */
  title: z.string().min(1).optional(),
  /** Optional slug of a post that goes deeper — how the quiz feeds the blog. */
  postSlug: z.string().optional(),
});

export type QuizQuestion = z.infer<typeof questionSchema>;

/** What the client is allowed to see before answering. */
export type PublicQuestion = Omit<QuizQuestion, "answer" | "explanation">;

/** A puzzle plus where it sits in the bank — what the archive list renders. */
export type ArchiveEntry = {
  question: QuizQuestion;
  /** 1-based position in the bank. Stable as long as entries are appended. */
  number: number;
  /** True for the puzzle currently on the daily page. */
  isToday: boolean;
};

export function getAllQuestions(): QuizQuestion[] {
  const raw = JSON.parse(fs.readFileSync(QUIZ_FILE, "utf-8"));
  const parsed = z.array(questionSchema).safeParse(raw);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content/quiz/questions.json:\n${issues}`);
  }

  return parsed.data;
}

/** Days since the Unix epoch, in UTC — the same number for every visitor. */
export function dayIndex(date = new Date()): number {
  return Math.floor(date.getTime() / 86_400_000);
}

/**
 * The UTC day the daily puzzle started counting from. Puzzle numbers in share
 * cards are relative to this, so they increment by one every day the way
 * Wordle's do — the bank index would repeat every `questions.length` days and
 * make two different days share a number.
 */
const LAUNCH_DAY = Date.UTC(2026, 6, 29) / 86_400_000;

/**
 * Rotates through the bank one question per UTC day. Deterministic, so the
 * server render and every client agree without any coordination.
 */
export function getDailyQuestion(date = new Date()): {
  question: QuizQuestion;
  day: number;
  /** Monotonic day counter shown in share cards ("guess the output #14"). */
  puzzleNumber: number;
} {
  const questions = getAllQuestions();
  const day = dayIndex(date);
  return {
    question: questions[day % questions.length],
    day,
    // Clamped so a clock set before launch can't render "#-3".
    puzzleNumber: Math.max(1, day - LAUNCH_DAY + 1),
  };
}

/** Looks up one puzzle by its permalink id. `null` when nothing matches. */
export function getQuestionById(id: string): QuizQuestion | null {
  return getAllQuestions().find((q) => q.id === id) ?? null;
}

/**
 * Every puzzle in bank order, newest-facing metadata attached.
 *
 * The whole bank is public: the rotation has already served each entry many
 * times over, so there is nothing left to withhold — and each one is an
 * indexable page answering a real search query, which is the point.
 */
export function getArchive(date = new Date()): ArchiveEntry[] {
  const todayId = getDailyQuestion(date).question.id;

  return getAllQuestions().map((question, i) => ({
    question,
    number: i + 1,
    isToday: question.id === todayId,
  }));
}

/** The headline for a puzzle's permalink, falling back to its prompt. */
export function questionTitle(question: QuizQuestion): string {
  return question.title ?? question.prompt;
}

/** Collapses a snippet to one line for list rows and meta descriptions. */
export function snippetPreview(snippet: string, max = 72): string {
  const flat = snippet.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}
