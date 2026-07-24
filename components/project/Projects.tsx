import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { getAllProjects } from "@/lib/projects";
import { Section, GridBand, GridCell } from "@/components/ui";

/**
 * Older builds, deliberately understated. These are course-era projects that
 * predate the work-experience section above, so they get one quiet row of text
 * links rather than cards — present for the record, not competing for
 * attention. The full write-ups still live at /project/[slug].
 */
export default function Projects() {
  const projects = getAllProjects();

  if (projects.length === 0) return null;

  return (
    <Section
      title="older work"
      id="projects"
      subtitle="earlier builds, mostly course-era — kept for the record."
    >
      <GridBand cols="grid-cols-1">
        <GridCell padded={false}>
          <ul className="font-code flex flex-wrap gap-x-8 gap-y-3 px-6 py-5 text-sm sm:px-8">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/project/${project.slug}`}
                  className="hover:text-blue group inline-flex items-center gap-1.5 text-gray-500 transition-colors"
                >
                  {project.title}
                  <LuArrowUpRight
                    size={13}
                    className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </GridCell>
      </GridBand>
    </Section>
  );
}
