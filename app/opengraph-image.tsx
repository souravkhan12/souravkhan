import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { HERO } from "@/config/data";

export const alt = "Sourav Khan — Frontend Engineer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  // A JPEG copy, because Satori can't decode the site's WebP.
  const photo = await readFile(join(process.cwd(), "public/og/sourav.jpg"));

  return new ImageResponse(
    <OgCard
      eyebrow="frontend engineer"
      title={HERO.headline}
      meta={["React", "Next.js", "TypeScript"]}
      avatar={`data:image/jpeg;base64,${photo.toString("base64")}`}
    />,
    size,
  );
}
