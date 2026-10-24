import Image from "next/image";
import Link from "next/link";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { BlogProgress } from "@/components/blog/blog-progress";
import { BlogToc } from "@/components/blog/blog-toc";
import { ShareBar } from "@/components/blog/share-bar";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Heading } from "@/lib/content";

export type ReadingChip = {
  label: string;
  /** Renders as a link when set, a static chip otherwise. */
  href?: string;
};

/**
 * The frame every long-form page on the site shares — posts, patterns,
 * machine coding, setup guides.
 *
 * It sits in the same 860px column as the homepage: a hero-style header,
 * the prose in a readable measure, and diagrams/code breaking out to the
 * column's full width. The contents rail hangs in the right margin from the
 * `wide` breakpoint up (see .reading-rail in globals.css); below that,
 * BlogProgress's floating "contents" pill does the same job.
 */
export function ReadingPage({
  back,
  chips,
  title,
  description,
  meta,
  image,
  headings,
  shareUrl,
  before,
  children,
  footer,
}: {
  back: { href: string; label: string };
  chips?: ReadingChip[];
  title: string;
  description?: string;
  /** Small mono facts under the title — date, reading time, difficulty. */
  meta?: React.ReactNode[];
  /** Cover art, shown as a rounded card under the header. */
  image?: { src: string; alt: string };
  headings: Heading[];
  /** Omit to hide the share controls (setup guides don't need them). */
  shareUrl?: string;
  /** Rendered at the top of the prose — e.g. the series navigator. */
  before?: React.ReactNode;
  children: React.ReactNode;
  /** Prev/next, full solutions, related posts — rendered under the article. */
  footer?: React.ReactNode;
}) {
  return (
    <>
      <BlogProgress headings={headings} />

      <article id="blog-post-content">
        <PageHeader back={back} title={title} description={description}>
          {(!!chips?.length || !!meta?.length) && (
            <div className="flex flex-col gap-4">
              {meta && meta.length > 0 && (
                <div className="font-code text-faint text-2xs flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  {meta.map((item, index) => (
                    <span key={index} className="flex items-center gap-2.5">
                      {index > 0 && <span aria-hidden="true">·</span>}
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {chips && chips.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((chip) =>
                    chip.href ? (
                      <Link
                        key={chip.label}
                        href={chip.href}
                        className="bg-surface text-soft hover:text-foreground hover:bg-surface-hover rounded-full px-3 py-1 text-xs transition-colors"
                      >
                        {chip.label}
                      </Link>
                    ) : (
                      <span
                        key={chip.label}
                        className="bg-surface text-soft rounded-full px-3 py-1 text-xs"
                      >
                        {chip.label}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </PageHeader>

        {image && (
          <div className="bg-surface shadow-soft relative mb-10 aspect-[2/1] w-full overflow-hidden rounded-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        )}

        {/* `relative` anchors the contents rail to this block, so it starts
            level with the first paragraph and stays sticky to the end. */}
        <div className="relative pb-8">
          <div className="prose prose-a:text-blue prose-a:no-underline hover:prose-a:underline blog-measure">
            {before}
            {children}

            {shareUrl && (
              // not-prose: the prose block would restyle the row's own
              // spacing and link colours.
              <div className="not-prose">
                <ShareBar url={shareUrl} />
              </div>
            )}
          </div>

          <aside className="reading-rail">
            <BlogToc
              headings={headings}
              footer={
                shareUrl ? (
                  <ShareBar url={shareUrl} variant="rail" />
                ) : undefined
              }
            />
          </aside>
        </div>
      </article>

      {footer && <div className="pb-4">{footer}</div>}
    </>
  );
}

/**
 * The prev/next pair at the foot of a reading page: two soft cards that
 * lift on hover, the arrow nudging in the direction of travel.
 */
export function ReadingPrevNext({
  prev,
  next,
}: {
  prev?: { href: string; title: string } | null;
  next?: { href: string; title: string } | null;
}) {
  if (!prev && !next) return null;

  const card =
    "group bg-background shadow-soft flex min-w-0 flex-1 flex-col gap-1 rounded-2xl px-5 py-4 transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-0.5";

  return (
    <nav
      aria-label="More in this section"
      className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {prev ? (
        <Link href={prev.href} rel="prev" className={card}>
          <span className="font-code text-faint text-2xs flex items-center gap-1.5">
            <LuArrowLeft
              size={13}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Previous
          </span>
          <span className="truncate text-sm font-semibold">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      {next && (
        <Link
          href={next.href}
          rel="next"
          className={`${card} sm:items-end sm:text-right`}
        >
          <span className="font-code text-faint text-2xs flex items-center gap-1.5">
            Next
            <LuArrowRight
              size={13}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
          <span className="max-w-full truncate text-sm font-semibold">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
