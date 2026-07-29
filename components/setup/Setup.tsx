import { Section, RowList } from "@/components/ui";
import { getAllSetupGuides } from "@/lib/setup";

export default function Setup() {
  const guides = getAllSetupGuides();

  // An empty section is worse than a missing one — a heading with nothing
  // under it reads as broken. Same guard as Projects.
  if (guides.length === 0) return null;

  return (
    <Section
      title="setup"
      id="setup"
      count={guides.length}
      subtitle="the tools i actually use, and why."
    >
      <RowList
        rows={guides.map((guide) => ({
          href: `/setup/${guide.slug}`,
          title: guide.title,
          meta: guide.readingTime,
          hint: guide.description,
        }))}
      />
    </Section>
  );
}
