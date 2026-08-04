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
        <div className="border-border flex flex-wrap items-center gap-2 border-x border-t px-6 py-2.5 sm:px-8">
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
      </Section>

      {/* One band per category. Adding an .mdx with a new `category` grows this
          page without touching any of this. */}
      {categories.map((category) => (
        <Section
          key={category.slug}
          title={category.label.toLowerCase()}
          id={category.slug}
          count={category.count}
        >
          <RowList
            rows={category.patterns.map((p) => ({
              href: p.href,
              title: p.title,
              meta: p.tags.slice(0, 3).join(", ") || p.readingTime,
              hint: p.description,
            }))}
          />
        </Section>
      ))}
    </div>
  );
}
