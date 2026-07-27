import SnakeGame from "@/components/arcade/SnakeGame";
import { CodeQuiz } from "@/components/arcade/CodeQuiz";
import { Section } from "@/components/ui";
import { getDailyQuestion } from "@/lib/quiz";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Arcade",
  description:
    "A daily JavaScript 'guess the output' puzzle and a game of Snake with a global high score. Two minutes of procrastination, engineered.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/arcade` },
};

// Rotates the daily question shortly after midnight UTC without a redeploy.
export const revalidate = 3600;

export default function ArcadePage() {
  const { question, day } = getDailyQuestion();

  return (
    <>
      <Section
        title="guess the output"
        subtitle="one javascript snippet a day with a result that isn't what you'd expect. resets at midnight utc."
        className="pt-8"
        id="quiz"
      >
        <div className="border-border border-x border-b p-6 sm:p-8">
          <CodeQuiz question={question} day={day} />
        </div>
      </Section>

      <SnakeGame />
    </>
  );
}
