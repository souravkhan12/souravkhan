import fs from "fs";
import path from "path";
import { z } from "zod";

const READING_FILE = path.join(process.cwd(), "content/reading/bookmarks.json");

/**
 * Frontmatter contract for the reading list. Validated at build time for the
 * same reason posts are: a bad `date` should fail the build, not render as
 * "Invalid Date" on the page.
 */
const bookmarkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  /** Who wrote it — shown next to the source domain. */
  author: z.string().optional(),
  /** Why it's here. The list is worthless without this. */
  note: z.string().min(1),
  tags: z.array(z.string()).default([]),
  /** When it was bookmarked, not when it was published. */
  date: z.string().refine((d) => !Number.isNaN(Date.parse(d)), {
    message: "must be a parseable date (prefer YYYY-MM-DD)",
  }),
});

export type Bookmark = z.infer<typeof bookmarkSchema> & { source: string };

/** "https://grugbrain.dev/x" → "grugbrain.dev" */
function sourceOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getBookmarks(): Bookmark[] {
  if (!fs.existsSync(READING_FILE)) return [];

  const raw = JSON.parse(fs.readFileSync(READING_FILE, "utf-8"));
  const parsed = z.array(bookmarkSchema).safeParse(raw);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content/reading/bookmarks.json:\n${issues}`);
  }

  return parsed.data
    .map((b) => ({ ...b, source: sourceOf(b.url) }))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getReadingTags(): string[] {
  return [...new Set(getBookmarks().flatMap((b) => b.tags))].sort();
}
