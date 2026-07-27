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
      className="not-prose border-border mb-10 border"
    >
      <div className="border-border flex items-center justify-between gap-3 border-b bg-gray-50 px-4 py-2.5 dark:bg-black">
        <span className="ss01 text-sm font-semibold">{series}</span>
        <span className="font-code text-[11px] text-gray-500">
          part {index + 1} of {posts.length}
        </span>
      </div>
      <ol className="divide-border divide-y">
        {posts.map((post, i) => {
          const isCurrent = post.slug === currentSlug;
          return (
            <li key={post.slug}>
              {isCurrent ? (
                <div
                  aria-current="page"
                  className="bg-blue/5 flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="font-code text-blue w-5 shrink-0 text-[11px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-blue text-sm font-medium">
                    {post.title}
                  </span>
                </div>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-black"
                >
                  <span className="font-code w-5 shrink-0 text-[11px] text-gray-400">
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
