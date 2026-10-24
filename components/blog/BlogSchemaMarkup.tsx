import { SEO_CONFIG } from "@/config/seo";
import type { BlogPost } from "@/lib/blog";

/**
 * BlogPosting structured data — what Google needs to show a post as a rich
 * result. Mirrors the pattern in components/project/ProjectSchemaMarkup.tsx.
 */
export function BlogSchemaMarkup({ post }: { post: BlogPost }) {
  const url = `${SEO_CONFIG.baseUrl}/blog/${post.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.updated ?? post.date).toISOString(),
    image: post.image
      ? `${SEO_CONFIG.baseUrl}${post.image}`
      : `${url}/opengraph-image`,
    keywords: post.tags.join(", "),
    wordCount: post.content.trim().split(/\s+/).length,
    inLanguage: "en",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      "@id": `${SEO_CONFIG.baseUrl}/#person`,
      name: SEO_CONFIG.author,
      url: SEO_CONFIG.baseUrl,
    },
    publisher: {
      "@type": "Person",
      name: SEO_CONFIG.author,
      url: SEO_CONFIG.baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
