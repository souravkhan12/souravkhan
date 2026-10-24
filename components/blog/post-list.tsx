"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { LuArrowRight, LuSearch } from "react-icons/lu";
import { HoverList, HoverItem } from "@/components/motion/hover-list";
import { SPRING } from "@/config/theme";
import { formatDate as fmtPostDate } from "@/lib/utils";

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
  /** Pulls the newest post out into a featured card above the list. */
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

  const featured = showLatestBadge && !query ? filtered[0] : undefined;
  const rest = featured ? filtered.slice(1) : filtered;

  return (
    <>
      {showSearch && posts.length > 2 && (
        <div className="relative mb-8">
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
            placeholder="Search posts…"
            className="bg-surface focus:bg-background focus:border-blue/60 focus:ring-blue/10 w-full rounded-full border border-transparent py-3 pr-4 pl-11 text-sm transition-colors outline-none focus:ring-4"
          />
        </div>
      )}

      {featured && <FeaturedPost post={featured} />}

      {filtered.length === 0 ? (
        <p className="text-soft py-10 text-sm">Nothing matches “{query}”.</p>
      ) : (
        <HoverList as="div" className="flex flex-col">
          <AnimatePresence initial={false}>
            {rest.map((post) => (
              <motion.div
                key={post.slug}
                layout="position"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={SPRING.smooth}
              >
                <HoverItem itemKey={post.slug} as="div">
                  <PostRow post={post} />
                </HoverItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </HoverList>
      )}
    </>
  );
}

function PostRow({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-start gap-5 py-4"
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold tracking-tight text-pretty">
          {post.title}
        </h3>
        <p className="text-soft mt-1 line-clamp-2 text-sm">
          {post.description}
        </p>
        <p className="font-code text-faint text-2xs mt-2 flex flex-wrap items-center gap-x-2">
          <time dateTime={post.date}>{fmtPostDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="hidden sm:inline">
              <span aria-hidden="true">· </span>
              {tag}
            </span>
          ))}
        </p>
      </div>

      {post.image && (
        <div className="bg-surface relative hidden aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl sm:block">
          <Image
            src={post.image}
            alt=""
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>
      )}
    </Link>
  );
}

function FeaturedPost({ post }: { post: PostSummary }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-background shadow-soft mb-6 block overflow-hidden rounded-2xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-1"
    >
      {post.image && (
        <div className="bg-surface relative aspect-[2/1] w-full overflow-hidden">
          <Image
            src={post.image}
            alt=""
            fill
            priority
            sizes="(max-width: 860px) 100vw, 800px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="p-5 sm:p-7">
        <p className="font-code text-2xs text-faint flex items-center gap-2">
          <span className="bg-blue/10 text-blue rounded-full px-2 py-0.5">
            latest
          </span>
          <time dateTime={post.date}>{fmtPostDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </p>
        <h2 className="mt-3 text-lg font-bold tracking-[-0.02em] text-balance">
          {post.title}
        </h2>
        <p className="text-soft mt-2 line-clamp-2 text-sm leading-relaxed">
          {post.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
          Read post
          <LuArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
