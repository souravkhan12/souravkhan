import type { ReadingNavGroup } from "@/components/reading/reading-nav";
import { getAllPosts } from "@/lib/blog";

/**
 * Sidebar contents for a post: every post grouped by year, newest first.
 *
 * Year rather than tag, because a post has many tags and would appear in the
 * sidebar several times — which makes the list look longer than the archive
 * actually is.
 */
export function blogNavGroups(): ReadingNavGroup[] {
  const byYear = new Map<string, ReadingNavGroup>();

  for (const post of getAllPosts()) {
    const year = new Date(post.date).getFullYear().toString();
    const item = { href: `/blog/${post.slug}`, title: post.title };

    const existing = byYear.get(year);
    if (existing) existing.items.push(item);
    else byYear.set(year, { label: year, items: [item] });
  }

  // getAllPosts is already sorted newest-first, so insertion order is right.
  return [...byYear.values()];
}
