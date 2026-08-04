import type { Metadata } from "next";
import { LuGithub } from "react-icons/lu";
import { notFound } from "next/navigation";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import {
  getAllMachineCodingQuestions,
  getMachineCodingBySlug,
  getMachineCodingCategories,
  getMachineCodingCategory,
  getSolutionFiles,
  type SolutionFile,
} from "@/lib/machine-coding";
import { extractHeadings, type Heading } from "@/lib/content";
import { mdxComponents } from "@/components/blog/mdx-components";
import {
  ReadingPage,
  ReadingPrevNext,
} from "@/components/reading/reading-page";
import { SEO_CONFIG } from "@/config/seo";

export function generateStaticParams() {
  return getAllMachineCodingQuestions().map((q) => ({ slug: q.slug }));
}

/* Shared by the write-up and the solution blocks so both highlight identically.
   Typed off MDXRemoteProps rather than `as const` — MDXRemote wants mutable
   plugin arrays and a readonly tuple won't assign. */
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

/**
 * Turns the vendored source files into MDX so they go through the same shiki
 * pipeline as every other code block on the site. Building a fenced string and
 * re-parsing it is a slightly odd move, but it's the only way to get identical
 * highlighting without standing up a second highlighter for one page.
 */
function solutionToMdx(files: SolutionFile[]): string {
  return files
    .map(
      (file) =>
        `**\`${file.name}\`**\n\n\`\`\`${file.language}\n${file.source}\n\`\`\``,
    )
    .join("\n\n");
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const question = getMachineCodingBySlug(slug);
  if (!question) return {};

  // "Debounce — machine coding question" beats a bare "Debounce" in a result
  // list, and matches how the query is actually typed.
  const title = `${question.title} — machine coding question`;
  const url = `${SEO_CONFIG.baseUrl}/machine-coding/${slug}`;

  return {
    title,
    description: question.question,
    keywords: [
      question.title,
      `${question.title} machine coding`,
      "machine coding round",
      "frontend interview question",
      ...question.tags,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: question.question,
    },
  };
}

export default async function MachineCodingQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = getMachineCodingBySlug(slug);
  if (!question) notFound();

  const category = getMachineCodingCategory(question.category);
  const siblings = category?.questions ?? [];
  const index = siblings.findIndex((q) => q.slug === slug);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next =
    index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  const solutionFiles = getSolutionFiles(slug);
  const url = `${SEO_CONFIG.baseUrl}/machine-coding/${slug}`;

  /* The solution's heading isn't in the write-up's markdown, so it's appended
     by hand — otherwise the contents rail stops short of a section that's
     often half the page. */
  const headings: Heading[] = [
    ...extractHeadings(question.content),
    ...(solutionFiles.length > 0
      ? [{ id: "full-solution", text: "Full solution", depth: 2 as const }]
      : []),
  ];

  /* TechArticle rather than QAPage: this is a write-up with a stated problem,
     not a single question with one accepted answer. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: question.title,
    description: question.question,
    url,
    author: { "@type": "Person", name: SEO_CONFIG.author },
    keywords: question.tags.join(", "),
    proficiencyLevel:
      question.difficulty === "easy" ? "Beginner" : "Intermediate",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingPage
        nav={{
          title: "Machine coding",
          href: "/machine-coding",
          groups: getMachineCodingCategories().map((c) => ({
            label: c.label.toLowerCase(),
            items: c.questions.map((q) => ({
              href: `/machine-coding/${q.slug}`,
              title: q.title,
            })),
          })),
          currentHref: `/machine-coding/${slug}`,
        }}
        back={
          category
            ? {
                href: `/machine-coding/category/${category.slug}`,
                label: category.label.toLowerCase(),
              }
            : { href: "/machine-coding", label: "machine coding" }
        }
        chips={question.tags.map((tag) => ({ label: tag }))}
        title={question.title}
        description={question.question}
        meta={[
          <span key="difficulty">{question.difficulty}</span>,
          <span key="time">{question.readingTime}</span>,
          <a
            key="repo"
            href={question.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue inline-flex items-center gap-1.5 transition-colors"
          >
            <LuGithub size={13} aria-hidden="true" />
            solution
          </a>,
        ]}
        headings={headings}
        shareUrl={url}
        footer={
          <ReadingPrevNext
            prev={
              prev && {
                href: `/machine-coding/${prev.slug}`,
                title: prev.title,
              }
            }
            next={
              next && {
                href: `/machine-coding/${next.slug}`,
                title: next.title,
              }
            }
          />
        }
      >
        <MDXRemote
          source={question.content}
          components={mdxComponents}
          options={MDX_OPTIONS}
        />

        {/* The full solution, straight out of the repo. The write-up above
            quotes only the part that carries the idea; this is everything,
            including the CSS, so the page stands on its own without a trip to
            GitHub. Empty until `bun run sync:machine-coding` has run. */}
        {solutionFiles.length > 0 && (
          <section>
            <h2 id="full-solution">Full solution</h2>
            <p className="text-soft text-sm">
              {solutionFiles.length} file
              {solutionFiles.length === 1 ? "" : "s"} from{" "}
              <a
                href={question.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <code>{question.repoPath}</code>
              </a>
              .
            </p>

            <MDXRemote
              source={solutionToMdx(solutionFiles)}
              components={mdxComponents}
              options={MDX_OPTIONS}
            />
          </section>
        )}
      </ReadingPage>
    </>
  );
}
