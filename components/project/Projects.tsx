import ProjectCard from "./ProjectCard";
import { getAllProjects } from "@/lib/projects";
import { Section, GridBand } from "@/components/ui";

export default function Projects() {
  const projects = getAllProjects();

  return (
    <Section title="projects" id="projects">
      <GridBand cols="grid-cols-1 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            tinted={index % 2 === 1}
          />
        ))}
      </GridBand>
    </Section>
  );
}
