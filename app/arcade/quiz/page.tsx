import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { CodeQuiz } from "@/components/arcade/CodeQuiz";
import { Section, RowList } from "@/components/ui";
import {
  getArchive,
  getDailyQuestion,
  questionTitle,
  snippetPreview,
} from "@/lib/quiz";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Guess the Output",
  description:
    "One JavaScript snippet a day with a result that isn't what you'd expect. Resets at midnight UTC — keep a streak, then browse the archive.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/arcade/quiz` },
};

// Rotates the daily question shortly after midnight UTC without a redeploy.
export const revalidate = 3600;

export default function QuizPage() {
  const { question, day, puzzleNumber } = getDailyQuestion();
  const archive = getArchive();

  return (
    <div className="pt-8">
      <div className="px-6 pb-4 sm:px-8">
        <Link
          href="/arcade"
          className="hover:text-blue font-code text-soft inline-flex items-center gap-1.5 text-xs lowercase transition-colors"
        >
          <LuArrowLeft size={13} aria-hidden="true" />
          arcade
        </Link>
      </div>

      <Section
        title="guess the output"
        subtitle="one javascript snippet a day with a result that isn't what you'd expect. resets at midnight utc."
        id="quiz"
      >
        <div className="border-border border-x border-b p-6 sm:p-8">
          <CodeQuiz
            question={question}
            day={day}
            puzzleNumber={puzzleNumber}
            shareUrl={`${SEO_CONFIG.baseUrl}/arcade/quiz`}
          />
        </div>
      </Section>

      {/* The archive is the half of this feature a crawler can read: every row
          is a static page answering a question people actually search for. */}
      <Section
        title="every puzzle"
        subtitle="the whole bank, with the answer and the reason why."
        id="archive"
        count={archive.length}
      >
        <RowList
          rows={archive.map(({ question: q, isToday }) => ({
            href: `/arcade/quiz/${q.id}`,
            title: questionTitle(q),
            meta: snippetPreview(q.snippet, 64),
            // Only today gets a chip — RowList already numbers its own rows.
            chip: isToday ? "today" : undefined,
            hint: q.prompt,
          }))}
        />
      </Section>
    </div>
  );
}
