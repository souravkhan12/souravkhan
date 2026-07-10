import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getPostHeadings } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
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

  return (
    <>
      <BlogProgress headings={headings} />
      <article
        id="blog-post-content"
        className="prose prose-gray dark:prose-invert prose-headings:font-serif prose-headings:tracking-tight prose-p:leading-relaxed prose-lg mx-auto max-w-3xl px-4 pt-28 pb-20 sm:pt-32 xl:pb-12"
      >
        <header>
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </header>
        {post.image && (
          <div className="animate-hero-image relative mb-10 h-64 w-full overflow-hidden rounded-lg sm:h-80">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
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
      </article>
    </>
  );
}
