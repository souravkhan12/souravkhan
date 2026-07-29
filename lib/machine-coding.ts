import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const MC_DIR = path.join(process.cwd(), "content/machine-coding");

/** The repo the solutions actually live in. */
export const MC_REPO = {
  owner: "souravkhan12",
  name: "Machine_Coding",
  branch: "main",
} as const;

export const MC_REPO_URL = `https://github.com/${MC_REPO.owner}/${MC_REPO.name}`;

/**
 * Slugs that would collide with a static child route under /machine-coding.
 * A question called "category" would shadow the category index, so the build
 * fails loudly here instead of silently serving the wrong page.
 */
const RESERVED_SLUGS = new Set(["category"]);

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/**
 * Frontmatter contract. Validated at build time so a typo'd category can't
 * quietly create a one-item section nobody notices.
 */
const questionSchema = z.object({
  title: z.string().min(1),
  /** What the interviewer actually asks for. Shown under the title. */
  question: z.string().min(1),
  /** Groups the question on the index. Slug-cased: "react-ui". */
  category: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "must be lowercase, digits and dashes only"),
  /** Human label for the category — the first file to declare one wins. */
  categoryLabel: z.string().min(1),
  difficulty: z.enum(DIFFICULTIES),
  tags: z.array(z.string()).default([]),
  /** Directory in the Machine_Coding repo, e.g. "src/folders/debounce". */
  repoPath: z.string().min(1),
  /** Sort key within a category. Lower first. */
  order: z.number().default(0),
  /** Set false to keep a draft out of the build. */
  published: z.boolean().default(true),
});

export type MachineCodingQuestion = z.infer<typeof questionSchema> & {
  slug: string;
  readingTime: string;
  content: string;
  /** Link to the solution directory on GitHub. */
  repoUrl: string;
};

export type Category = {
  slug: string;
  label: string;
  count: number;
  questions: MachineCodingQuestion[];
};

function parseFile(filename: string): MachineCodingQuestion {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(MC_DIR, filename), "utf-8");
  const { data, content } = matter(raw);

  const parsed = questionSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid frontmatter in content/machine-coding/${filename}:\n${issues}`,
    );
  }

  if (RESERVED_SLUGS.has(slug)) {
    throw new Error(
      `content/machine-coding/${filename}: "${slug}" is a reserved slug — it would shadow /machine-coding/${slug}.`,
    );
  }

  return {
    ...parsed.data,
    slug,
    readingTime: readingTime(content).text,
    content,
    repoUrl: `${MC_REPO_URL}/tree/${MC_REPO.branch}/${parsed.data.repoPath}`,
  };
}

export function getAllMachineCodingQuestions(): MachineCodingQuestion[] {
  if (!fs.existsSync(MC_DIR)) return [];

  return fs
    .readdirSync(MC_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parseFile)
    .filter((q) => q.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getMachineCodingBySlug(
  slug: string,
): MachineCodingQuestion | null {
  return getAllMachineCodingQuestions().find((q) => q.slug === slug) ?? null;
}

/**
 * Categories, derived from the questions rather than hardcoded — adding an
 * .mdx with a new `category` creates the section and its route with no other
 * edit. That's the "dynamic sections" part: the taxonomy lives in content.
 */
export function getMachineCodingCategories(): Category[] {
  const bySlug = new Map<string, Category>();

  for (const question of getAllMachineCodingQuestions()) {
    const existing = bySlug.get(question.category);
    if (existing) {
      existing.count += 1;
      existing.questions.push(question);
    } else {
      bySlug.set(question.category, {
        slug: question.category,
        label: question.categoryLabel,
        count: 1,
        questions: [question],
      });
    }
  }

  // Biggest section first, then alphabetical — so the index leads with substance.
  return [...bySlug.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

export function getMachineCodingCategory(slug: string): Category | null {
  return getMachineCodingCategories().find((c) => c.slug === slug) ?? null;
}

export type SolutionFile = {
  /** Path relative to the question's directory, e.g. "switch.jsx". */
  name: string;
  /** Fence language for the highlighter. */
  language: string;
  source: string;
};

const CODE_DIR = path.join(MC_DIR, "code");

const LANGUAGES: Record<string, string> = {
  ".js": "js",
  ".jsx": "jsx",
  ".ts": "ts",
  ".tsx": "tsx",
  ".css": "css",
};

/**
 * The vendored solution source for one question, written by
 * `bun run sync:machine-coding`.
 *
 * Read from disk rather than fetched from GitHub so a build can't fail on an
 * API outage or an unauthenticated rate limit. Returns [] before the first
 * sync, which renders the page without a solution section instead of erroring.
 */
export function getSolutionFiles(slug: string): SolutionFile[] {
  const dir = path.join(CODE_DIR, slug);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir, { recursive: true, encoding: "utf-8" })
    .filter((name) => {
      const full = path.join(dir, name);
      return fs.statSync(full).isFile() && path.extname(name) in LANGUAGES;
    });

  return files
    .map((name) => ({
      name,
      language: LANGUAGES[path.extname(name)],
      source: fs.readFileSync(path.join(dir, name), "utf-8").trimEnd(),
    }))
    .sort(byReadingOrder);
}

/**
 * Entry point first, then other logic, then styles — the order you'd read the
 * solution in, rather than alphabetical (which buries `index` under `config`).
 */
function byReadingOrder(a: SolutionFile, b: SolutionFile): number {
  const rank = (f: SolutionFile) => {
    if (f.language === "css") return 2;
    if (/(^|\/)index\.[jt]sx?$/.test(f.name)) return 0;
    return 1;
  };
  return rank(a) - rank(b) || a.name.localeCompare(b.name);
}
