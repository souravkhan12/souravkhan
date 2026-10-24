import Link from "next/link";
import { LuGithub } from "react-icons/lu";
import { PageHeader, RowList } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";
import {
  getAllMachineCodingQuestions,
  getMachineCodingCategories,
  MC_REPO_URL,
} from "@/lib/machine-coding";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Machine Coding Questions",
  description:
    "Frontend machine coding round questions — debounce, throttle, pagination, infinite scroll, file explorer and more. Each one with the approach, the working solution, and the mistakes that cost people the round.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/machine-coding` },
};

/**
 * Index for the machine coding set.
 *
 * Grouped by category rather than listed flat, because "machine coding round"
 * is how these are searched for as a set, while each individual question is
 * searched for by name — so both need a page, and the categories in between
 * give each one a parent to be linked from.
 */
export default function MachineCodingPage() {
  const categories = getMachineCodingCategories();
  const total = getAllMachineCodingQuestions().length;

  return (
    <>
      <PageHeader
        eyebrow="Machine coding"
        count={total}
        title="Frontend machine coding rounds."
        muted="The approach, the solution, and what usually goes wrong."
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/machine-coding/category/${category.slug}`}
              className="bg-surface text-soft hover:text-foreground hover:bg-surface-hover shrink-0 rounded-full px-3 py-1 text-xs whitespace-nowrap transition-colors"
            >
              {category.label}{" "}
              <span className="font-code text-faint">{category.count}</span>
            </Link>
          ))}

          <a
            href={MC_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-soft hover:text-foreground hover:bg-surface inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors"
          >
            <LuGithub size={12} aria-hidden="true" />
            Source
          </a>
        </div>
      </PageHeader>

      {/* One label-and-list row per category. Adding an .mdx with a new
          `category` grows this page and creates its route without touching
          any of this. */}
      {categories.map((category) => (
        <section
          key={category.slug}
          id={category.slug}
          className="scroll-mt-24 py-6 md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-10"
        >
          <h2 className="font-code text-faint text-2xs mb-3 font-normal md:mb-0 md:pt-3.5">
            <Link
              href={`/machine-coding/category/${category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {category.label}
            </Link>{" "}
            <span className="tabular-nums">· {category.count}</span>
          </h2>
          <Reveal className="min-w-0">
            <RowList
              rows={category.questions.map((q) => ({
                href: `/machine-coding/${q.slug}`,
                title: q.title,
                meta: `${q.difficulty} · ${q.tags.slice(0, 3).join(", ")}`,
                hint: q.question,
              }))}
            />
          </Reveal>
        </section>
      ))}
    </>
  );
}
