import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Arcade — a daily JavaScript puzzle and a game of Snake";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="arcade"
      title="A daily JavaScript puzzle. And a game of Snake."
      meta={["guess the output", "new every day"]}
    />,
    size,
  );
}
