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
  /** Optional slug of a post that goes deeper — how the quiz feeds the blog. */
  postSlug: z.string().optional(),
});

export type QuizQuestion = z.infer<typeof questionSchema>;

/** What the client is allowed to see before answering. */
export type PublicQuestion = Omit<QuizQuestion, "answer" | "explanation">;

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
 * Rotates through the bank one question per UTC day. Deterministic, so the
 * server render and every client agree without any coordination.
 */
export function getDailyQuestion(date = new Date()): {
  question: QuizQuestion;
  day: number;
} {
  const questions = getAllQuestions();
  const day = dayIndex(date);
  return { question: questions[day % questions.length], day };
}
