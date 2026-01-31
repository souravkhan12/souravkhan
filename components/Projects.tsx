import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/constants/data";
import { Section } from "@/components/ui";

export default function Projects() {
  return (
    <Section title="Projects" id="projects">
      <div className="flex flex-col justify-center gap-12 sm:gap-16 lg:gap-20">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </Section>
  );
}
