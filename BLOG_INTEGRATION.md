# Blog Integration Guide

This guide explains how to integrate a blog into your Next.js portfolio. We'll cover two approaches:

1. **MDX-based blog** (recommended for developer portfolios)
2. **Headless CMS** (for non-technical content management)

---

## Option 1: MDX Blog (Recommended)

MDX lets you write blog posts in Markdown with embedded React components. Posts live as `.mdx` files in your repo — no external CMS needed.

### Step 1: Install Dependencies

```bash
bun add @next/mdx @mdx-js/loader @mdx-js/react gray-matter reading-time rehype-pretty-code rehype-slug
bun add -d @types/mdx
```

### Step 2: Create Blog Content Directory

```
content/
  blog/
    my-first-post.mdx
    building-with-nextjs.mdx
```

Each `.mdx` file uses frontmatter for metadata:

```mdx
---
title: "Building Scalable Apps with Next.js"
description: "A deep dive into server components, caching, and architecture patterns."
date: "2025-01-15"
tags: ["next.js", "react", "architecture"]
published: true
image: "/blog/nextjs-guide.webp"
---

# Building Scalable Apps with Next.js

Your markdown content goes here...

<CustomComponent prop="value" />
```

### Step 3: Create Blog Utilities

Create `lib/blog.ts` to read and parse MDX files:

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  image?: string;
  readingTime: string;
  content: string;
};

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const filePath = path.join(BLOG_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: filename.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags || [],
        published: data.published ?? true,
        image: data.image,
        readingTime: readingTime(content).text,
        content,
      };
    })
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}
```

### Step 4: Create Blog Pages

#### Blog Listing Page — `app/blog/page.tsx`

```tsx
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
```

#### Blog Post Page — `app/blog/[slug]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { LAYOUT } from "@/config/styles";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import { PatternDivider } from "@/components/ui/pattern-divider";
import { MDXRemote } from "next-mdx-remote/rsc";

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="flex [--pattern-fg:var(--color-gray-950)]/5 dark:bg-[#1E1E1E] dark:[--pattern-fg:var(--color-white)]/10">
      <PatternDivider position="left" />
      <div className={`${LAYOUT.container} dark:bg-[#1E1E1E]`}>
        <Navbar />
        <article className="prose prose-gray dark:prose-invert mx-auto max-w-3xl py-12">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
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
          </header>
          <MDXRemote source={post.content} />
        </article>
        <Footer />
      </div>
      <PatternDivider position="right" />
    </div>
  );
}
```

### Step 5: Add Blog Link to Navbar

Update `config/nav-links.ts` to include a blog link:

```ts
{ label: "Blog", href: "/blog" },
```

### Step 6: Add Blog Section to Homepage (Optional)

To show recent posts on the homepage, create a `components/blog/RecentPosts.tsx`:

```tsx
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
```

Then add it to `app/page.tsx`:

```tsx
<Section title="Recent Posts" id="blog">
  <RecentPosts />
</Section>
```

### Step 7: Add Prose Styles for Blog Content

Install the Tailwind typography plugin:

```bash
bun add @tailwindcss/typography
```

Add the import to `styles/globals.css`:

```css
@import "tailwindcss";
@import "@tailwindcss/typography";
```

### Step 8: SEO — Blog Sitemap

Update `app/sitemap.ts` to include blog posts:

```ts
import { getAllPosts } from "@/lib/blog";

// Inside your sitemap function, add:
const posts = getAllPosts();
const blogUrls = posts.map((post) => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: new Date(post.date),
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));
```

---

## Option 2: Headless CMS

If you prefer a UI-based editor or plan to have non-technical contributors, use a headless CMS.

### Recommended CMS Options

| CMS                                                | Free Tier          | Best For                   |
| -------------------------------------------------- | ------------------ | -------------------------- |
| [Contentlayer](https://contentlayer.dev)           | Open source        | MDX files with type safety |
| [Sanity](https://sanity.io)                        | Generous free tier | Rich content modeling      |
| [Notion API](https://developers.notion.com)        | Free               | If you already use Notion  |
| [Hashnode Headless](https://hashnode.com/headless) | Free               | Built-in blog platform     |

### Sanity Example Setup

```bash
bun add next-sanity @sanity/image-url
bunx sanity@latest init --env
```

Create `lib/sanity.ts`:

```ts
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function getPosts() {
  return client.fetch(
    `*[_type == "post" && published == true] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      description,
      publishedAt,
      body
    }`,
  );
}
```

### Notion API Example

```bash
bun add @notionhq/client notion-to-md
```

Create `lib/notion.ts`:

```ts
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getPosts() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return response.results;
}

export async function getPostContent(pageId: string) {
  const blocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(blocks).parent;
}
```

---

## Quick Start Checklist

- [ ] Choose your approach (MDX or Headless CMS)
- [ ] Install required dependencies
- [ ] Create content directory or configure CMS
- [ ] Create `lib/blog.ts` utility functions
- [ ] Create `app/blog/page.tsx` (listing page)
- [ ] Create `app/blog/[slug]/page.tsx` (post page)
- [ ] Add blog link to navbar (`config/nav-links.ts`)
- [ ] Add `@tailwindcss/typography` for prose styling
- [ ] Update sitemap to include blog posts
- [ ] (Optional) Add recent posts section to homepage
- [ ] (Optional) Add RSS feed at `app/feed.xml/route.ts`

---

## File Structure After Integration

```
app/
  blog/
    page.tsx              # Blog listing
    [slug]/
      page.tsx            # Individual post
content/
  blog/
    my-first-post.mdx     # Blog posts (MDX approach)
components/
  blog/
    RecentPosts.tsx       # Homepage recent posts widget
    BlogCard.tsx          # Reusable blog card component
lib/
  blog.ts                 # Blog utility functions
```
