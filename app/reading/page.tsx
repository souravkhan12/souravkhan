import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Section } from "@/components/ui";
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
    <Section
      title="reading"
      id="reading"
      count={bookmarks.length}
      subtitle="things i didn't write but keep coming back to. each one has a line on why it's here."
      className="pt-8"
    >
      <ReadingList bookmarks={bookmarks} tags={tags} />

      <div className="border-border border-x border-b px-6 py-4 sm:px-8">
        <Link
          href="/blog"
          className="hover:text-blue font-code inline-flex items-center gap-1.5 text-xs text-gray-500 lowercase transition-colors"
        >
          things i did write <LuArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
