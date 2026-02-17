import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { LAYOUT } from "@/config/styles";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import { PatternDivider } from "@/components/ui/pattern-divider";
import { MDXRemote } from "next-mdx-remote/rsc";

// Generate static paths for all posts
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

  return (
    <div className="flex [--pattern-fg:var(--color-gray-950)]/5 dark:bg-[#1E1E1E] dark:[--pattern-fg:var(--color-white)]/10">
      <PatternDivider position="left" />
      <div className={`${LAYOUT.container} dark:bg-[#1E1E1E]`}>
        <Navbar />
        <article className="prose prose-gray dark:prose-invert mx-auto max-w-3xl py-12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
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
          <MDXRemote source={post.content} />
        </article>
        <Footer />
      </div>
      <PatternDivider position="right" />
    </div>
  );
}
