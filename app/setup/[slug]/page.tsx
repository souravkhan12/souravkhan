import { notFound } from "next/navigation";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { getAllSetupGuides, getSetupBySlug } from "@/lib/setup";
import { extractHeadings } from "@/lib/content";
import { mdxComponents } from "@/components/blog/mdx-components";
import {
  ReadingPage,
  ReadingPrevNext,
} from "@/components/reading/reading-page";
import { SEO_CONFIG } from "@/config/seo";

export async function generateStaticParams() {
  return getAllSetupGuides().map((guide) => ({ slug: guide.slug }));
}

const MDX_OPTIONS: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSetupBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `${SEO_CONFIG.baseUrl}/setup/${slug}` },
  };
}

export default async function SetupGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getSetupBySlug(slug);
  if (!guide) notFound();

  const guides = getAllSetupGuides();
  const index = guides.findIndex((g) => g.slug === slug);
  const url = `${SEO_CONFIG.baseUrl}/setup/${slug}`;

  return (
    <ReadingPage
      nav={{
        title: "Setup & tools",
        href: "/setup",
        groups: [
          {
            items: guides.map((g) => ({
              href: `/setup/${g.slug}`,
              title: g.title,
            })),
          },
        ],
        currentHref: `/setup/${slug}`,
      }}
      /* Was /#setup, which stopped resolving when the homepage's setup band
         was folded into the site index. */
      back={{ href: "/setup", label: "all setup" }}
      title={guide.title}
      description={guide.description}
      meta={[<span key="time">{guide.readingTime}</span>]}
      headings={extractHeadings(guide.content)}
      shareUrl={url}
      footer={
        <ReadingPrevNext
          prev={
            index > 0
              ? {
                  href: `/setup/${guides[index - 1].slug}`,
                  title: guides[index - 1].title,
                }
              : null
          }
          next={
            index >= 0 && index < guides.length - 1
              ? {
                  href: `/setup/${guides[index + 1].slug}`,
                  title: guides[index + 1].title,
                }
              : null
          }
        />
      }
    >
      <MDXRemote
        source={guide.content}
        components={mdxComponents}
        options={MDX_OPTIONS}
      />
    </ReadingPage>
  );
}
