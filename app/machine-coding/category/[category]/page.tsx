import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { Section, RowList } from "@/components/ui";
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
    <div className="pt-8">
      <div className="px-6 pb-4 sm:px-8">
        <Link
          href="/machine-coding"
          className="hover:text-blue font-code text-soft inline-flex items-center gap-1.5 text-xs lowercase transition-colors"
        >
          <LuArrowLeft size={13} aria-hidden="true" />
          machine coding
        </Link>
      </div>

      <Section
        title={category.label.toLowerCase()}
        id={category.slug}
        count={category.count}
        subtitle="the approach, the solution, and what usually goes wrong."
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
    </div>
  );
}
