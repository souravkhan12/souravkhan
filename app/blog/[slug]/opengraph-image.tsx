import { ImageResponse } from "next/og";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Blog post by Sourav Khan";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return new ImageResponse(
    <OgCard
      eyebrow={post?.tags[0] ?? "writing"}
      title={post?.title ?? "Writing"}
      meta={
        post
          ? [
              new Date(post.date).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              post.readingTime,
            ]
          : undefined
      }
    />,
    size,
  );
}
