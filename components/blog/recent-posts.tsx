import { getAllPosts } from "@/lib/blog";
import { Card } from "@/components/ui";
import Link from "next/link";
import Image from "next/image";

export function RecentPosts() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card
              variant="default"
              padding="sm"
              className="group h-full w-full overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700" />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-300">
                  {post.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
                <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-500">
                  <span>{post.readingTime}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={post.date} className="font-medium">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
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
