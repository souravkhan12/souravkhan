import Link from "next/link";
import { LuGithub } from "react-icons/lu";
import { Section, RowList } from "@/components/ui";
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
    <div className="pt-8">
      <Section
        title="machine coding"
        id="machine-coding"
        count={total}
        subtitle="questions from frontend machine coding rounds — the approach, the solution, and what usually goes wrong."
      >
        <div className="border-border flex flex-wrap items-center gap-2 border-x border-t px-6 py-2.5 sm:px-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/machine-coding/category/${category.slug}`}
              className="border-border hover:border-blue hover:text-blue font-code shrink-0 border px-2 py-0.5 text-[11px] whitespace-nowrap text-gray-500 transition-colors"
            >
              {category.label.toLowerCase()}{" "}
              <span className="text-gray-400">{category.count}</span>
            </Link>
          ))}

          <a
            href={MC_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border hover:border-blue hover:text-blue font-code ml-auto inline-flex shrink-0 items-center gap-1.5 border px-2 py-0.5 text-[11px] text-gray-500 transition-colors"
          >
            <LuGithub size={11} aria-hidden="true" />
            source
          </a>
        </div>
      </Section>

      {/* One band per category. Adding an .mdx with a new `category` grows this
          page and creates its route without touching any of this. */}
      {categories.map((category) => (
        <Section
          key={category.slug}
          title={category.label.toLowerCase()}
          id={category.slug}
          count={category.count}
        >
          <RowList
            rows={category.questions.map((q) => ({
              href: `/machine-coding/${q.slug}`,
              title: q.title,
              meta: `${q.difficulty} · ${q.tags.slice(0, 3).join(", ")}`,
              hint: q.question,
            }))}
          />
        </Section>
      ))}
    </div>
  );
}
