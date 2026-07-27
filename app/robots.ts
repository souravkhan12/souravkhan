import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/offline"],
    },
    sitemap: `${SEO_CONFIG.baseUrl}/sitemap.xml`,
    host: SEO_CONFIG.baseUrl,
  };
}
