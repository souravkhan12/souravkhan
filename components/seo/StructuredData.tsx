import { SEO_CONFIG } from "@/config/seo";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/config/data";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sourav Khan",
    alternateName: "Sourav",
    url: SEO_CONFIG.baseUrl,
    jobTitle: "Full Stack Software Engineer",
    description: SEO_CONFIG.description,
    image: `${SEO_CONFIG.baseUrl}/sourav.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ambala",
      addressCountry: "IN",
    },
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github, SOCIAL_LINKS.twitter],
    knowsAbout: [
      "Software Engineering",
      "Full Stack Development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "C++",
      "Web Development",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "Software Engineer",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
