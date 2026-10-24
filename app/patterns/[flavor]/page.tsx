import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, RowList } from "@/components/ui";
import { Reveal } from "@/components/motion/reveal";
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
    <>
      <PageHeader
        eyebrow="Design patterns"
        count={total}
        title={`${flavor.label} patterns.`}
        muted={flavor.blurb}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <FlavorSwitcher current={slug} targets={getFlavorTargets()} />

          {categories.map((category) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className="bg-surface text-soft hover:text-foreground hover:bg-surface-hover shrink-0 rounded-full px-3 py-1 text-xs whitespace-nowrap transition-colors"
            >
              {category.label}{" "}
              <span className="font-code text-faint">{category.count}</span>
            </a>
          ))}
        </div>
      </PageHeader>

      {total === 0 && (
        <div className="py-4">
          <p className="text-base font-semibold">Nothing here yet.</p>
          <p className="text-soft mt-2 max-w-xl text-sm">
            No {flavor.label} patterns are written up yet. Switch flavour above
            for the ones that are.
          </p>
        </div>
      )}

      {/* One label-and-list row per category, the homepage's rhythm. */}
      {categories.map((category) => (
        <section
          key={category.slug}
          id={category.slug}
          className="scroll-mt-24 py-6 md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-x-10"
        >
          <h2 className="font-code text-faint text-2xs mb-3 font-normal md:mb-0 md:pt-3.5">
            {category.label}{" "}
            <span className="tabular-nums">· {category.count}</span>
          </h2>
          <Reveal className="min-w-0">
            <RowList
              rows={category.patterns.map((p) => ({
                href: p.href,
                title: p.title,
                meta: p.tags.slice(0, 3).join(", ") || p.readingTime,
                hint: p.description,
              }))}
            />
          </Reveal>
        </section>
      ))}
    </>
  );
}
