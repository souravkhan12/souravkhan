import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/config/seo";
import { getPublishedPosts, getAllTags } from "@/lib/blog";
import { getAllProjects } from "@/lib/projects";
import { getAllSetupGuides } from "@/lib/setup";
import { getAllQuestions } from "@/lib/quiz";
import {
  getAllMachineCodingQuestions,
  getMachineCodingCategories,
} from "@/lib/machine-coding";
import { FLAVORS, getAllPatterns } from "@/lib/patterns";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.baseUrl;
  const posts = getPublishedPosts();

  const latestPost = posts[0]?.updated ?? posts[0]?.date;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPost ? new Date(latestPost) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reading`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/arcade`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/arcade/quiz`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/arcade/snake`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getAllTags().map((tag) => ({
      url: `${baseUrl}/blog/tags/${tag.slug}`,
      lastModified: latestPost ? new Date(latestPost) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...getAllProjects().map((project) => ({
      url: `${baseUrl}/project/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/setup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...getAllSetupGuides().map((guide) => ({
      url: `${baseUrl}/setup/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    /* Puzzle permalinks. These are static and each one targets a long-tail
       query, so they get a higher priority than the daily page they came
       from — the daily page's content changes out from under any ranking. */
    ...getAllQuestions().map((q) => ({
      url: `${baseUrl}/arcade/quiz/${q.id}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/machine-coding`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...getMachineCodingCategories().map((c) => ({
      url: `${baseUrl}/machine-coding/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...getAllMachineCodingQuestions().map((q) => ({
      url: `${baseUrl}/machine-coding/${q.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    /* One index per flavour. /patterns itself is a redirect, so it's left out
       — listing a URL that 308s only spends crawl budget to arrive here. */
    ...FLAVORS.map((f) => ({
      url: `${baseUrl}/patterns/${f.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllPatterns().map((p) => ({
      url: `${baseUrl}${p.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
