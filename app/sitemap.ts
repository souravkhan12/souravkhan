import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/config/seo";
import { getPublishedPosts, getAllTags } from "@/lib/blog";
import { getAllProjects } from "@/lib/projects";
import { getAllSetupGuides } from "@/lib/setup";

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
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/arcade`,
      lastModified: new Date(),
      changeFrequency: "daily",
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
    ...getAllSetupGuides().map((guide) => ({
      url: `${baseUrl}/setup/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
