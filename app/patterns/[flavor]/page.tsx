import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, RowList } from "@/components/ui";
import { FlavorSwitcher } from "@/components/patterns/flavor-switcher";
import {
  FLAVORS,
  getFlavor,
  getFlavorTargets,
  getPatternCategories,
  getPatterns,
  isFlavor,
} from "@/lib/patterns";
import { SEO_CONFIG } from "@/config/seo";

export function generateStaticParams() {
  return FLAVORS.map((f) => ({ flavor: f.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ flavor: string }>;
}): Promise<Metadata> {
  const { flavor: slug } = await params;
  const flavor = getFlavor(slug);
  if (!flavor) return {};

  const patterns = getPatterns(flavor.slug);
  const names = patterns.map((p) => p.title).join(", ");
  const url = `${SEO_CONFIG.baseUrl}/patterns/${flavor.slug}`;

  return {
    title: `${flavor.label} design patterns`,
    description: names
      ? `${flavor.label} design patterns explained with working code: ${names}.`
      : `${flavor.label} design patterns — ${flavor.blurb}`,
    keywords: [
      `${flavor.label.toLowerCase()} design patterns`,
      "javascript design patterns",
      "frontend design patterns",
      ...patterns.map((p) => p.title),
    ],
    alternates: { canonical: url },
  };
}

/**
 * One index per flavour, grouped by category.
 *
 * The flavour lives in the path rather than in component state so each list is
 * its own crawlable, linkable page — a client-side toggle would have collapsed
 * both bodies of writing into a single URL.
 */
export default async function PatternsFlavorPage({
  params,
}: {
  params: Promise<{ flavor: string }>;
}) {
  const { flavor: slug } = await params;
  if (!isFlavor(slug)) notFound();

  const flavor = getFlavor(slug)!;
  const categories = getPatternCategories(slug);
  const total = getPatterns(slug).length;

  return (
    <div className="pt-8">
      <Section
        title="patterns"
        id="patterns"
        count={total}
        subtitle={flavor.blurb}
      >
        <div className="border-border flex flex-wrap items-center gap-2 border-x border-t border-b px-6 py-2.5 sm:px-8">
          <FlavorSwitcher current={slug} targets={getFlavorTargets()} />

          {categories.map((category) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className="border-border hover:border-blue hover:text-blue font-code text-2xs text-soft shrink-0 border px-2 py-0.5 whitespace-nowrap transition-colors"
            >
              {category.label.toLowerCase()}{" "}
              <span className="text-faint">{category.count}</span>
            </a>
          ))}
        </div>

        {total === 0 && (
          <div className="border-border border-x border-b p-6 sm:p-8">
            <p className="ss01 normal-case-force text-base font-semibold">
              Nothing here yet.
            </p>
            <p className="text-soft mt-2 max-w-xl text-sm">
              No {flavor.label} patterns are written up yet. Switch flavour
              above for the ones that are.
            </p>
          </div>
        )}

        {/* Categories are subheadings inside this one band, not a Section
            each. A Section carries a full-width screen rule, a gray-100
            header and 4rem of clearance above it — weight that reads as "a
            new part of the page". Spent on a category holding one pattern it
            produced four near-identical blocks with gaps between them, and
            the page looked broken rather than structured. One continuous
            list, one seam per group. */}
        {categories.map((category) => (
          <div key={category.slug}>
            <h3
              id={category.slug}
              className="border-border font-code text-soft flex scroll-mt-24 items-center gap-2 border-x border-b bg-gray-50 px-6 py-2 text-xs lowercase sm:px-8 dark:bg-black"
            >
              <span aria-hidden="true" className="bg-blue h-3 w-[2px]" />
              {category.label.toLowerCase()}
              <span className="text-faint tabular-nums">{category.count}</span>
            </h3>

            <RowList
              rows={category.patterns.map((p) => ({
                href: p.href,
                title: p.title,
                meta: p.tags.slice(0, 3).join(", ") || p.readingTime,
                hint: p.description,
              }))}
            />
          </div>
        ))}
      </Section>
    </div>
  );
}
