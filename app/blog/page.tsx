import { getAllPosts, getAllTags, toSummary } from "@/lib/blog";
import { Section } from "@/components/ui";
import { PostList } from "@/components/blog/post-list";
import { ReadingList } from "@/components/blog/reading-list";
import { Subscribe } from "@/components/blog/subscribe";
import { getBookmarks, getReadingTags } from "@/lib/reading";
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
  const bookmarks = getBookmarks();
  const readingTags = getReadingTags();

  return (
    <>
      <Section
        title="writing"
        id="writing"
        count={posts.length}
        subtitle="notes on building for the web — the version i'd give a teammate, not a listicle."
        className="pt-8"
      >
        {/* Its own bordered strip so it lines up with the grid rather than
            sitting 4px outside it. Phones scroll the tags on one line instead
            of stacking them into a block that pushes the posts below the
            fold; from `sm` up there's room to wrap. */}
        <div className="border-border flex items-center gap-2 border-x border-t px-6 py-2.5 sm:items-start sm:px-8">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible">
            {tags.map(({ tag, slug, count }) => (
              <Link
                key={slug}
                href={`/blog/tags/${slug}`}
                className="border-border hover:border-blue hover:text-blue font-code shrink-0 border px-2 py-0.5 text-[11px] whitespace-nowrap text-gray-500 transition-colors"
              >
                {tag} <span className="text-gray-400">{count}</span>
              </Link>
            ))}
          </div>
          <Link
            href="/feed.xml"
            aria-label="RSS feed"
            className="border-border hover:border-blue hover:text-blue font-code inline-flex shrink-0 items-center gap-1.5 border px-2 py-0.5 text-[11px] text-gray-500 transition-colors"
          >
            <LuRss size={11} aria-hidden="true" />
            rss
          </Link>
        </div>

        {posts.length === 0 ? (
          // Left-aligned on the same 24/32px gutter as every other cell —
          // centred text was the one thing on the page ignoring the grid.
          <div className="border-border border-x border-b p-6 sm:p-8">
            <p className="ss01 normal-case-force text-base font-semibold">
              Nothing here yet.
            </p>
            <p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-400">
              The first post is being written. Until then, the reading list
              below is what I&apos;d have sent you anyway.
            </p>
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </Section>

      <Section
        title="reading"
        id="reading"
        count={bookmarks.length}
        subtitle="things i didn't write but keep coming back to."
      >
        <ReadingList bookmarks={bookmarks} tags={readingTags} initial={4} />
      </Section>

      <Subscribe />
    </>
  );
}
