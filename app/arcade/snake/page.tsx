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
    <div className="pt-8">
      <div className="px-6 pb-4 sm:px-8">
        <Link
          href="/arcade"
          className="hover:text-blue font-code text-soft inline-flex items-center gap-1.5 text-xs lowercase transition-colors"
        >
          <LuArrowLeft size={13} aria-hidden="true" />
          arcade
        </Link>
      </div>

      <SnakeGame />
    </div>
  );
}
