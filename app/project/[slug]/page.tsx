import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { LuGithub } from "react-icons/lu";
import { PageHeader } from "@/components/ui";
import { Pill } from "@/components/motion/pill";
import { TechChip } from "@/components/ui/tech";
import { SEO_CONFIG } from "@/config/seo";

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
    alternates: { canonical: `${SEO_CONFIG.baseUrl}/project/${slug}` },
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
    <article className="pb-8">
      <PageHeader
        back={{ href: "/projects", label: "All projects" }}
        title={project.title}
        description={project.description}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <TechChip key={tech} label={tech} />
            ))}
          </div>
          {(project.link || project.code) && (
            <div className="flex flex-wrap gap-2.5">
              {project.link && (
                <Pill
                  href={project.link}
                  external
                  variant="solid"
                  magnetic
                  arrow="up-right"
                >
                  Live demo
                </Pill>
              )}
              {project.code && (
                <Pill href={project.code} external magnetic>
                  <LuGithub size={15} aria-hidden="true" />
                  Source
                </Pill>
              )}
            </div>
          )}
        </div>
      </PageHeader>

      {project.image && (
        <div className="bg-surface shadow-soft relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 860px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-a:text-blue prose-a:no-underline hover:prose-a:underline blog-measure">
        <MDXRemote source={project.content} />
      </div>
    </article>
  );
}
