import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { extractHeadings, type Heading } from "@/lib/content";

export type { Heading };

const PATTERNS_DIR = path.join(process.cwd(), "content/patterns");

/**
 * The flavours a pattern can be written for — one directory each under
 * content/patterns.
 *
 * Hardcoded rather than derived from the filesystem: the flavour is the thing
 * the dropdown switches between, so its label and ordering are editorial
 * decisions, and an empty `react/` folder should still offer the tab. Adding a
 * flavour is one entry here plus a directory.
 */
export const FLAVORS = [
  {
    slug: "vanilla",
    label: "Vanilla",
    /** Sits under the index heading. */
    blurb:
      "design patterns in plain JavaScript — the ones that predate any framework and still explain what the framework is doing.",
  },
  {
    slug: "react",
    label: "React",
    blurb:
      "patterns that only make sense once there's a component tree — composition, state ownership, and the escape hatches.",
  },
] as const;

export type FlavorSlug = (typeof FLAVORS)[number]["slug"];
export type Flavor = (typeof FLAVORS)[number];

/** The flavour a bare /patterns visit lands on. */
export const DEFAULT_FLAVOR: FlavorSlug = "vanilla";

export function isFlavor(value: string): value is FlavorSlug {
  return FLAVORS.some((f) => f.slug === value);
}

export function getFlavor(slug: string): Flavor | null {
  return FLAVORS.find((f) => f.slug === slug) ?? null;
}

/**
 * Frontmatter contract. Validated at build time so a typo'd `category` fails
 * loudly instead of quietly creating a one-item section nobody notices.
 */
const patternSchema = z.object({
  title: z.string().min(1),
  /** One line under the title, and the meta description. */
  description: z.string().min(1),
  /** Groups the pattern on the index. Slug-cased: "creational". */
  category: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "must be lowercase, digits and dashes only"),
  /** Human label for the category — the first file to declare one wins. */
  categoryLabel: z.string().min(1),
  tags: z.array(z.string()).default([]),
  /** Sort key within a category. Lower first. */
  order: z.number().default(0),
  /** Set false to keep a draft out of the build. */
  published: z.boolean().default(true),
});

export type Pattern = z.infer<typeof patternSchema> & {
  slug: string;
  flavor: FlavorSlug;
  /** `/patterns/vanilla/singleton-pattern` — precomputed so callers don't rebuild it. */
  href: string;
  readingTime: string;
  content: string;
};

export type PatternCategory = {
  slug: string;
  label: string;
  count: number;
  patterns: Pattern[];
};

/** Drafts are visible under `bun run dev` so they can be previewed without deploying. */
const showDrafts = process.env.NODE_ENV === "development";

function parseFile(flavor: FlavorSlug, filename: string): Pattern {
  const slug = filename.replace(/\.mdx$/, "");
  const relative = `content/patterns/${flavor}/${filename}`;
  const raw = fs.readFileSync(
    path.join(PATTERNS_DIR, flavor, filename),
    "utf-8",
  );
  const { data, content } = matter(raw);

  const parsed = patternSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${relative}:\n${issues}`);
  }

  return {
    ...parsed.data,
    slug,
    flavor,
    href: `/patterns/${flavor}/${slug}`,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getPatterns(flavor: FlavorSlug): Pattern[] {
  const dir = path.join(PATTERNS_DIR, flavor);
  // The directory is absent until the first pattern in that flavour is written.
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseFile(flavor, f))
    .filter((p) => p.published || showDrafts)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

/** Every pattern in every flavour — for the sitemap and static params. */
export function getAllPatterns(): Pattern[] {
  return FLAVORS.flatMap((f) => getPatterns(f.slug));
}

export function getPattern(flavor: string, slug: string): Pattern | null {
  if (!isFlavor(flavor)) return null;
  return getPatterns(flavor).find((p) => p.slug === slug) ?? null;
}

/**
 * Categories for one flavour, derived from the patterns rather than hardcoded
 * — adding an .mdx with a new `category` grows the index with no other edit.
 */
export function getPatternCategories(flavor: FlavorSlug): PatternCategory[] {
  const bySlug = new Map<string, PatternCategory>();

  for (const pattern of getPatterns(flavor)) {
    const existing = bySlug.get(pattern.category);
    if (existing) {
      existing.count += 1;
      existing.patterns.push(pattern);
    } else {
      bySlug.set(pattern.category, {
        slug: pattern.category,
        label: pattern.categoryLabel,
        count: 1,
        patterns: [pattern],
      });
    }
  }

  // Biggest section first, then alphabetical — so the index leads with substance.
  return [...bySlug.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

export function getPatternHeadings(pattern: Pattern): Heading[] {
  return extractHeadings(pattern.content);
}

/**
 * Where each flavour's tab should point while you're looking at `slug`.
 *
 * The whole point of the switcher is that the observer pattern in vanilla and
 * in React are the *same idea* — so if the other flavour has a file with the
 * same slug, switching keeps you on that idea instead of dumping you at its
 * index. When it doesn't, the index is the honest destination.
 */
export function getFlavorTargets(
  slug?: string,
): { flavor: Flavor; href: string; hasMatch: boolean }[] {
  return FLAVORS.map((flavor) => {
    const hasMatch = Boolean(slug && getPattern(flavor.slug, slug));
    return {
      flavor,
      href: hasMatch
        ? `/patterns/${flavor.slug}/${slug}`
        : `/patterns/${flavor.slug}`,
      hasMatch,
    };
  });
}

/**
 * Prev/next within the flavour, in index order — the reading order the index
 * presents, so "next" means what it looks like it means.
 */
export function getPatternSiblings(pattern: Pattern) {
  const all = getPatterns(pattern.flavor);
  const index = all.findIndex((p) => p.slug === pattern.slug);

  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
  };
}
