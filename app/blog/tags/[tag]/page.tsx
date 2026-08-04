import { notFound } from "next/navigation";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { getAllTags, getPostsByTag, toSummary } from "@/lib/blog";
import { Section } from "@/components/ui";
import { PostList } from "@/components/blog/post-list";
import { SEO_CONFIG } from "@/config/seo";

export async function generateStaticParams() {
  return getAllTags().map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const match = getAllTags().find((t) => t.slug === tag);
  if (!match) return {};

  return {
    title: `${match.tag} posts`,
    description: `Everything I've written about ${match.tag} — ${match.count} post${match.count === 1 ? "" : "s"}.`,
    alternates: { canonical: `${SEO_CONFIG.baseUrl}/blog/tags/${tag}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const match = getAllTags().find((t) => t.slug === tag);
  if (!match) notFound();

  const posts = getPostsByTag(tag).map(toSummary);

  return (
    <>
      <Section
        title={match.tag}
        subtitle={`${match.count} post${match.count === 1 ? "" : "s"} tagged “${match.tag}”.`}
        className="pt-8"
      >
        {/* A compact strip inside the grid. As a bare `mb-6` block it sat in
            its own full-height band and read as an empty section. */}
        <div className="border-border border-x border-t px-6 py-2.5 sm:px-8">
          <Link
            href="/blog"
            className="hover:text-blue font-code text-2xs text-soft inline-flex items-center gap-1.5 lowercase transition-colors"
          >
            <LuArrowLeft size={12} aria-hidden="true" />
            all writing
          </Link>
        </div>

        <PostList posts={posts} showSearch={false} showLatestBadge={false} />
      </Section>
    </>
  );
}
