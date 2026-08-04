import type { ReadingNavGroup } from "@/components/reading/reading-nav";
import { getPatternCategories, type FlavorSlug } from "@/lib/patterns";

/**
 * The sidebar's contents for one flavour, grouped by category — the same
 * taxonomy the index shows, so the sidebar and the index can't drift apart.
 */
export function patternNavGroups(flavor: FlavorSlug): ReadingNavGroup[] {
  return getPatternCategories(flavor).map((category) => ({
    label: category.label.toLowerCase(),
    items: category.patterns.map((pattern) => ({
      href: pattern.href,
      title: pattern.title,
    })),
  }));
}
