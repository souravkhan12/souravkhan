import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostBySlug,
  getPostHeadings,
  getRelatedPosts,
  getSeriesPosts,
  tagSlug,
} from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { mdxComponents } from "@/components/blog/mdx-components";
import { BlogProgress } from "@/components/blog/blog-progress";
import { BlogToc } from "@/components/blog/blog-toc";
import { BlogSchemaMarkup } from "@/components/blog/BlogSchemaMarkup";
import { SeriesNav } from "@/components/blog/series-nav";
import { ShareBar } from "@/components/blog/share-bar";
import { SEO_CONFIG } from "@/config/seo";

/* ------------------------------------------------------------------ *
 * Layout tokens
 *
 * GUTTER always goes on the outer band and MEASURE on the inner child,
 * never both on one element — that was the old bug: padding inside a
 * border-box max-width shrank the text column to 592px while the title
 * band above it ran a true 768px.
 *
 * The widths themselves live in globals.css as --blog-measure and
 * --blog-wide so the MDX diagram components can share them via
 * .blog-breakout. Change the measure in one place and the header, the
 * body, the footer and every diagram panel follow.
 * ------------------------------------------------------------------ */

const GUTTER = "px-6 sm:px-10";
const MEASURE = "blog-measure";
const WIDE = "blog-wide";
/** Article column + sticky contents rail from lg up; one column below it. */
const LAYOUT = "blog-layout";

/** font-code eyebrow / label. text-xs is 14px on this scale — the smallest
    token the site defines. The old text-[11px] / text-xs / text-[13px] mix
    put three different sizes on the same class of element, all of them below
    the scale's floor. */
const LABEL = "font-code text-xs lowercase";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SEO_CONFIG.baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    // Points cross-posted copies on dev.to / Hashnode back at the original.
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.updated ?? post.date).toISOString(),
      authors: [SEO_CONFIG.author],
      tags: post.tags,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      // summary_large_image needs an image or it silently degrades to a
      // plain summary card.
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = getPostHeadings(post);
  // Tag-overlap scored, so "keep reading" stays on-topic instead of just recent.
  const more = getRelatedPosts(post.slug, 2);
  const series = post.series ? getSeriesPosts(post.series) : [];
  // Absolute — share intents and the clipboard both need a full URL.
  const url = `${SEO_CONFIG.baseUrl}/blog/${post.slug}`;

  return (
    <>
      <BlogSchemaMarkup post={post} />
      <BlogProgress headings={headings} />

      <article id="blog-post-content">
        {/* Title band — mirrors the homepage's section header treatment */}
        <header
          className={`border-border border-b bg-gray-50 ${GUTTER} py-10 sm:py-12 dark:bg-black`}
        >
          <div className={LAYOUT}>
            <div className={MEASURE}>
              <Link
                href="/blog"
                className={`hover:text-blue ${LABEL} inline-flex items-center gap-1.5 text-gray-500 transition-colors`}
              >
                <LuArrowLeft size={14} />
                all writing
              </Link>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tags/${tagSlug(tag)}`}
                    className={`border-blue/40 text-blue bg-blue/5 hover:bg-blue/10 ${LABEL} border px-2 py-0.5 transition-colors`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              {/* text-balance stops a long title dropping one orphan word */}
              <h1 className="ss01 normal-case-force page-title mt-4 text-balance">
                {post.title}
              </h1>

              {/* Was text-base + max-w-2xl, which introduced a third column
                width inside the band. Now it inherits the measure and sits
                one step above the 17px prose body — a deck, not body copy. */}
              <p className="mt-3.5 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {post.description}
              </p>

              <div
                className={`${LABEL} mt-6 flex flex-wrap items-center gap-2.5 text-gray-500`}
              >
                <time dateTime={post.date}>{fmtDate(post.date)}</time>
                <span aria-hidden="true" className="bg-border h-3 w-px" />
                <span>{post.readingTime}</span>
                {post.updated && (
                  <>
                    <span aria-hidden="true" className="bg-border h-3 w-px" />
                    <span className="text-blue">
                      updated {fmtDate(post.updated)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {post.image && (
          <div className="border-border relative aspect-[16/8] w-full overflow-hidden border-b">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        {/* Body — GUTTER outside, LAYOUT then MEASURE inside, so the text
            column is a true 40rem and its left edge matches the h1 above it.
            Sizes and heading scale come from the `.prose` block in
            globals.css so every post is one type system; only colour and
            link treatment are set per-instance here. */}
        <div className={GUTTER}>
          <div className={`${LAYOUT} pt-12 pb-20`}>
            <div
              className={`prose prose-a:text-blue prose-a:no-underline hover:prose-a:underline ${MEASURE}`}
            >
              {series.length > 1 && (
                <SeriesNav
                  series={post.series!}
                  posts={series}
                  currentSlug={post.slug}
                />
              )}

              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      // Makes every H2/H3 a shareable deep link.
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "wrap",
                          properties: { className: "heading-anchor" },
                        },
                      ],
                      [rehypePrettyCode, { theme: "github-dark" }],
                    ],
                  },
                }}
              />

              {/* not-prose: the prose block would restyle the row's own
                  spacing and link colours. */}
              <div className="not-prose">
                <ShareBar url={url} />
              </div>
            </div>

            <BlogToc
              headings={headings}
              footer={<ShareBar url={url} variant="rail" />}
            />
          </div>
        </div>
      </article>

      {/* Keep reading — WIDE rather than full-bleed. Two cards stretched
          across the whole viewport under a 640px article was part of what
          made the article look pinched. */}
      {more.length > 0 && (
        <aside className="border-border border-t">
          <div
            className={`border-border border-b bg-gray-50 ${GUTTER} dark:bg-black`}
          >
            <div
              className={`${WIDE} flex items-center justify-between gap-3 py-4`}
            >
              <h2 className="ss01 flex items-center gap-3 text-sm font-bold">
                <span aria-hidden="true" className="bg-blue h-3.5 w-[3px]" />
                keep reading
              </h2>
              <Link
                href="/blog"
                className={`hover:text-blue ${LABEL} text-gray-500 transition-colors`}
              >
                all posts →
              </Link>
            </div>
          </div>

          <div className={GUTTER}>
            <div className={`${WIDE} grid grid-cols-1 sm:grid-cols-2`}>
              {more.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className={`group hover:bg-gray-50 dark:hover:bg-black ${
                    i === 0 ? "border-border sm:border-r" : ""
                  } border-border border-b py-6 transition-colors sm:border-b-0 ${
                    i === 0 ? "sm:pr-8" : "sm:pl-8"
                  } sm:py-8`}
                >
                  <p className={`${LABEL} text-gray-400`}>
                    {fmtDate(p.date)} · {p.readingTime}
                  </p>
                  <h3 className="ss01 normal-case-force group-hover:text-blue mt-2 text-base font-semibold transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {p.description}
                  </p>
                  <span
                    className={`text-blue ${LABEL} mt-3 inline-flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100`}
                  >
                    read <LuArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
