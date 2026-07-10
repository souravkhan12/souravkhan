import { getAllPosts } from "@/lib/blog";
import { Section, Card } from "@/components/ui";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, web development, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section title="Blog" spacing="md" className="mt-10">
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card
              variant="default"
              padding="md"
              className="group hover:border-foreground/20 transition-colors"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-white dark:group-hover:text-gray-300">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs sm:flex-col sm:items-end sm:gap-0.5">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span className="sm:hidden">·</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
