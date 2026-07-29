import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAllSetupGuides, getSetupBySlug } from "@/lib/setup";
import { extractHeadings } from "@/lib/content";
import { mdxComponents } from "@/components/blog/mdx-components";
import { BlogProgress } from "@/components/blog/blog-progress";

export async function generateStaticParams() {
  const guides = getAllSetupGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSetupBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
  };
}

export default async function SetupGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSetupBySlug(slug);
  if (!guide) notFound();

  const headings = extractHeadings(guide.content);

  return (
    <>
      <BlogProgress headings={headings} />
      <article
        id="blog-post-content"
        className="prose prose-gray dark:prose-invert prose-p:leading-relaxed prose-lg mx-auto max-w-3xl px-6 pt-16 pb-20 sm:px-8 xl:pb-12"
      >
        <Link
          href="/#setup"
          className="hover:text-blue mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 no-underline! transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Setup
        </Link>

        <header>
          <h1 className="ss01 normal-case-force page-title">{guide.title}</h1>
          <p className="text-muted-foreground mt-2 text-base">
            {guide.description}
          </p>
          <div className="mt-2 text-sm text-gray-500">{guide.readingTime}</div>
        </header>

        <MDXRemote
          source={guide.content}
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
