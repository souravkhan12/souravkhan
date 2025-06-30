import { Inter } from "next/font/google";
import "./globals.css";
import { DarkModeProvider } from "./context/useDarkMode";

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
    site_name: ["Sourav Khan Portfolio", "sourav khan", "Sourav khan", "khan", "Sourav"]
  },
  twitter: {
    handle: "@souravkhan654",
    site: "@souravkhan654",
    cardType: "summary_large_image",
  },
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
      </head>
      <body className={`${inter.variable} antialiased`}>
        <DarkModeProvider>
          <div>{children}</div>
        </DarkModeProvider>
      </body>
    </html>
  );
}
