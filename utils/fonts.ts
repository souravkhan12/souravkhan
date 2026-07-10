import { Bitter, Plus_Jakarta_Sans } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import { GeistMono } from "geist/font/mono";

export const pixel = GeistPixelSquare;
export const mono = GeistMono;

export const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});
export const serif = Bitter({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});
