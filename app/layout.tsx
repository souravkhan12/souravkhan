import { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { SEO_CONFIG } from "@/config/seo";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/config/data";
import { mono, sans } from "@/utils/fonts";
import Providers from "@/components/ui/provider";
import { ServiceWorker } from "@/components/ui/service-worker";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import CommandPalette from "@/components/command-palette/CommandPalette";
import EasterEggs from "@/components/easter-eggs/EasterEggs";
import { getAllProjects } from "@/lib/projects";

// Chrome paints the browser/status bar with this; matches the paper background.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcf9" },
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
    icon: [
      { url: "/favicon.ico" },
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
  keywords: SEO_CONFIG.keywords,
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
  metadataBase: new URL(SEO_CONFIG.baseUrl),
  alternates: {
    canonical: SEO_CONFIG.canonical,
  },
  openGraph: {
    type: SEO_CONFIG.ogType as "website",
    url: SEO_CONFIG.baseUrl,
    title: SEO_CONFIG.ogTitle,
    description: SEO_CONFIG.ogDescription,
    siteName: SEO_CONFIG.siteName,
    locale: SEO_CONFIG.ogLocale,
    images: [
      {
        url: SEO_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "Sourav Khan Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: SEO_CONFIG.twitterCardType as "summary_large_image",
    title: SEO_CONFIG.ogTitle,
    description: SEO_CONFIG.ogDescription,
    images: [SEO_CONFIG.ogImage],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sourav Khan",
    alternateName: "Sourav",
    url: SEO_CONFIG.baseUrl,
    jobTitle: "Software Engineer",
    description: SEO_CONFIG.description,
    image: `${SEO_CONFIG.baseUrl}/sourav.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ambala",
      addressCountry: "IN",
    },
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github],
    knowsAbout: [
      "Software Engineering",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="7M2IRTHlc59zkkjF36MIfj5bhCWGfDIwUUawU1wB7hI"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Restore the saved accent before first paint so the swatch colours
            never flash indigo on the way in. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var a=localStorage.getItem("accent");if(a&&a!=="indigo")document.documentElement.setAttribute("data-accent",a)}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} font-sans antialiased`}
      >
        <ScrollToTop />
        <Providers>
          {children}
          <CommandPalette projects={projectLinks} />
          <EasterEggs />
          <ServiceWorker />
          <InstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
