"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import type { Heading } from "@/lib/blog";
import { MOTION } from "@/config/theme";

/**
 * Scroll position of a post, expressed two ways: how far through it you are,
 * and which heading you're currently under.
 *
 * Extracted so the floating widget (mobile) and the sticky sidebar (desktop)
 * read from one implementation — two copies of this drifted apart on the
 * offset used to decide the active heading, so the two TOCs could disagree
 * about where you were on the same page.
 */
export function useReadingProgress(headings: Heading[]) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    articleRef.current = document.getElementById("blog-post-content");

    let ticking = false;

    const measure = () => {
      ticking = false;
      const article = articleRef.current;
      if (!article) return;

      const { top, height } = article.getBoundingClientRect();
      const scrolled = -top;
      const scrollable = height - window.innerHeight;
      const pct = Math.min(
        100,
        Math.max(0, (scrolled / Math.max(scrollable, 1)) * 100),
      );
      setProgress(pct);

      let current: string | null = headings[0]?.id ?? null;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = heading.id;
        }
      }
      setActiveId(current);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [headings]);

  /** Animated rather than native smooth scrolling: Lenis owns the scroll. */
  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const targetY = el.getBoundingClientRect().top + window.scrollY - 96;

    animate(window.scrollY, targetY, {
      duration: MOTION.duration.slow * 2,
      ease: MOTION.ease,
      onUpdate: (v) => window.scrollTo(0, v),
    });
  }, []);

  return { progress, activeId, scrollToHeading };
}
