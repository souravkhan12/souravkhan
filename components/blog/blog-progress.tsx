"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "motion/react";
import { LuList } from "react-icons/lu";
import type { Heading } from "@/lib/blog";
import { MOTION } from "@/config/theme";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";

export function BlogProgress({ headings }: { headings: Heading[] }) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );
  const [open, setOpen] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useOutsideClick({ ref: widgetRef, callback: () => setOpen(false) });

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

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const targetY = el.getBoundingClientRect().top + window.scrollY - 96;

    animate(window.scrollY, targetY, {
      duration: MOTION.duration.slow * 2,
      ease: MOTION.ease,
      onUpdate: (v) => window.scrollTo(0, v),
    });
    setOpen(false);
  };

  if (headings.length === 0) return null;

  const activeHeading = headings.find((h) => h.id === activeId) ?? headings[0];

  return (
    <>
      {/* A hairline rule that fills as you read. The old floating ring was the
          only rounded, hard-coded-dark element on the site; this reads as part
          of the page frame in both themes and costs no reading space. */}
      <div
        aria-hidden="true"
        className="bg-border/60 fixed inset-x-0 top-0 z-30 h-[2px]"
      >
        <div
          className="bg-blue h-full origin-left"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      <div
        ref={widgetRef}
        className={cn(
          "fixed z-20 flex flex-col items-end",
          "right-4 bottom-20 sm:right-6 sm:bottom-6",
        )}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: MOTION.duration.fast, ease: MOTION.ease }}
              data-lenis-prevent
              className="border-border bg-background mb-px max-h-[60vh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto border shadow-lg"
            >
              <div className="border-border font-code border-b bg-gray-50 px-3 py-2.5 text-[11px] text-gray-500 lowercase dark:bg-black">
                on this page
              </div>
              <div className="flex flex-col">
                {headings.map((heading) => {
                  const isActive = heading.id === activeId;
                  return (
                    <button
                      key={heading.id}
                      type="button"
                      onClick={() => scrollToHeading(heading.id)}
                      className={cn(
                        "normal-case-force border-l-2 px-3 py-2.5 text-left text-sm transition-colors sm:py-2",
                        heading.depth === 3 && "pl-6 text-[13px]",
                        isActive
                          ? "border-blue text-blue bg-gray-50 font-medium dark:bg-black"
                          : "hover:text-foreground border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-black",
                      )}
                    >
                      {heading.text}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Table of contents"
          className="border-border bg-background hover:border-blue hover:text-blue flex items-center gap-2.5 border px-3 py-2 text-left shadow-lg transition-colors"
        >
          <LuList size={15} aria-hidden="true" className="shrink-0" />
          <span className="normal-case-force hidden max-w-[14rem] min-w-0 truncate text-sm sm:block">
            {activeHeading?.text}
          </span>
          <span className="font-code shrink-0 text-xs text-gray-500 tabular-nums">
            {Math.round(progress)}%
          </span>
        </button>
      </div>
    </>
  );
}
