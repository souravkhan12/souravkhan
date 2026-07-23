import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui";

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
    <article className="prose prose-gray dark:prose-invert prose-p:leading-relaxed prose-lg mx-auto max-w-3xl px-6 pt-16 pb-12 sm:px-8">
      <header>
        <h1 className="ss01 normal-case-force text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
          {project.title}
        </h1>
      </header>
      {project.image && (
        <div className="border-border relative mb-10 h-64 w-full overflow-hidden border sm:h-80">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      <div className="mb-8 flex flex-wrap gap-4">
        {project.link && (
          <Button asChild variant="default">
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <LuExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          </Button>
        )}
        {project.code && (
          <Button asChild variant="outline">
            <a href={project.code} target="_blank" rel="noopener noreferrer">
              <SiGithub className="h-4 w-4" />
              Source Code
            </a>
          </Button>
        )}
      </div>
      <p className="text-muted-foreground">{project.description}</p>
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
