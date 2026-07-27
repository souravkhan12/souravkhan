import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Sourav Khan — Software Engineer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="software engineer"
      title="Building sleek, scalable web experiences."
      meta={["React", "Next.js", "TypeScript"]}
    />,
    size,
  );
}
