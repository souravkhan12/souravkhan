import Image from "next/image";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import TechStack from "./Techstack";
import { Project } from "@/types";
import { Card, Button } from "@/components/ui";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card
      variant="default"
      className="flex flex-col items-center justify-center gap-20 lg:flex-row"
    >
      {/* Project Image */}
      <div className="group relative h-60 w-full self-stretch overflow-hidden rounded-xl border border-gray-200 lg:w-[400px] dark:border-gray-700">
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          className="rounded-2xl object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </div>

      {/* Project Info */}
      <div className="flex-1">
        <h2 className="mb-5 text-xl dark:text-gray-100">{project.title}</h2>
        <p className="mb-5 justify-items-start leading-relaxed text-gray-500 dark:text-gray-300">
          {project.description}
        </p>

        {/* Tech Stack and Links */}
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <TechStack technologies={project.technologies} />
          <div className="flex items-end gap-4">
            <Button
              as="a"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              size="icon"
              variant="secondary"
              aria-label={`${project.title} live link`}
            >
              <LuExternalLink />
            </Button>
            <Button
              as="a"
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              size="icon"
              variant="secondary"
              aria-label={`${project.title} source code`}
            >
              <SiGithub />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
