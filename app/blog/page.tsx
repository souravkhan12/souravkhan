import Link from "next/link";
import { LuRss } from "react-icons/lu";
import { getAllPosts, toSummary } from "@/lib/blog";
import { PageHeader, Section } from "@/components/ui";
import { PostList } from "@/components/blog/post-list";
import { ReadingList } from "@/components/blog/reading-list";
import { TagTabs } from "@/components/blog/tag-tabs";
import { getBookmarks, getReadingTags } from "@/lib/reading";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Blog",
  description:
    "Notes on software engineering and web development — React, Next.js, TypeScript, and the debugging stories behind them.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/blog` },
};

export default function BlogPage() {
  const posts = getAllPosts().map(toSummary);
  const bookmarks = getBookmarks();
  const readingTags = getReadingTags();

  return (
    <>
      <PageHeader
        eyebrow="Writing"
        count={posts.length}
        title="Notes on building for the web."
        muted="The version I'd give a teammate, not a listicle."
      >
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <TagTabs active={null} />
          </div>
          <Link
            href="/feed.xml"
            aria-label="RSS feed"
            className="bg-surface text-soft hover:text-foreground hidden shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-colors sm:inline-flex"
          >
            <LuRss size={12} aria-hidden="true" />
            RSS
          </Link>
        </div>
      </PageHeader>

      <section id="writing" className="scroll-mt-20">
        {posts.length === 0 ? (
          <div className="py-6">
            <p className="text-base font-semibold">Nothing here yet.</p>
            <p className="text-soft mt-2 max-w-xl text-sm">
              The first post is being written. Until then, the reading list
              below is what I&apos;d have sent you anyway.
            </p>
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </section>

      <Section
        title="Reading"
        id="reading"
        count={bookmarks.length}
        subtitle="Things I didn't write but keep coming back to."
        className="mt-10"
      >
        <ReadingList bookmarks={bookmarks} tags={readingTags} initial={4} />
      </Section>
    </>
  );
}
