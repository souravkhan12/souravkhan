import { getAllPosts, getAllTags, toSummary } from "@/lib/blog";
import { Section } from "@/components/ui";
import { PostList } from "@/components/blog/post-list";
import { Subscribe } from "@/components/blog/subscribe";
import { SEO_CONFIG } from "@/config/seo";
import Link from "next/link";
import { LuRss } from "react-icons/lu";

export const metadata = {
  title: "Blog",
  description:
    "Notes on software engineering and web development — React, Next.js, TypeScript, and the debugging stories behind them.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/blog` },
};

export default function BlogPage() {
  const posts = getAllPosts().map(toSummary);
  const tags = getAllTags();

  return (
    <>
      <Section
        title="writing"
        subtitle="notes on building for the web — the version i'd give a teammate, not a listicle."
        className="pt-8"
      >
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {tags.map(({ tag, slug, count }) => (
            <Link
              key={slug}
              href={`/blog/tags/${slug}`}
              className="border-border hover:border-blue hover:text-blue font-code border px-2 py-0.5 text-[11px] text-gray-500 transition-colors"
            >
              {tag} <span className="text-gray-400">{count}</span>
            </Link>
          ))}
          <Link
            href="/feed.xml"
            className="border-border hover:border-blue hover:text-blue font-code ml-auto inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] text-gray-500 transition-colors"
          >
            <LuRss size={11} aria-hidden="true" />
            rss
          </Link>
        </div>

        <PostList posts={posts} />
      </Section>

      <Subscribe />
    </>
  );
}
