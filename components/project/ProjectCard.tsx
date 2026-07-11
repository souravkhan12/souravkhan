"use client";

import Image from "next/image";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { Project } from "@/types";
import TechStack from "@/components/tech-stack/Techstack";
import { GridCell } from "@/components/ui";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
  tinted = false,
}: ProjectCardProps & { tinted?: boolean }) {
  const href = project.slug ? `/project/${project.slug}` : "#";

  return (
    <GridCell padded={false} tinted={tinted} className="group flex flex-col">
      <Link
        href={href}
        className="border-border relative h-64 w-full overflow-hidden border-b sm:h-72"
      >
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 600px"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-8 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <Link href={href}>
            <h3 className="ss01 hover:text-blue text-lg font-semibold transition-colors">
              {project.title}
            </h3>
          </Link>

          <div className="flex shrink-0 gap-3 pt-1 text-gray-500">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} demo`}
              className="hover:text-blue transition-colors"
            >
              <LuExternalLink size={16} />
            </a>
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code`}
              className="hover:text-blue transition-colors"
            >
              <SiGithub size={16} />
            </a>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-pretty text-gray-600 dark:text-gray-400">
          {project.description}
        </p>

        <div className="mt-auto pt-2">
          <TechStack technologies={project.technologies} colorful={true} />
        </div>
      </div>
    </GridCell>
  );
}
