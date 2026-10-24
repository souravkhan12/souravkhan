import { getAllPosts } from "@/lib/blog";
import Link from "next/link";

/**
 * Latest three posts as title · dotted leader · date. On a phone the title
 * gets the whole line and the leader shrinks to nothing rather than pushing
 * the date onto its own row.
 */
export function RecentPosts() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) {
    return (
      <p className="text-soft text-sm">
        The first post is still being written.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-baseline gap-3 py-2.5"
            >
              <span className="group-hover:text-blue min-w-0 text-sm font-bold text-pretty transition-colors">
                {post.title}
              </span>
              <span
                aria-hidden="true"
                className="border-border min-w-4 flex-1 translate-y-[-4px] border-b border-dashed"
              />
              <time
                dateTime={post.date}
                className="font-code text-faint text-2xs shrink-0"
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/blog"
        className="hover:text-blue mt-5 text-sm font-semibold transition-colors"
      >
        All posts <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
