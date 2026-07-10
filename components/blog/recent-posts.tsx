import { getAllPosts } from "@/lib/blog";
import { Card } from "@/components/ui";
import Link from "next/link";

export function RecentPosts() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card
              variant="default"
              padding="md"
              className="group hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-300">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                </div>
                <div className="text-muted-foreground flex shrink-0 flex-col items-end gap-0.5 text-xs">
                  <time dateTime={post.date} className="font-medium">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          View all posts
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </>
  );
}
