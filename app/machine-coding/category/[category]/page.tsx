import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, RowList } from "@/components/ui";
import {
  getMachineCodingCategories,
  getMachineCodingCategory,
} from "@/lib/machine-coding";
import { SEO_CONFIG } from "@/config/seo";

/**
 * One page per category, generated from whatever categories the content
 * declares — no route is added when a section is. `getMachineCodingCategories`
 * is the single source of the taxonomy.
 */
export function generateStaticParams() {
  return getMachineCodingCategories().map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getMachineCodingCategory(slug);
  if (!category) return {};

  const url = `${SEO_CONFIG.baseUrl}/machine-coding/category/${slug}`;
  const names = category.questions.map((q) => q.title).join(", ");

  return {
    title: `${category.label} — machine coding questions`,
    description: `${category.count} machine coding questions on ${category.label.toLowerCase()}: ${names}. Each with the approach, a working solution and the usual mistakes.`,
    alternates: { canonical: url },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getMachineCodingCategory(slug);
  if (!category) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/machine-coding", label: "Machine coding" }}
        title={category.label}
        muted={`${category.count} question${category.count === 1 ? "" : "s"}.`}
        description="The approach, the solution, and what usually goes wrong."
      />

      <RowList
        rows={category.questions.map((q) => ({
          href: `/machine-coding/${q.slug}`,
          title: q.title,
          meta: `${q.difficulty} · ${q.tags.slice(0, 3).join(", ")}`,
          hint: q.question,
        }))}
      />
    </>
  );
}
