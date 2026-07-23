import { getAllPosts } from "@/lib/blog";
import { Section, GridBand, GridCell } from "@/components/ui";
import { LuArrowRight } from "react-icons/lu";
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
            className="group transition-colors hover:bg-gray-50 dark:hover:bg-black"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="flex flex-col justify-between gap-3 p-8 sm:flex-row sm:items-start sm:p-10"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="inline-flex shrink-0 items-center bg-gradient-to-r from-[#5d8cd7] to-[#8b5cf6] px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase">
                      latest
                    </span>
                  )}
                  <h3 className="ss01 normal-case-force group-hover:text-blue text-base font-semibold transition-colors">
                    {post.title}
                  </h3>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-border font-code border px-2 py-0.5 text-xs text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs text-gray-400 sm:flex-col sm:items-end sm:gap-1.5">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span className="sm:hidden">·</span>
                <span>{post.readingTime}</span>
                <LuArrowRight
                  size={15}
                  className="group-hover:text-blue mt-0.5 hidden transition-transform group-hover:translate-x-0.5 sm:block"
                />
              </div>
            </Link>
          </GridCell>
        ))}
      </GridBand>
    </Section>
  );
}
