import Link from "next/link";
import Image from "next/image";
import { LuArrowUpRight, LuGithub } from "react-icons/lu";
import type { Project } from "@/lib/projects";
import { TechChip } from "@/components/ui/tech";

/**
 * A soft rounded card: artwork on top, then title, blurb and tech. The whole
 * card lifts on hover with a slight overshoot and the image eases in; live
 * and source links sit outside the main link so each stays its own target.
 */
export function ProjectCard({
  project,
  compact = false,
}: {
  project: Project;
  /** Homepage size: no blurb, fewer chips. */
  compact?: boolean;
}) {
  return (
    <article className="group bg-background shadow-soft relative flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-1">
      <Link
        href={`/project/${project.slug}`}
        className="flex flex-1 flex-col focus-visible:outline-none"
      >
        {project.image && (
          <div className="bg-surface relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={project.image}
              alt=""
              fill
              sizes={
                compact
                  ? "(max-width: 640px) 100vw, 280px"
                  : "(max-width: 768px) 100vw, 520px"
              }
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
          </div>
        )}

        <div
          className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5 sm:p-6"}`}
        >
          <h3 className="flex items-center gap-1.5 text-base font-bold tracking-tight">
            {project.title}
            <LuArrowUpRight
              size={15}
              aria-hidden="true"
              className="text-faint group-hover:text-foreground transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </h3>
          {!compact && (
            <p className="text-soft mt-2 line-clamp-3 text-sm leading-relaxed">
              {project.description}
            </p>
          )}

          <div
            className={`flex flex-wrap gap-1.5 ${compact ? "mt-3" : "mt-auto pt-5"}`}
          >
            {project.technologies.slice(0, compact ? 3 : 6).map((tech) => (
              <TechChip key={tech} label={tech} size="xs" />
            ))}
          </div>
        </div>
      </Link>

      {!compact && (project.link || project.code) && (
        <div className="font-code text-2xs flex items-center gap-1 px-4 pb-4 sm:px-5">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft hover:text-foreground hover:bg-surface inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 transition-colors"
            >
              live <LuArrowUpRight size={12} aria-hidden="true" />
            </a>
          )}
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft hover:text-foreground hover:bg-surface inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors"
            >
              <LuGithub size={12} aria-hidden="true" /> source
            </a>
          )}
        </div>
      )}
    </article>
  );
}
