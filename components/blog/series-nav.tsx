import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

/**
 * "Part 2 of 4" navigation for multi-post series — the strongest return-visit
 * mechanic a blog has, since a reader who finishes part 1 has a reason to come
 * back for part 2.
 */
export function SeriesNav({
  series,
  posts,
  currentSlug,
}: {
  series: string;
  posts: BlogPost[];
  currentSlug: string;
}) {
  const index = posts.findIndex((p) => p.slug === currentSlug);

  return (
    <nav
      aria-label={`Posts in the ${series} series`}
      className="not-prose bg-surface mb-10 overflow-hidden rounded-2xl p-1.5"
    >
      <div className="flex items-center justify-between gap-3 px-3.5 pt-2 pb-2.5">
        <span className="text-sm font-semibold">{series}</span>
        <span className="font-code text-2xs text-soft">
          part {index + 1} of {posts.length}
        </span>
      </div>
      <ol className="flex flex-col gap-0.5">
        {posts.map((post, i) => {
          const isCurrent = post.slug === currentSlug;
          return (
            <li key={post.slug}>
              {isCurrent ? (
                <div
                  aria-current="page"
                  className="bg-background shadow-soft flex items-center gap-3 rounded-xl px-3.5 py-2.5"
                >
                  <span className="font-code text-blue text-2xs w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold">{post.title}</span>
                </div>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-soft hover:text-foreground hover:bg-background/60 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors"
                >
                  <span className="font-code text-2xs text-faint w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{post.title}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
