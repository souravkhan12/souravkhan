import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";

export const mono = GeistMono;

// Variable axis so paper.design's weight ladder (270/360/480/550/670) resolves.
export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  axes: ["opsz"],
});
