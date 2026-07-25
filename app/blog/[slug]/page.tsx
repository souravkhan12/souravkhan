import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getPostHeadings } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { mdxComponents } from "@/components/blog/mdx-components";
import { BlogProgress } from "@/components/blog/blog-progress";

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

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = getPostHeadings(post);

  // The two other most-recent posts, to keep the reader moving at the end.
  const more = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
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
                <span
                  key={tag}
                  className="border-blue/40 text-blue bg-blue/5 font-code border px-2 py-0.5 text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="ss01 normal-case-force mt-4 text-2xl leading-tight font-bold tracking-[-0.02em] sm:text-3xl">
              {post.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {post.description}
            </p>

            <div className="font-code mt-5 flex items-center gap-2.5 text-xs text-gray-500">
              <time dateTime={post.date}>{fmtDate(post.date)}</time>
              <span aria-hidden="true" className="bg-border h-3 w-px" />
              <span>{post.readingTime}</span>
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
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
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
    </>
  );
}
