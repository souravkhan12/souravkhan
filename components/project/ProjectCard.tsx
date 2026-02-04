import Image from "next/image";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import TechStack from "../tech-stack/Techstack";
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
      <div className="group relative h-60 w-full self-stretch overflow-hidden rounded-[12px] border border-gray-200/20 lg:w-[400px] dark:border-gray-700/20">
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>

      {/* Project Info */}
      <div className="flex-1">
        <h2 className="mb-5 text-xl font-semibold tracking-tight dark:text-gray-100">
          {project.title}
        </h2>
        <p className="mb-5 leading-relaxed text-gray-600 dark:text-gray-300">
          {project.description}
        </p>

        {/* Tech Stack and Links */}
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <TechStack technologies={project.technologies} />
          <div className="flex items-end gap-4">
            <Button asChild size="icon" variant="secondary">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live link`}
              >
                <LuExternalLink />
              </a>
            </Button>

            <Button asChild size="icon" variant="secondary">
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code`}
              >
                <SiGithub />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
