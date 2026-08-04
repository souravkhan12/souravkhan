import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/blog/mdx-components";
import { FlavorSwitcher } from "@/components/patterns/flavor-switcher";
import {
  ReadingPage,
  ReadingPrevNext,
} from "@/components/reading/reading-page";
import { patternNavGroups } from "@/components/patterns/nav";
import {
  getAllPatterns,
  getFlavor,
  getFlavorTargets,
  getPattern,
  getPatternHeadings,
  getPatternSiblings,
  isFlavor,
} from "@/lib/patterns";
import { SEO_CONFIG } from "@/config/seo";

export function generateStaticParams() {
  return getAllPatterns().map((p) => ({ flavor: p.flavor, slug: p.slug }));
}

export const dynamicParams = false;

/* Typed off MDXRemoteProps rather than `as const` — MDXRemote wants mutable
   plugin arrays and a readonly tuple won't assign. */
const MDX_OPTIONS: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // Makes every H2/H3 a shareable deep link.
      [
        rehypeAutolinkHeadings,
        { behavior: "wrap", properties: { className: "heading-anchor" } },
      ],
      [rehypePrettyCode, { theme: "github-dark" }],
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ flavor: string; slug: string }>;
}): Promise<Metadata> {
  const { flavor, slug } = await params;
  const pattern = getPattern(flavor, slug);
  if (!pattern) return {};

  const label = getFlavor(flavor)!.label;
  const title = `${pattern.title} — ${label} design pattern`;
  const url = `${SEO_CONFIG.baseUrl}${pattern.href}`;

  return {
    title,
    description: pattern.description,
    keywords: [
      pattern.title,
      `${pattern.title} ${label}`,
      `${label} design patterns`,
      ...pattern.tags,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: pattern.description,
    },
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ flavor: string; slug: string }>;
}) {
  const { flavor, slug } = await params;
  if (!isFlavor(flavor)) notFound();

  const pattern = getPattern(flavor, slug);
  if (!pattern) notFound();

  const flavorMeta = getFlavor(flavor)!;
  const { prev, next } = getPatternSiblings(pattern);
  const url = `${SEO_CONFIG.baseUrl}${pattern.href}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: pattern.title,
    description: pattern.description,
    url,
    author: { "@type": "Person", name: SEO_CONFIG.author },
    keywords: pattern.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingPage
        nav={{
          title: `${flavorMeta.label} patterns`,
          href: `/patterns/${flavor}`,
          groups: patternNavGroups(flavor),
          currentHref: pattern.href,
        }}
        back={{ href: `/patterns/${flavor}`, label: "all patterns" }}
        chips={pattern.tags.map((tag) => ({ label: tag }))}
        title={pattern.title}
        description={pattern.description}
        meta={[
          /* The switcher lives in the meta row rather than the sidebar: the
             moment you want the other runtime is while reading, and the
             sidebar is already showing this flavour's list. */
          <FlavorSwitcher
            key="flavor"
            current={pattern.flavor}
            targets={getFlavorTargets(pattern.slug)}
          />,
          <span key="time">{pattern.readingTime}</span>,
          <span key="category">{pattern.categoryLabel.toLowerCase()}</span>,
        ]}
        headings={getPatternHeadings(pattern)}
        shareUrl={url}
        footer={<ReadingPrevNext prev={prev} next={next} />}
      >
        <MDXRemote
          source={pattern.content}
          components={mdxComponents}
          options={MDX_OPTIONS}
        />
      </ReadingPage>
    </>
  );
}
