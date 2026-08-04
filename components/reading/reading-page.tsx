import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { BlogProgress } from "@/components/blog/blog-progress";
import { BlogToc } from "@/components/blog/blog-toc";
import { ShareBar } from "@/components/blog/share-bar";
import {
  ReadingNav,
  type ReadingNavGroup,
} from "@/components/reading/reading-nav";
import type { Heading } from "@/lib/content";

/* Layout tokens, kept identical to the blog's so every reading page on the
   site is one system. GUTTER goes on the outer band and MEASURE on the inner
   child, never both on one element — padding inside a border-box max-width
   silently narrows the text column. */
const GUTTER = "px-6 sm:px-10";
const MEASURE = "blog-measure";
const LAYOUT = "blog-layout";
const LABEL = "font-code text-xs lowercase";

export type ReadingChip = {
  label: string;
  /** Renders as a link when set, a static chip otherwise. */
  href?: string;
};

/**
 * The frame every long-form page on the site shares: a section index on the
 * left, the article in a 40rem measure, and a contents rail on the right.
 *
 * Before this existed, blog posts had the title band and rail while patterns,
 * setup guides and machine coding questions each had their own centred
 * `max-w-3xl` article with a different back-link, a different meta line and no
 * contents at all. Four layouts for one kind of page. Everything reading-shaped
 * now goes through here, so a change to the measure or the rail lands
 * everywhere at once.
 */
export function ReadingPage({
  nav,
  back,
  chips,
  title,
  description,
  meta,
  headings,
  shareUrl,
  children,
  footer,
}: {
  nav: {
    title: string;
    href: string;
    groups: ReadingNavGroup[];
    currentHref: string;
  };
  back: { href: string; label: string };
  chips?: ReadingChip[];
  title: string;
  description?: string;
  /** Small mono facts under the title — date, reading time, difficulty. */
  meta?: React.ReactNode[];
  headings: Heading[];
  /** Omit to hide the share controls (setup guides don't need them). */
  shareUrl?: string;
  children: React.ReactNode;
  /** Prev/next, full solutions, related posts — rendered inside the measure. */
  footer?: React.ReactNode;
}) {
  return (
    <>
      <BlogProgress headings={headings} />

      <div className="reading-shell">
        <ReadingNav {...nav} />

        {/* The column rule between nav and article. On the article because it
            is the full-height element — on the nav it stopped wherever the
            list happened to end. */}
        <article
          id="blog-post-content"
          className="border-border wide:border-l min-w-0"
        >
          <header
            className={`border-border border-b bg-gray-50 ${GUTTER} py-10 sm:py-12 dark:bg-black`}
          >
            <div className={LAYOUT}>
              <div className={MEASURE}>
                <Link
                  href={back.href}
                  className={`hover:text-blue ${LABEL} text-soft inline-flex items-center gap-1.5 transition-colors`}
                >
                  <LuArrowLeft size={14} aria-hidden="true" />
                  {back.label}
                </Link>

                {chips && chips.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {chips.map((chip) =>
                      chip.href ? (
                        <Link
                          key={chip.label}
                          href={chip.href}
                          className={`border-blue/40 text-blue bg-blue/5 hover:bg-blue/10 ${LABEL} border px-2 py-0.5 transition-colors`}
                        >
                          {chip.label}
                        </Link>
                      ) : (
                        <span
                          key={chip.label}
                          className={`border-border ${LABEL} text-soft border px-2 py-0.5`}
                        >
                          {chip.label}
                        </span>
                      ),
                    )}
                  </div>
                )}

                {/* text-balance stops a long title dropping one orphan word */}
                <h1 className="ss01 normal-case-force page-title mt-4 text-balance">
                  {title}
                </h1>

                {description && (
                  <p className="text-soft mt-3.5 text-base leading-relaxed">
                    {description}
                  </p>
                )}

                {meta && meta.length > 0 && (
                  <div
                    className={`${LABEL} text-soft mt-6 flex flex-wrap items-center gap-2.5`}
                  >
                    {meta.map((item, index) => (
                      <span key={index} className="flex items-center gap-2.5">
                        {index > 0 && (
                          <span
                            aria-hidden="true"
                            className="bg-border h-3 w-px"
                          />
                        )}
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className={GUTTER}>
            <div className={`${LAYOUT} pt-12 pb-20`}>
              <div
                className={`prose prose-a:text-blue prose-a:no-underline hover:prose-a:underline ${MEASURE}`}
              >
                {children}

                {shareUrl && (
                  // not-prose: the prose block would restyle the row's own
                  // spacing and link colours.
                  <div className="not-prose">
                    <ShareBar url={shareUrl} />
                  </div>
                )}

                {footer && <div className="not-prose">{footer}</div>}
              </div>

              <BlogToc
                headings={headings}
                footer={
                  shareUrl ? (
                    <ShareBar url={shareUrl} variant="rail" />
                  ) : undefined
                }
              />
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

/**
 * The prev/next pair used at the foot of most reading pages. Extracted here so
 * patterns, machine coding and the blog don't each keep their own copy of the
 * same flex row.
 */
export function ReadingPrevNext({
  prev,
  next,
}: {
  prev?: { href: string; title: string } | null;
  next?: { href: string; title: string } | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav className="border-border font-code mt-12 flex items-stretch border-t pt-4 text-xs">
      {prev ? (
        <Link
          href={prev.href}
          rel="prev"
          className="hover:text-blue text-soft flex min-w-0 flex-1 items-center gap-2 py-2 transition-colors"
        >
          <LuArrowLeft size={14} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{prev.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}

      {next && (
        <Link
          href={next.href}
          rel="next"
          className="hover:text-blue text-soft flex min-w-0 flex-1 items-center justify-end gap-2 py-2 text-right transition-colors"
        >
          <span className="truncate">{next.title}</span>
          <LuArrowLeft
            size={14}
            aria-hidden="true"
            className="shrink-0 rotate-180"
          />
        </Link>
      )}
    </nav>
  );
}
