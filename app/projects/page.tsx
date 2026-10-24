import { getAllProjects } from "@/lib/projects";
import { PageHeader } from "@/components/ui";
import { SEO_CONFIG } from "@/config/seo";
import { ProjectSchemaMarkup } from "@/components/project/ProjectSchemaMarkup";
import { ProjectCard } from "@/components/project/ProjectCard";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

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
      <ProjectSchemaMarkup />
      <PageHeader
        eyebrow="Projects"
        count={projects.length}
        title="Things I've built."
        muted="And why they were built that way."
      />

      <RevealGroup className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2">
        {projects.map((project) => (
          <RevealItem key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );
}
