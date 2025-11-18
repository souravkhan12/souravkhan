import { SEO_CONFIG } from "@/constants/seo";

/**
 * Schema.org JSON-LD markup component
 * Provides structured data for search engines
 */
export function SchemaMarkup() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sourav Khan",
    url: SEO_CONFIG.baseUrl,
    image: `${SEO_CONFIG.baseUrl}/sourav.png`,
    jobTitle: "Full Stack Software Engineer",
    location: {
      "@type": "Place",
      name: "Ambala, India",
    },
    email: "souravkhan654@gmail.com",
    telephone: "+91 8814028649",
    sameAs: [
      SEO_CONFIG.socialProfiles.linkedin,
      SEO_CONFIG.socialProfiles.github,
      SEO_CONFIG.socialProfiles.twitter,
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    description: SEO_CONFIG.description,
    creator: {
      "@type": "Person",
      name: "Sourav Khan",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
