import { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { SEO_CONFIG } from "@/config/seo";
import { ACHIEVEMENTS, CONTACT_INFO, SOCIAL_LINKS } from "@/config/data";
import { hand, mono, pixel, sans } from "@/utils/fonts";
import Providers from "@/components/ui/provider";
import { ServiceWorker } from "@/components/ui/service-worker";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import CommandPalette from "@/components/command-palette/CommandPalette";
import BottomNav from "@/components/navbar/BottomNav";
import EasterEggs from "@/components/easter-eggs/EasterEggs";
import { getAllProjects } from "@/lib/projects";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Chrome paints the browser/status bar with this; matches the paper background.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#181818" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.title,
    template: "%s | Sourav Khan",
  },
  manifest: "/manifest.json",
  icons: {
    // One mark everywhere: these are all rendered from public/icon.svg, the
    // same drawing as the navbar's BrandMark.
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  description: SEO_CONFIG.description,
  authors: [
    {
      name: SEO_CONFIG.author,
      url: SEO_CONFIG.baseUrl,
    },
  ],
  creator: SEO_CONFIG.creator,
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  metadataBase: new URL(SEO_CONFIG.baseUrl),
  alternates: {
    canonical: SEO_CONFIG.canonical,
    types: {
      // Lets feed readers, daily.dev and aggregators auto-discover the blog.
      "application/rss+xml": [
        { url: `${SEO_CONFIG.baseUrl}/feed.xml`, title: "Sourav Khan — Blog" },
      ],
    },
  },
  openGraph: {
    type: SEO_CONFIG.ogType as "website",
    url: SEO_CONFIG.baseUrl,
    title: SEO_CONFIG.ogTitle,
    description: SEO_CONFIG.ogDescription,
    siteName: SEO_CONFIG.siteName,
    locale: SEO_CONFIG.ogLocale,
  },
  twitter: {
    card: SEO_CONFIG.twitterCardType as "summary_large_image",
    title: SEO_CONFIG.ogTitle,
    description: SEO_CONFIG.ogDescription,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: SEO_CONFIG.googleVerification || undefined,
    other: SEO_CONFIG.bingVerification
      ? { "msvalidate.01": SEO_CONFIG.bingVerification }
      : undefined,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SEO_CONFIG.shortTitle,
  },
  applicationName: SEO_CONFIG.siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projectLinks = getAllProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
  }));

  // Structured Data (JSON-LD) for SEO
  // Every public profile, so search engines can tie them to one person and
  // show them together in a knowledge panel. Profile links only — the AWS
  // certificate is a Drive file, not an identity.
  const profiles = ACHIEVEMENTS.map((a) => a.href).filter(
    (href) => !href.includes("drive.google.com"),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SEO_CONFIG.baseUrl}/#person`,
    name: "Sourav Khan",
    alternateName: "Sourav",
    url: SEO_CONFIG.baseUrl,
    jobTitle: "Frontend Engineer",
    description: SEO_CONFIG.description,
    image: `${SEO_CONFIG.baseUrl}/sourav.webp`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Noida",
      addressCountry: "IN",
    },
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github, ...profiles],
    knowsAbout: [
      "Software Engineering",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Redux Toolkit",
      "Frontend Engineering",
      "Web Performance",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "J.C. Bose University of Science and Technology",
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SEO_CONFIG.baseUrl}/#website`,
    url: SEO_CONFIG.baseUrl,
    name: SEO_CONFIG.siteName,
    inLanguage: "en",
    author: { "@id": `${SEO_CONFIG.baseUrl}/#person` },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        {/* Restore the saved accent before first paint so the swatch colours
            never flash orange on the way in. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var a=localStorage.getItem("accent");if(a&&a!=="orange")document.documentElement.setAttribute("data-accent",a)}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} ${pixel.variable} ${hand.variable} font-sans antialiased`}
      >
        <ScrollToTop />
        {/* Horizontal clip lives here, not on <html> or <body>: overflow set
            on either of those propagates to the viewport and leaves the
            element itself computing to `visible`, so it clips nothing. A
            plain wrapper is the only thing that actually contains the
            screen-line rules, which overhang the viewport by design. */}
        <div className="overflow-x-clip">
          <Providers>
            {children}
            <BottomNav />
            <CommandPalette projects={projectLinks} />
            <EasterEggs />
            <ServiceWorker />
            <InstallPrompt />
          </Providers>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
