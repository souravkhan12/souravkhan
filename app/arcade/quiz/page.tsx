import { CodeQuiz } from "@/components/arcade/CodeQuiz";
import { PageHeader, Section, RowList } from "@/components/ui";
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
    <>
      <PageHeader
        back={{ href: "/arcade", label: "Arcade" }}
        title="Guess the output."
        muted="One JavaScript snippet a day that doesn't do what it looks like."
        description="Resets at midnight UTC."
      />

      <section
        id="quiz"
        className="bg-surface scroll-mt-20 rounded-2xl p-5 sm:p-8"
      >
        <CodeQuiz
          question={question}
          day={day}
          puzzleNumber={puzzleNumber}
          shareUrl={`${SEO_CONFIG.baseUrl}/arcade/quiz`}
        />
      </section>

      {/* The archive is the half of this feature a crawler can read: every row
          is a static page answering a question people actually search for. */}
      <Section
        title="Every puzzle"
        subtitle="The whole bank, with the answer and the reason why."
        id="archive"
        count={archive.length}
        className="mt-6"
      >
        <RowList
          rows={archive.map(({ question: q, isToday }) => ({
            href: `/arcade/quiz/${q.id}`,
            title: questionTitle(q),
            meta: snippetPreview(q.snippet, 64),
            chip: isToday ? "today" : undefined,
            hint: q.prompt,
          }))}
        />
      </Section>
    </>
  );
}
