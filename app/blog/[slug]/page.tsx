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
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { prettyCodeOptions } from "@/lib/code-theme";
import remarkGfm from "remark-gfm";
import { LuArrowRight } from "react-icons/lu";
import { mdxComponents } from "@/components/blog/mdx-components";
import { BlogSchemaMarkup } from "@/components/blog/BlogSchemaMarkup";
import { SeriesNav } from "@/components/blog/series-nav";
import { ReadingPage } from "@/components/reading/reading-page";
import { formatDate } from "@/lib/utils";
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

const fmtDate = formatDate;

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

      <ReadingPage
        back={{ href: "/blog", label: "All writing" }}
        chips={post.tags.map((tag) => ({
          label: tag,
          href: `/blog/tags/${tagSlug(tag)}`,
        }))}
        title={post.title}
        description={post.description}
        meta={[
          <time key="date" dateTime={post.date}>
            {fmtDate(post.date)}
          </time>,
          <span key="time">{post.readingTime}</span>,
          ...(post.updated
            ? [
                <span key="updated" className="text-blue">
                  updated {fmtDate(post.updated)}
                </span>,
              ]
            : []),
        ]}
        image={post.image ? { src: post.image, alt: post.title } : undefined}
        headings={headings}
        shareUrl={url}
        before={
          series.length > 1 && (
            <SeriesNav
              series={post.series!}
              posts={series}
              currentSlug={post.slug}
            />
          )
        }
        footer={more.length > 0 && <KeepReading posts={more} />}
      >
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
                [rehypePrettyCode, prettyCodeOptions],
              ],
            },
          }}
        />
      </ReadingPage>
    </>
  );
}

/** Two related posts as soft cards — tag-overlap scored, so it stays on topic. */
function KeepReading({ posts }: { posts: ReturnType<typeof getRelatedPosts> }) {
  return (
    <aside className="mt-10">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight">Keep reading</h2>
        <Link
          href="/blog"
          className="text-soft hover:text-foreground text-sm transition-colors"
        >
          All posts →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group bg-background shadow-soft flex flex-col rounded-2xl p-5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-1"
          >
            <p className="font-code text-faint text-2xs">
              {fmtDate(p.date)} · {p.readingTime}
            </p>
            <h3 className="mt-2 text-base font-bold tracking-tight text-pretty">
              {p.title}
            </h3>
            <p className="text-soft mt-1.5 line-clamp-2 text-sm leading-relaxed">
              {p.description}
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold">
              Read
              <LuArrowRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
