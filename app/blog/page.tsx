import { getAllPosts } from "@/lib/blog";
import { Section, GridBand, GridCell } from "@/components/ui";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, web development, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section title="blog" className="pt-8">
      <GridBand cols="grid-cols-1">
        {posts.map((post, index) => (
          <GridCell
            key={post.slug}
            padded={false}
            tinted={index % 2 === 1}
            className="group"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-start sm:p-8"
            >
              <div className="min-w-0">
                <h3 className="ss01 normal-case-force group-hover:text-blue text-base font-semibold transition-colors">
                  {post.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-border border px-2 py-0.5 text-xs text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs text-gray-400 sm:flex-col sm:items-end sm:gap-1">
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
            </Link>
          </GridCell>
        ))}
      </GridBand>
    </Section>
  );
}
