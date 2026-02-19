import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub } from "react-icons/si";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: project.image ? [{ url: project.image }] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="prose prose-gray dark:prose-invert mx-auto max-w-3xl px-4 py-12">
      <header className="mt-10">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
      </header>
      {project.image && (
        <div className="relative mb-10 h-64 w-full overflow-hidden rounded-lg sm:h-80">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="mb-8 flex flex-wrap gap-4">
        {project.link && (
          <Link
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <LuExternalLink className="h-4 w-4" />
            Live Demo
          </Link>
        )}
        {project.code && (
          <Link
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <SiGithub className="h-4 w-4" />
            Source Code
          </Link>
        )}
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {project.description}
      </p>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold">Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <hr className="my-8" />
      <MDXRemote source={project.content} />
    </article>
  );
}
