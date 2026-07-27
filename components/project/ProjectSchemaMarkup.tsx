import { PROJECTS } from "@/config/data";
import { SEO_CONFIG } from "@/config/seo";

/**
 * Project Schema Markup
 * Provides structured data for each project
 */
export function ProjectSchemaMarkup() {
  const projectSchemas = PROJECTS.map((project) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: `${SEO_CONFIG.baseUrl}${project.image}`,
    url: project.link,
    creator: {
      "@type": "Person",
      name: SEO_CONFIG.author,
      url: SEO_CONFIG.baseUrl,
    },
    datePublished: new Date().toISOString().split("T")[0],
    inLanguage: "en-US",
    isAccessibleForFree: true,
  }));

  return (
    <>
      {projectSchemas.map((schema, index) => (
        <script
          key={`project-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
