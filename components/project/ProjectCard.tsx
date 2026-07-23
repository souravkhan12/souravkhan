import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { Project } from "@/types";
import { GridCell } from "@/components/ui";

export default function ProjectCard({
  project,
  tinted = false,
}: {
  project: Project;
  tinted?: boolean;
}) {
  const href = project.slug ? `/project/${project.slug}` : "#";

  return (
    <GridCell padded={false} tinted={tinted} className="group flex flex-col">
      {/* terminal title bar */}
      <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-2.5 text-gray-500">
        <span className="font-code truncate text-xs">
          ~/projects/{project.slug}
        </span>
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <span className="size-2 rounded-full border border-gray-300 dark:border-gray-700" />
          <span className="size-2 rounded-full border border-gray-300 dark:border-gray-700" />
          <span className="size-2 rounded-full border border-gray-300 dark:border-gray-700" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-8 sm:p-10">
        {/* stack, printed like a shell command */}
        <p className="font-code text-xs leading-relaxed text-gray-500">
          <span className="text-gray-400 dark:text-gray-600">$ </span>
          stack:{" "}
          <span className="text-gray-700 dark:text-gray-300">
            {project.technologies.join(" · ")}
          </span>
        </p>

        <div>
          <Link href={href}>
            <h3 className="ss01 normal-case-force hover:text-blue text-lg font-semibold transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-pretty text-gray-600 dark:text-gray-400">
            {project.description}
          </p>
        </div>

        {/* actions */}
        <div className="border-border font-code mt-auto flex items-center gap-3 border-t pt-5 text-xs">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live demo`}
            className="border-border hover:border-blue hover:text-blue inline-flex items-center gap-1.5 border px-3 py-1.5 transition-colors"
          >
            live <LuArrowUpRight size={13} />
          </a>
          <a
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source code`}
            className="border-border hover:border-blue hover:text-blue inline-flex items-center gap-1.5 border px-3 py-1.5 transition-colors"
          >
            <SiGithub size={13} /> source
          </a>
          <Link
            href={href}
            className="hover:text-blue ml-auto inline-flex items-center gap-1 text-gray-500 transition-colors"
          >
            details <LuArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </GridCell>
  );
}
