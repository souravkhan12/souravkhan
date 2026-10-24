import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { PageHeader } from "@/components/ui";
import { ReadingList } from "@/components/blog/reading-list";
import { getBookmarks, getReadingTags } from "@/lib/reading";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Reading",
  description:
    "A running list of posts, essays and talks worth your time — with a line on why each one is here.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/reading` },
};

export default function ReadingPage() {
  const bookmarks = getBookmarks();
  const tags = getReadingTags();

  return (
    <>
      <PageHeader
        eyebrow="Reading"
        count={bookmarks.length}
        title="Things I didn't write but keep coming back to."
        muted="Each one has a line on why it's here."
      />

      <ReadingList bookmarks={bookmarks} tags={tags} />

      <Link
        href="/blog"
        className="group text-soft hover:text-foreground mt-8 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        Things I did write
        <LuArrowRight
          size={14}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </>
  );
}
