import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Snake — one global high score";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="arcade"
      title="One number to beat. Just Snake."
      meta={["global high score", "no sign-up"]}
    />,
    size,
  );
}
