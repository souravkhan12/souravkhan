import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { extractHeadings, type Heading } from "@/lib/content";

export type { Heading };

const BLOG_DIR = path.join(process.cwd(), "content/blog");

/**
 * Frontmatter contract. Validated at build time so a typo'd `date` fails the
 * build instead of silently producing "Invalid Date" in the sitemap and feed.
 */
const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().refine((d) => !Number.isNaN(Date.parse(d)), {
    message: "must be a parseable date (prefer YYYY-MM-DD)",
  }),
  updated: z
    .string()
    .refine((d) => !Number.isNaN(Date.parse(d)), {
      message: "must be a parseable date (prefer YYYY-MM-DD)",
    })
    .optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  image: z.string().optional(),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
});

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  published: boolean;
  image?: string;
  series?: string;
  seriesOrder?: number;
  readingTime: string;
  content: string;
};

/** Drafts are visible while running `bun run dev` so they can be previewed without deploying. */
const showDrafts = process.env.NODE_ENV === "development";

function readPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));

      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues
          .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
          .join("\n");
        throw new Error(
          `Invalid frontmatter in content/blog/${filename}:\n${issues}`,
        );
      }

      return {
        ...parsed.data,
        slug: filename.replace(/\.mdx$/, ""),
        readingTime: readingTime(content).text,
        content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Posts for on-site rendering. Includes drafts in development only. */
export function getAllPosts(): BlogPost[] {
  return readPosts().filter((post) => post.published || showDrafts);
}

/**
 * Strictly published posts — always excludes drafts regardless of environment.
 * Use for anything that leaves the site: sitemap, RSS, OG images.
 */
export function getPublishedPosts(): BlogPost[] {
  return readPosts().filter((post) => post.published);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostHeadings(post: BlogPost): Heading[] {
  return extractHeadings(post.content);
}

/**
 * Drop the MDX body before handing a post to a client component — the content
 * string is by far the largest field and never needed in the browser.
 */
export function toSummary(post: BlogPost) {
  const { slug, title, description, date, tags, readingTime, image } = post;
  return { slug, title, description, date, tags, readingTime, image };
}

/** Slug form used in /blog/tags/[tag] URLs. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Every distinct tag with its post count, most-used first. */
export function getAllTags(): { tag: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(slug: string): BlogPost[] {
  return getAllPosts().filter((post) =>
    post.tags.some((tag) => tagSlug(tag) === slug),
  );
}

/**
 * Related posts scored by shared tags, falling back to recency so the slot is
 * never empty on a post whose tags are unique.
 */
export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const currentTags = new Set(current.tags.map(tagSlug));

  return getAllPosts()
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      overlap: post.tags.filter((tag) => currentTags.has(tagSlug(tag))).length,
    }))
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime(),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}

/** All posts in a series, ordered by `seriesOrder` then date. */
export function getSeriesPosts(series: string): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.series === series)
    .sort(
      (a, b) =>
        (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0) ||
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
}
