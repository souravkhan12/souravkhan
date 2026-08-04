"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuSearch } from "react-icons/lu";
import { GridBand, GridCell } from "@/components/ui";

/** Serializable slice of BlogPost — the MDX body never crosses to the client. */
export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  image?: string;
};

export function PostList({
  posts,
  showSearch = true,
  showLatestBadge = true,
}: {
  posts: PostSummary[];
  showSearch?: boolean;
  showLatestBadge?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) =>
      [post.title, post.description, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [posts, query]);

  return (
    <>
      {showSearch && posts.length > 2 && (
        <div className="border-border relative mb-px border">
          <LuSearch
            size={15}
            aria-hidden="true"
            className="text-faint pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
          />
          <label htmlFor="blog-search" className="sr-only">
            Search posts
          </label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search posts…"
            className="w-full bg-transparent py-3 pr-4 pl-11 text-sm outline-none"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="border-border font-code text-soft border px-6 py-10 text-center text-sm">
          nothing matches “{query}”.
        </p>
      ) : (
        <GridBand cols="grid-cols-1">
          {filtered.map((post, index) => (
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
                    {showLatestBadge && index === 0 && !query && (
                      <span className="border-blue text-blue text-2xs inline-flex shrink-0 items-center border px-1.5 py-0.5 font-medium tracking-wide uppercase">
                        latest
                      </span>
                    )}
                    <div className="font-code text-2xs text-faint flex items-center gap-2">
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
                  <p className="text-soft mt-1.5 line-clamp-2 text-sm">
                    {post.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="border-border font-code text-2xs text-soft border px-2 py-0.5"
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
      )}
    </>
  );
}
