import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const SETUP_DIR = path.join(process.cwd(), "content/setup");

export type SetupGuide = {
  slug: string;
  title: string;
  description: string;
  order: number;
  readingTime: string;
  content: string;
};

export function getAllSetupGuides(): SetupGuide[] {
  const files = fs.readdirSync(SETUP_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(SETUP_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: filename.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        order: data.order ?? 0,
        readingTime: readingTime(content).text,
        content,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getSetupBySlug(slug: string): SetupGuide | undefined {
  return getAllSetupGuides().find((guide) => guide.slug === slug);
}
