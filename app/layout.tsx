import { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { SEO_CONFIG } from "@/constants/seo";
import { mono, sans, serif } from "@/utils/fonts";

export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.title,
    template: "%s | Sourav Khan",
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
    creator: SEO_CONFIG.twitterCreator,
    site: SEO_CONFIG.twitterHandle,
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SchemaMarkup />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} ${serif.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
