import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import { PageHeader } from "@/components/ui";
import { ReadingPrevNext } from "@/components/reading/reading-page";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        back={{ href: "/arcade/quiz", label: "Daily puzzle" }}
        title={title}
      />

      <section id="puzzle" className="scroll-mt-20">
        <div>
          <div className="bg-surface overflow-hidden rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4 sm:px-6">
              <span className="font-code text-2xs text-soft lowercase">
                puzzle {String(index + 1).padStart(2, "0")} · javascript
              </span>
              <CopyLink url={url} />
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-sm font-medium">{question.prompt}</p>

              <pre className="border-border bg-background font-code text-2xs mt-4 overflow-x-auto rounded-xl border p-4 leading-relaxed">
                <code>{question.snippet}</code>
              </pre>

              <div className="mt-4 grid gap-2">
                {question.options.map((option, i) => {
                  const isAnswer = i === question.answer;
                  return (
                    <div
                      key={i}
                      className={`font-code text-2xs flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 ${
                        isAnswer
                          ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                          : "border-border text-soft opacity-60"
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
                <h2 className="font-code text-2xs text-soft">Why</h2>
                <p className="text-soft mt-2 text-sm leading-relaxed">
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
            className="group bg-background shadow-soft mt-6 flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-0.5"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold">
                Today&apos;s puzzle
              </span>
              <span className="font-code text-2xs text-soft mt-0.5 block">
                a new one every day, and a streak to keep
              </span>
            </span>
            <LuArrowRight
              size={15}
              aria-hidden="true"
              className="text-faint group-hover:text-foreground shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Prev/next keeps crawlers walking the whole archive from any entry. */}
        <ReadingPrevNext
          prev={
            prev && {
              href: `/arcade/quiz/${prev.id}`,
              title: questionTitle(prev),
            }
          }
          next={
            next && {
              href: `/arcade/quiz/${next.id}`,
              title: questionTitle(next),
            }
          }
        />
      </section>
    </>
  );
}
