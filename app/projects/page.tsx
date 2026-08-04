import Link from "next/link";
import Image from "next/image";
import { LuArrowRight, LuGithub, LuExternalLink } from "react-icons/lu";
import { getAllProjects } from "@/lib/projects";
import { Section, GridBand, GridCell } from "@/components/ui";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Projects",
  description:
    "Things I've designed, built and shipped — with the problem, the constraints and the tradeoffs behind each one.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/projects` },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <>
      <Section
        title="projects"
        subtitle="what i've built, and why it was built that way."
        className="pt-8"
      >
        <GridBand cols="grid-cols-1 md:grid-cols-2">
          {projects.map((project, index) => (
            <GridCell
              key={project.slug}
              padded={false}
              tinted={index % 2 === 1}
              className="group transition-colors hover:bg-gray-50 dark:hover:bg-black"
            >
              <div className="flex h-full flex-col">
                <Link
                  href={`/project/${project.slug}`}
                  className="flex flex-1 flex-col"
                >
                  {project.image && (
                    <div className="border-border relative aspect-[16/9] w-full overflow-hidden border-b">
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <h2 className="ss01 normal-case-force group-hover:text-blue text-lg font-semibold tracking-[-0.01em] transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-soft mt-2 line-clamp-3 text-sm">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="border-border font-code text-2xs text-soft border px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <span className="text-blue mt-auto inline-flex items-center gap-1.5 pt-5 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      case study <LuArrowRight size={13} aria-hidden="true" />
                    </span>
                  </div>
                </Link>

                <div className="border-border font-code flex items-center gap-4 border-t px-6 py-3 text-xs sm:px-8">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue text-soft inline-flex items-center gap-1.5 transition-colors"
                    >
                      <LuExternalLink size={12} aria-hidden="true" />
                      live
                    </a>
                  )}
                  {project.code && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue text-soft inline-flex items-center gap-1.5 transition-colors"
                    >
                      <LuGithub size={12} aria-hidden="true" />
                      source
                    </a>
                  )}
                </div>
              </div>
            </GridCell>
          ))}
        </GridBand>
      </Section>
    </>
  );
}
