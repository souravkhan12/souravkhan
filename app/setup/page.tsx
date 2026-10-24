import { PageHeader, RowList } from "@/components/ui";
import { getAllSetupGuides } from "@/lib/setup";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Setup",
  description:
    "The editor, terminal and tools I actually use day to day — and the reasoning behind each choice.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/setup` },
};

/**
 * Index for the setup notes.
 *
 * Individual guides were reachable and in the sitemap, but /setup itself 404'd
 * — so trimming the URL, or guessing it the way people guess /uses, hit a dead
 * end. Every directory that has children should answer.
 */
export default function SetupPage() {
  const guides = getAllSetupGuides();

  return (
    <>
      <PageHeader
        eyebrow="Setup"
        count={guides.length}
        title="The tools I actually use."
        muted="And why."
      />
      <RowList
        rows={guides.map((guide) => ({
          href: `/setup/${guide.slug}`,
          title: guide.title,
          meta: guide.readingTime,
          hint: guide.description,
        }))}
      />
    </>
  );
}
