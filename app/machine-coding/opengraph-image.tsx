import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getAllMachineCodingQuestions } from "@/lib/machine-coding";

export const alt = "Frontend machine coding questions, worked through";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const total = getAllMachineCodingQuestions().length;

  return new ImageResponse(
    <OgCard
      eyebrow="machine coding"
      title="Frontend interview questions, worked through."
      meta={[`${total} questions`, "react · javascript"]}
    />,
    size,
  );
}
