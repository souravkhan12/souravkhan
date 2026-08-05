import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";

export const mono = GeistMono;

/* Display face, loaded for the wordmark only. Geist Pixel ships five variants
   (Square/Grid/Circle/Triangle/Line) that differ in the shape each "pixel" is
   drawn as; Square is the solid one and the only one that stays legible at
   name-sized type — the others turn into texture. */
export const pixel = GeistPixelSquare;

// Variable axis so paper.design's weight ladder (270/360/480/550/670) resolves.
export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  axes: ["opsz"],
});
