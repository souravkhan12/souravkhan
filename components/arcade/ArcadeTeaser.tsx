import { Section, RowList } from "@/components/ui";

/**
 * Homepage entry point for /arcade. The games themselves live on their own
 * routes so they can be linked, shared and indexed — a hash fragment can't be.
 */
export function ArcadeTeaser() {
  return (
    <Section
      id="arcade"
      title="arcade"
      count={2}
      subtitle="a daily javascript puzzle and a game of snake — because a portfolio should be worth revisiting."
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
