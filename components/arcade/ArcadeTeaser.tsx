import Link from "next/link";
import { LuArrowRight, LuGamepad2, LuBraces } from "react-icons/lu";
import { Section, GridBand, GridCell } from "@/components/ui";

/**
 * Homepage entry point for /arcade. The games themselves live on their own
 * route so they can be linked, shared and indexed — a hash fragment can't be.
 */
export function ArcadeTeaser() {
  return (
    <Section
      id="arcade"
      title="arcade"
      subtitle="a daily javascript puzzle and a game of snake — because a portfolio should be worth revisiting."
    >
      <GridBand cols="grid-cols-1 sm:grid-cols-2">
        <GridCell padded={false}>
          <Link
            href="/arcade#quiz"
            className="group flex h-full flex-col p-6 transition-colors hover:bg-gray-50 sm:p-8 dark:hover:bg-black"
          >
            <LuBraces size={18} className="text-blue" aria-hidden="true" />
            <h3 className="ss01 normal-case-force group-hover:text-blue mt-3 text-base font-semibold transition-colors">
              Guess the Output
            </h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
              One snippet a day that doesn&apos;t do what it looks like it does.
              Build a streak.
            </p>
            <span className="text-blue mt-4 inline-flex items-center gap-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100">
              play today&apos;s <LuArrowRight size={13} aria-hidden="true" />
            </span>
          </Link>
        </GridCell>

        <GridCell padded={false} tinted>
          <Link
            href="/arcade"
            className="group flex h-full flex-col p-6 transition-colors hover:bg-gray-50 sm:p-8 dark:hover:bg-black"
          >
            <LuGamepad2 size={18} className="text-blue" aria-hidden="true" />
            <h3 className="ss01 normal-case-force group-hover:text-blue mt-3 text-base font-semibold transition-colors">
              Snake
            </h3>
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
              One number to beat, shared by everyone who&apos;s played. No
              names, no sign-up.
            </p>
            <span className="text-blue mt-4 inline-flex items-center gap-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100">
              beat the score <LuArrowRight size={13} aria-hidden="true" />
            </span>
          </Link>
        </GridCell>
      </GridBand>
    </Section>
  );
}
