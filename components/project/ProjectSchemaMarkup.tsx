import { PROJECTS } from "@/config/data";

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
    image: `https://portfolio-souravkhan.vercel.app${project.image}`,
    url: project.link,
    creator: {
      "@type": "Person",
      name: "Sourav Khan",
      url: "https://portfolio-souravkhan.vercel.app",
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
