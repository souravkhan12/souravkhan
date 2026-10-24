import Link from "next/link";
import { HomeSection } from "@/components/home/HomeSection";
import { getAllPosts } from "@/lib/blog";
import { getAllPatterns } from "@/lib/patterns";
import { getAllMachineCodingQuestions } from "@/lib/machine-coding";
import { getAllProjects } from "@/lib/projects";
import { getAllSetupGuides } from "@/lib/setup";
import { getBookmarks } from "@/lib/reading";
import { getAllQuestions } from "@/lib/quiz";

/**
 * The site's table of contents.
 *
 * Everything except the blog is otherwise reachable only from ⌘K or the
 * footer, and a palette is a shortcut for people who already know what
 * they're looking for — it isn't discovery. One row per destination, in the
 * same quiet register as the rest of the homepage.
 *
 * Counts are read at build time, so a row can't advertise "12 questions"
 * three commits after it became 14.
 */
export function SiteIndex() {
  const plural = (n: number, noun: string) =>
    `${n} ${noun}${n === 1 ? "" : "s"}`;

  const rows = [
    {
      href: "/blog",
      title: "Writing",
      blurb: "How the web actually works: rendering, protocols, performance.",
      meta: plural(getAllPosts().length, "post"),
    },
    {
      href: "/patterns/vanilla",
      title: "Design patterns",
      blurb: "Classic patterns in plain JavaScript and in React, side by side.",
      meta: plural(getAllPatterns().length, "pattern"),
    },
    {
      href: "/machine-coding",
      title: "Machine coding",
      blurb: "Frontend interview questions with approach and working solution.",
      meta: plural(getAllMachineCodingQuestions().length, "question"),
    },
    {
      href: "/projects",
      title: "Projects",
      blurb: "Case studies, with the decisions behind them.",
      meta: plural(getAllProjects().length, "project"),
    },
    {
      href: "/arcade",
      title: "Arcade",
      blurb: "A daily JavaScript puzzle and a game of snake.",
      meta: plural(getAllQuestions().length, "puzzle"),
    },
    {
      href: "/reading",
      title: "Reading list",
      blurb: "Things I didn't write but keep coming back to.",
      meta: plural(getBookmarks().length, "bookmark"),
    },
    {
      href: "/setup",
      title: "Setup guides",
      blurb: "Editor and terminal, configured end to end.",
      meta: plural(getAllSetupGuides().length, "guide"),
    },
    {
      href: "/resume",
      title: "Résumé",
      blurb: "One page, printable.",
      meta: "1 page",
    },
  ];

  return (
    <HomeSection id="explore" label="Explore">
      <ul className="flex flex-col">
        {rows.map((row) => (
          <li key={row.href}>
            <Link
              href={row.href}
              className="group flex items-baseline justify-between gap-4 py-2.5"
            >
              <span className="min-w-0 text-sm">
                <span className="group-hover:text-blue font-bold transition-colors">
                  {row.title}
                </span>
                <span className="text-soft hidden sm:inline">
                  {" "}
                  — {row.blurb}
                </span>
              </span>
              <span className="font-code text-faint text-2xs group-hover:text-blue shrink-0 transition-colors">
                {row.meta} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
