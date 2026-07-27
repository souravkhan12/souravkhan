import { SEO_CONFIG } from "@/config/seo";
import { getPublishedPosts } from "@/lib/blog";

/** Minimal XML escaping for text nodes and attribute values. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export async function GET() {
  const baseUrl = SEO_CONFIG.baseUrl;
  const posts = getPublishedPosts();
  const updated = posts[0]?.updated ?? posts[0]?.date;

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SEO_CONFIG.author)} — Blog</title>
    <link>${baseUrl}/blog</link>
    <description>${escapeXml(SEO_CONFIG.description)}</description>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(SEO_CONFIG.author)}</copyright>
    <lastBuildDate>${new Date(updated ?? Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
