import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import SnakeGame from "@/components/arcade/SnakeGame";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Snake",
  description:
    "A game of Snake with one global high score, shared by everyone who's played. No names, no sign-up.",
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/arcade/snake` },
};

export default function SnakePage() {
  return (
    <div className="pt-10 sm:pt-16">
      <Link
        href="/arcade"
        className="font-code text-faint hover:text-foreground group/back text-2xs inline-flex items-center gap-1.5 transition-colors"
      >
        <LuArrowLeft
          size={13}
          aria-hidden="true"
          className="transition-transform group-hover/back:-translate-x-0.5"
        />
        Arcade
      </Link>

      <SnakeGame />
    </div>
  );
}
