import { getAllPosts } from "@/lib/blog";
import { Card } from "@/components/ui";
import Link from "next/link";

export function RecentPosts() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`}>
          <Card
            variant="default"
            padding="sm"
            className="h-full transition-shadow hover:shadow-md"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {post.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {post.description}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
