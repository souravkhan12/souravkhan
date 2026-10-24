import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag, toSummary } from "@/lib/blog";
import { PageHeader } from "@/components/ui";
import { PostList } from "@/components/blog/post-list";
import { TagTabs } from "@/components/blog/tag-tabs";
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
      <PageHeader
        back={{ href: "/blog", label: "All writing" }}
        title={match.tag}
        muted={`${match.count} post${match.count === 1 ? "" : "s"}.`}
      >
        <TagTabs active={tag} />
      </PageHeader>

      <PostList posts={posts} showSearch={false} showLatestBadge={false} />
    </>
  );
}
