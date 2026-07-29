import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuArrowRight, LuCheck } from "react-icons/lu";
import { Section } from "@/components/ui";
import { CopyLink } from "@/components/arcade/CopyLink";
import {
  getAllQuestions,
  getQuestionById,
  questionTitle,
  snippetPreview,
} from "@/lib/quiz";
import { SEO_CONFIG } from "@/config/seo";

/**
 * A permalink for one puzzle.
 *
 * The daily page is a habit; this is the discovery surface. Every one of these
 * answers a question people actually type into a search engine, and the answer
 * plus explanation are rendered on the server — a crawler gets the whole thing
 * without running a line of JavaScript, which the interactive daily page can't
 * offer because its answer is hidden until you click.
 */

export function generateStaticParams() {
  return getAllQuestions().map((q) => ({ id: q.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const question = getQuestionById(id);
  if (!question) return {};

  const title = questionTitle(question);
  const url = `${SEO_CONFIG.baseUrl}/arcade/quiz/${id}`;

  return {
    title,
    // The explanation is already written as a tight answer, so it doubles as
    // the meta description — which is what shows under the search result.
    description: snippetPreview(question.explanation, 155),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: snippetPreview(question.explanation, 155),
    },
  };
}

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = getQuestionById(id);
  if (!question) notFound();

  const all = getAllQuestions();
  const index = all.findIndex((q) => q.id === id);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  const title = questionTitle(question);
  const answer = question.options[question.answer];
  const url = `${SEO_CONFIG.baseUrl}/arcade/quiz/${id}`;

  /* QAPage markup: this genuinely is one question with one accepted answer, so
     it's the honest schema — and it's what earns the rich result. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: title,
      text: `${question.prompt}\n\n${question.snippet}`,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${answer} — ${question.explanation}`,
        url,
      },
      author: { "@type": "Person", name: SEO_CONFIG.author },
    },
  };

  return (
    <div className="pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="px-6 pb-4 sm:px-8">
        <Link
          href="/arcade/quiz"
          className="hover:text-blue font-code inline-flex items-center gap-1.5 text-xs text-gray-500 lowercase transition-colors"
        >
          <LuArrowLeft size={13} aria-hidden="true" />
          daily puzzle
        </Link>
      </div>

      {/* Titles carry code identifiers, so they must not be lowercased. */}
      <Section title={title} id="puzzle" preserveTitleCase>
        <div className="border-border border-x border-b p-6 sm:p-8">
          <div className="border-border border">
            <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b bg-gray-50 px-4 py-2.5 dark:bg-black">
              <span className="font-code text-[11px] text-gray-500 lowercase">
                puzzle {String(index + 1).padStart(2, "0")} · javascript
              </span>
              <CopyLink url={url} />
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm font-medium">{question.prompt}</p>

              <pre className="border-border font-code mt-4 overflow-x-auto border bg-gray-50 p-4 text-[13px] leading-relaxed dark:bg-black">
                <code>{question.snippet}</code>
              </pre>

              <div className="mt-4 grid gap-2">
                {question.options.map((option, i) => {
                  const isAnswer = i === question.answer;
                  return (
                    <div
                      key={i}
                      className={`font-code flex items-center justify-between gap-3 border px-4 py-2.5 text-[13px] ${
                        isAnswer
                          ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                          : "border-border text-gray-500 opacity-60"
                      }`}
                    >
                      <span className="min-w-0 break-words">{option}</span>
                      {isAnswer && (
                        <LuCheck
                          size={14}
                          className="shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-border mt-5 border-t pt-4">
                <h2 className="font-code text-[11px] text-gray-500 lowercase">
                  why
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {question.explanation}
                </p>

                {question.postSlug && (
                  <Link
                    href={`/blog/${question.postSlug}`}
                    className="text-blue mt-3 inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
                  >
                    read the deep dive{" "}
                    <LuArrowRight size={13} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Today's puzzle is the thing worth converting a search visitor to:
              they arrived for one answer, this is the reason to come back. */}
          <Link
            href="/arcade/quiz"
            className="border-border hover:border-blue hover:bg-blue/5 group mt-6 flex items-center justify-between gap-4 border px-5 py-4 transition-colors"
          >
            <span className="min-w-0">
              <span className="ss01 group-hover:text-blue block text-sm font-medium transition-colors">
                Today&apos;s puzzle
              </span>
              <span className="font-code mt-0.5 block text-[11px] text-gray-500">
                a new one every day, and a streak to keep
              </span>
            </span>
            <LuArrowRight
              size={15}
              aria-hidden="true"
              className="group-hover:text-blue shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 dark:text-gray-600"
            />
          </Link>
        </div>

        {/* Prev/next keeps crawlers walking the whole archive from any entry. */}
        <nav className="border-border font-code flex items-stretch border-x border-b text-xs">
          {prev ? (
            <Link
              href={`/arcade/quiz/${prev.id}`}
              rel="prev"
              className="hover:text-blue flex min-w-0 flex-1 items-center gap-2 px-6 py-3.5 text-gray-500 transition-colors hover:bg-gray-50 sm:px-8 dark:hover:bg-black"
            >
              <LuArrowLeft size={13} aria-hidden="true" className="shrink-0" />
              <span className="truncate">{questionTitle(prev)}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}

          {next && (
            <Link
              href={`/arcade/quiz/${next.id}`}
              rel="next"
              className="hover:text-blue border-border flex min-w-0 flex-1 items-center justify-end gap-2 border-l px-6 py-3.5 text-right text-gray-500 transition-colors hover:bg-gray-50 sm:px-8 dark:hover:bg-black"
            >
              <span className="truncate">{questionTitle(next)}</span>
              <LuArrowRight size={13} aria-hidden="true" className="shrink-0" />
            </Link>
          )}
        </nav>
      </Section>
    </div>
  );
}
