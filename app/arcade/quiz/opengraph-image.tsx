import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "Guess the Output — a daily JavaScript puzzle";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="arcade"
      title="Guess the output. One snippet a day."
      meta={["javascript", "new every day"]}
    />,
    size,
  );
}
