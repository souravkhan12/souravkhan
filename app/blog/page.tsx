import { getAllPosts } from "@/lib/blog";
import { Section, GridBand, GridCell } from "@/components/ui";
import { LuArrowRight } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, web development, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Section
      title="writing"
      subtitle="notes on building for the web — the version i'd give a teammate, not a listicle."
      className="pt-8"
    >
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
              className="flex gap-5 p-6 sm:gap-7 sm:p-8"
            >
              {post.image && (
                <div className="border-border relative hidden aspect-[4/3] w-40 shrink-0 overflow-hidden border sm:block">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <span className="border-blue text-blue inline-flex shrink-0 items-center border px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                      latest
                    </span>
                  )}
                  <div className="font-code flex items-center gap-2 text-[11px] text-gray-400">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>

                <h3 className="ss01 normal-case-force group-hover:text-blue mt-2 text-lg font-semibold tracking-[-0.01em] transition-colors">
                  {post.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="border-border font-code border px-2 py-0.5 text-[11px] text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <LuArrowRight
                    size={16}
                    className="group-hover:text-blue shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 dark:text-gray-600"
                  />
                </div>
              </div>
            </Link>
          </GridCell>
        ))}
      </GridBand>
    </Section>
  );
}
