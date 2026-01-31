import { Bitter, Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";

export const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});
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
