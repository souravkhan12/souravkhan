import { Section, RowList } from "@/components/ui";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Arcade",
  description:
    "A daily JavaScript 'guess the output' puzzle and a game of Snake with a global high score. Two minutes of procrastination, engineered.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/arcade` },
};

/**
 * Index for the arcade. Each game lives on its own route so a link points at
 * one game instead of loading both — /arcade/quiz and /arcade/snake.
 */
export default function ArcadePage() {
  return (
    <Section
      title="arcade"
      id="arcade"
      count={2}
      subtitle="two ways to waste two minutes. pick one."
      className="pt-8"
    >
      <RowList
        rows={[
          {
            href: "/arcade/quiz",
            title: "Guess the Output",
            meta: "javascript · new every day",
            hint: "One snippet a day that doesn't do what it looks like it does.",
          },
          {
            href: "/arcade/snake",
            title: "Snake",
            meta: "one global high score · no sign-up",
            hint: "One number to beat, shared by everyone who's played.",
          },
        ]}
      />
    </Section>
  );
}
