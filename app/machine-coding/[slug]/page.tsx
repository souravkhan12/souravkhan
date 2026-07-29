import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuArrowRight, LuGithub } from "react-icons/lu";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import {
  getAllMachineCodingQuestions,
  getMachineCodingBySlug,
  getMachineCodingCategory,
  getSolutionFiles,
  type SolutionFile,
} from "@/lib/machine-coding";
import { mdxComponents } from "@/components/blog/mdx-components";
import { SEO_CONFIG } from "@/config/seo";

export function generateStaticParams() {
  return getAllMachineCodingQuestions().map((q) => ({ slug: q.slug }));
}

/* Shared by the write-up and the solution blocks so both highlight identically.
   Typed off MDXRemoteProps rather than `as const` — MDXRemote wants mutable
   plugin arrays and a readonly tuple won't assign. (`SerializeOptions` itself
   isn't re-exported by the package, so this is the public way to name it.) */
const MDX_OPTIONS: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-dark" }]],
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

      <article className="prose prose-gray dark:prose-invert prose-a:text-blue prose-a:no-underline hover:prose-a:underline mx-auto max-w-[42rem] px-6 pt-12 pb-20 sm:px-10">
        <Link
          href={
            category
              ? `/machine-coding/category/${category.slug}`
              : "/machine-coding"
          }
          className="hover:text-blue font-code mb-6 inline-flex items-center gap-1.5 text-xs text-gray-500 lowercase no-underline! transition-colors"
        >
          <LuArrowLeft size={13} aria-hidden="true" />
          {category ? category.label.toLowerCase() : "machine coding"}
        </Link>

        <header>
          <h1 className="ss01 normal-case-force page-title">
            {question.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            {question.question}
          </p>

          <div className="font-code not-prose mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-gray-500">
            <span className="border-border border px-2 py-0.5">
              {question.difficulty}
            </span>
            {question.tags.map((tag) => (
              <span key={tag} className="text-gray-400">
                {tag}
              </span>
            ))}
            <a
              href={question.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue border-border ml-auto inline-flex items-center gap-1.5 border px-2 py-0.5 transition-colors"
            >
              <LuGithub size={11} aria-hidden="true" />
              solution
            </a>
          </div>
        </header>

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
            <p className="text-sm text-gray-500">
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

        <nav className="not-prose border-border font-code mt-12 flex items-stretch border-t pt-4 text-xs">
          {prev ? (
            <Link
              href={`/machine-coding/${prev.slug}`}
              rel="prev"
              className="hover:text-blue flex min-w-0 flex-1 items-center gap-2 py-2 text-gray-500 transition-colors"
            >
              <LuArrowLeft size={13} aria-hidden="true" className="shrink-0" />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}

          {next && (
            <Link
              href={`/machine-coding/${next.slug}`}
              rel="next"
              className="hover:text-blue flex min-w-0 flex-1 items-center justify-end gap-2 py-2 text-right text-gray-500 transition-colors"
            >
              <span className="truncate">{next.title}</span>
              <LuArrowRight size={13} aria-hidden="true" className="shrink-0" />
            </Link>
          )}
        </nav>
      </article>
    </>
  );
}
