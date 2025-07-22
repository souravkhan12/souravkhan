import { Inter } from "next/font/google";
import "./globals.css";
import { DarkModeProvider } from "./context/useDarkMode";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Sourav Khan | Software Engineer",
  description:
    "Hi, I'm Sourav Khan — a goal-driven Software Engineer building sleek, scalable, modern web experiences with React, Next.js, and C++.",
  canonical: "https://portfolio-souravkhan.vercel.app/",
  openGraph: {
    url: "https://portfolio-souravkhan.vercel.app/",
    title: "Sourav Khan | Software Engineer",
    description:
      "Goal-driven software engineer delivering modern, performant React and NextJS applications.",
    images: [
      {
        url: "https://portfolio-souravkhan.vercel.app/preview.png",
        width: 1200,
        height: 630,
        alt: "Portfolio preview image",
      },
    ],
    site_name: [
      "Sourav Khan Portfolio",
      "sourav khan",
      "Sourav khan",
      "khan",
      "Sourav",
    ],
  },
  twitter: {
    handle: "@souravkhan654",
    site: "@souravkhan654",
    cardType: "summary_large_image",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sourav",
  alternateName: "Sourav Khan",
  url: "https://portfolio-souravkhan.vercel.app/",
  sameAs: [
    "https://linkedin.com/in/souravkhan1",
    "https://github.com/souravkhan12",
  ],
  jobTitle: "Software Engineer",
  description:
    "Sourav is a goal-driven Software Engineer building sleek, scalable, modern web experiences using React, Next.js, and C++",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="7M2IRTHlc59zkkjF36MIfj5bhCWGfDIwUUawU1wB7hI"
        />
        <meta name="robots" content="all" />
        <meta name="description" content={metadata.description} />
        <meta
          name="keywords"
          content="Sourav, Software Engineer, Developer, React, Next.js, Portfolio"
        />
        {/* Explicitly set title */}
        <title>Sourav | Software Engineer, Developer, Portfolio</title>
        {/* Canonical link */}
        <link rel="canonical" href={metadata.canonical} />
        {/* OpenGraph & Twitter tags - you can add more as needed */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content="Sourav Portfolio" />
        <meta name="twitter:card" content={metadata.twitter.cardType} />
        <meta name="twitter:creator" content={metadata.twitter.handle} />
        {/* Add JSON-LD structured data */}
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <DarkModeProvider>
          <div>{children}</div>
        </DarkModeProvider>
      </body>
    </html>
  );
}
