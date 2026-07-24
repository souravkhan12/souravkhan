import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { getAllProjects } from "@/lib/projects";
import { Section, GridBand, GridCell } from "@/components/ui";

export default function Projects() {
  const projects = getAllProjects();

  return (
    <Section
      title="projects"
      id="projects"
      subtitle="a few things i've built — open one for the full write-up."
    >
      <GridBand cols="grid-cols-1 sm:grid-cols-2">
        {projects.map((project, index) => (
          <GridCell
            key={project.slug}
            padded={false}
            tinted={index % 2 === 1}
            className="group transition-colors hover:bg-gray-50 dark:hover:bg-black"
          >
            <Link
              href={`/project/${project.slug}`}
              className="flex h-full items-center justify-between gap-4 p-6 sm:p-8"
            >
              <div className="min-w-0">
                <h3 className="ss01 normal-case-force group-hover:text-blue text-base font-bold transition-colors">
                  {project.title}
                </h3>
                <p className="font-code mt-1.5 truncate text-xs text-gray-500">
                  {project.technologies.join(" · ")}
                </p>
              </div>
              <LuArrowUpRight
                size={18}
                className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </GridCell>
        ))}
      </GridBand>
    </Section>
  );
}
