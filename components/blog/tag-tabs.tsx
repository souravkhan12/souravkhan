import { getAllTags } from "@/lib/blog";
import { AnimatedTabs } from "@/components/motion/animated-tabs";

/** "All" plus one tab per tag; the active pill springs to the current page. */
export function TagTabs({ active }: { active: string | null }) {
  const tags = getAllTags();
  return (
    <AnimatedTabs
      label="Filter posts by tag"
      active={active ?? "all"}
      tabs={[
        { value: "all", label: "All", href: "/blog" },
        ...tags.map(({ tag, slug, count }) => ({
          value: slug,
          label: tag,
          href: `/blog/tags/${slug}`,
          count,
        })),
      ]}
    />
  );
}
