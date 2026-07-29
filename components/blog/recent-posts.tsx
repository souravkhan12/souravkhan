import { getAllPosts } from "@/lib/blog";
import Link from "next/link";

export function RecentPosts() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {posts.length === 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The first post is still being written.
        </p>
      )}

      <ul className="flex flex-col">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="border-border border-b last:border-b-0"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-baseline justify-between gap-4 py-3"
            >
              <span className="group-hover:text-blue min-w-0 truncate text-sm text-gray-600 transition-colors dark:text-gray-400">
                {post.title}
              </span>
              <time
                dateTime={post.date}
                className="shrink-0 text-xs text-gray-400"
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
        className="hover:text-blue mt-auto text-sm font-semibold lowercase transition-colors"
      >
        read the blog<span aria-hidden="true"> →</span>
      </Link>
    </div>
  );
}
