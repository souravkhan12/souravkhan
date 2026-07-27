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
import { BlogSchemaMarkup } from "@/components/blog/BlogSchemaMarkup";
import { SeriesNav } from "@/components/blog/series-nav";
import { Subscribe } from "@/components/blog/subscribe";
import { SEO_CONFIG } from "@/config/seo";

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
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
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

  return (
    <>
      <BlogSchemaMarkup post={post} />
      <BlogProgress headings={headings} />

      <article id="blog-post-content">
        {/* Title band — mirrors the homepage's section header treatment */}
        <header className="border-border border-b bg-gray-50 px-6 py-8 sm:px-10 sm:py-10 dark:bg-black">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="hover:text-blue font-code inline-flex items-center gap-1.5 text-xs text-gray-500 lowercase transition-colors"
            >
              <LuArrowLeft size={13} />
              all writing
            </Link>

            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tagSlug(tag)}`}
                  className="border-blue/40 text-blue bg-blue/5 hover:bg-blue/10 font-code border px-2 py-0.5 text-[11px] transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <h1 className="ss01 normal-case-force mt-4 text-2xl leading-tight font-bold tracking-[-0.02em] sm:text-3xl">
              {post.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {post.description}
            </p>

            <div className="font-code mt-5 flex flex-wrap items-center gap-2.5 text-xs text-gray-500">
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

        {/* Body */}
        <div className="prose prose-gray dark:prose-invert prose-p:leading-relaxed prose-headings:normal-case prose-headings:tracking-[-0.01em] prose-a:text-blue prose-a:no-underline hover:prose-a:underline prose-lg mx-auto max-w-3xl px-6 pt-12 pb-16 sm:px-10 xl:pb-16">
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
        </div>
      </article>

      {/* Keep reading */}
      {more.length > 0 && (
        <aside className="border-border border-t">
          <div className="border-border flex items-center justify-between gap-3 border-b bg-gray-50 px-6 py-4 sm:px-10 dark:bg-black">
            <h2 className="ss01 flex items-center gap-3 text-sm font-bold">
              <span aria-hidden="true" className="bg-blue h-3.5 w-[3px]" />
              keep reading
            </h2>
            <Link
              href="/blog"
              className="hover:text-blue font-code text-xs text-gray-500 lowercase transition-colors"
            >
              all posts →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {more.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className={`group hover:bg-gray-50 dark:hover:bg-black ${
                  i === 0 ? "border-border sm:border-r" : ""
                } border-border border-b p-6 transition-colors sm:border-b-0 sm:p-8`}
              >
                <p className="font-code text-[11px] text-gray-400">
                  {fmtDate(p.date)} · {p.readingTime}
                </p>
                <h3 className="ss01 normal-case-force group-hover:text-blue mt-2 text-base font-semibold transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {p.description}
                </p>
                <span className="text-blue mt-3 inline-flex items-center gap-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                  read <LuArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </aside>
      )}

      <Subscribe />
    </>
  );
}
