import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECT_DIR = path.join(process.cwd(), "content/projects");

export type Project = {
  slug: string;
  title: string;
  description: string;
  image: string;
  link: string;
  code: string;
  technologies: string[];
  published: boolean;
  content: string;
};

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(PROJECT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(PROJECT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: filename.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        image: data.image,
        link: data.link,
        code: data.code,
        technologies: data.technologies || [],
        published: data.published ?? true,
        content,
      };
    })
    .filter((project) => project.published);
}

export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find((project) => project.slug === slug);
}
