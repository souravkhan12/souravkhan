import { ImageResponse } from "next/og";
import { OgCodeCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getAllQuestions, getQuestionById } from "@/lib/quiz";

export const alt = "A JavaScript puzzle — guess the output";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Pre-rendered alongside the pages, so a shared link never waits on generation.
export function generateStaticParams() {
  return getAllQuestions().map((q) => ({ id: q.id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = getQuestionById(id);

  return new ImageResponse(
    <OgCodeCard
      eyebrow="guess the output"
      // generateStaticParams only emits real ids; the fallback is belt-and-braces.
      snippet={question?.snippet ?? "// puzzle not found"}
      meta={["javascript", "sourav khan"]}
    />,
    size,
  );
}
