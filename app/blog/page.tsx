import { getAllPosts } from "@/lib/blog";
import { Section } from "@/components/ui";
import { Card } from "@/components/ui";
import Link from "next/link";
import { LAYOUT } from "@/config/styles";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import { PatternDivider } from "@/components/ui/pattern-divider";

export const metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, web development, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex [--pattern-fg:var(--color-gray-950)]/5 dark:bg-[#1E1E1E] dark:[--pattern-fg:var(--color-white)]/10">
      <PatternDivider position="left" />
      <div className={`${LAYOUT.container} dark:bg-[#1E1E1E]`}>
        <Navbar />
        <Section title="Blog" spacing="md">
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card
                  variant="default"
                  padding="md"
                  className="h-full transition-shadow hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>
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
                </Card>
              </Link>
            ))}
          </div>
        </Section>
        <Footer />
      </div>
      <PatternDivider position="right" />
    </div>
  );
}
