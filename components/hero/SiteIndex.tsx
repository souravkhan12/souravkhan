import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Section, GridBand, GridCell, RowList } from "@/components/ui";
import { getAllPosts } from "@/lib/blog";
import { getAllPatterns, FLAVORS, getPatterns } from "@/lib/patterns";
import {
  getAllMachineCodingQuestions,
  getMachineCodingCategories,
} from "@/lib/machine-coding";
import { getAllProjects } from "@/lib/projects";
import { getAllSetupGuides } from "@/lib/setup";
import { getBookmarks } from "@/lib/reading";
import { getAllQuestions } from "@/lib/quiz";

type Destination = {
  href: string;
  title: string;
  blurb: string;
  count: number;
  /** Singular noun; pluralised with a bare "s". */
  unit: string;
  /** Deep links into the section, so the card isn't a dead end. */
  links?: { label: string; href: string }[];
};

/**
 * The site's table of contents.
 *
 * Everything except projects and the blog used to be reachable only from ⌘K or
 * the footer, which meant a visitor scrolling the page in the obvious order
 * never learned that /patterns or /machine-coding existed. A palette is a
 * shortcut for people who already know what they're looking for; it isn't
 * discovery.
 *
 * Split into two tiers rather than one flat grid of eight, following the rule
 * the rest of the site already uses (see RowList): cards are for things with
 * their own prose, rows are for pointers. The three writing collections are
 * where someone would actually spend twenty minutes; the rest are one-line
 * destinations and shouldn't shout as loudly.
 *
 * Counts are read at build time, so a card can't advertise "12 questions"
 * three commits after it became 14.
 */
export function SiteIndex() {
  const patternLinks = FLAVORS.map((flavor) => ({
    label: `${flavor.label.toLowerCase()} ${getPatterns(flavor.slug).length}`,
    href: `/patterns/${flavor.slug}`,
  }));

  /* Tier one: the collections worth reading through. */
  const collections: Destination[] = [
    {
      href: "/blog",
      title: "writing",
      blurb:
        "long-form notes on how the web actually works — rendering, protocols, and the debugging that led there.",
      count: getAllPosts().length,
      unit: "post",
    },
    {
      href: "/patterns/vanilla",
      title: "design patterns",
      blurb:
        "the classic patterns in plain javascript and their react counterparts, side by side.",
      count: getAllPatterns().length,
      unit: "pattern",
      links: patternLinks,
    },
    {
      href: "/machine-coding",
      title: "machine coding",
      blurb:
        "frontend interview questions with the approach, a working solution, and what usually goes wrong.",
      count: getAllMachineCodingQuestions().length,
      unit: "question",
      links: getMachineCodingCategories()
        .slice(0, 2)
        .map((c) => ({
          label: c.label.toLowerCase(),
          href: `/machine-coding/category/${c.slug}`,
        })),
    },
  ];

  /* Tier two: single destinations. One line each is the honest amount of
     space they need. */
  const plural = (n: number, noun: string) =>
    `${n} ${noun}${n === 1 ? "" : "s"}`;

  const pointers = [
    {
      href: "/projects",
      title: "Projects",
      meta: `${plural(getAllProjects().length, "project")} shipped · with the decisions behind them`,
      hint: "Case studies rather than screenshots.",
    },
    {
      href: "/arcade",
      title: "Arcade",
      meta: `${plural(getAllQuestions().length, "puzzle")} · snake · one shared high score`,
      hint: "A javascript puzzle that changes daily, and a game of snake.",
    },
    {
      href: "/reading",
      title: "Reading list",
      meta: `${plural(getBookmarks().length, "bookmark")} · things i keep coming back to`,
      hint: "Things I didn't write but keep coming back to.",
    },
    {
      href: "/setup",
      title: "Setup & tools",
      meta: `${plural(getAllSetupGuides().length, "guide")} · editor, terminal, config`,
      hint: "What I actually use every day.",
    },
    {
      href: "/resume",
      title: "Résumé",
      meta: "one page · printable · always current",
      hint: "The short version.",
    },
  ];

  return (
    <Section
      id="explore"
      title="explore"
      count={collections.length + pointers.length}
      subtitle="everything on this site, in one place — so you don't have to guess what's behind the nav."
    >
      <GridBand cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((destination) => (
          <GridCell
            key={destination.href}
            padded={false}
            className="group focus-within:border-blue"
          >
            {/* The whole cell is the target. The nested deep links sit above it
                in the stacking order so they stay independently clickable —
                an <a> inside an <a> would be invalid HTML, hence the overlay
                rather than a wrapping anchor. */}
            <div className="flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-baseline gap-2">
                <h3 className="ss01 group-hover:text-blue text-base font-bold transition-colors">
                  {destination.title}
                </h3>
                <span className="font-code text-2xs text-faint tabular-nums">
                  {destination.count}
                </span>
              </div>

              <p className="text-soft mt-2 flex-1 text-sm leading-relaxed">
                {destination.blurb}
              </p>

              {destination.links && (
                <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
                  {destination.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="border-border hover:border-blue hover:text-blue font-code text-soft text-2xs border px-1.5 py-0.5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="font-code text-faint text-2xs mt-5 flex items-center gap-1.5 lowercase">
                <span className="group-hover:text-blue transition-colors">
                  {destination.count} {destination.unit}
                  {destination.count === 1 ? "" : "s"}
                </span>
                <LuArrowRight
                  size={13}
                  aria-hidden="true"
                  className="group-hover:text-blue transition-transform group-hover:translate-x-0.5"
                />
              </div>

              <Link
                href={destination.href}
                className="absolute inset-0"
                aria-label={destination.title}
              >
                <span className="sr-only">{destination.title}</span>
              </Link>
            </div>
          </GridCell>
        ))}
      </GridBand>

      <RowList rows={pointers} />
    </Section>
  );
}
