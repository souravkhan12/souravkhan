"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "motion/react";
import type { Heading } from "@/lib/blog";
import { MOTION } from "@/config/theme";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";

const RADIUS = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressRing({ progress }: { progress: number }) {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" className="-rotate-90">
      <circle
        cx={12}
        cy={12}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth={2}
      />
      <circle
        cx={12}
        cy={12}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
        className="text-white"
      />
    </svg>
  );
}

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
    <div
      ref={widgetRef}
      className={cn(
        "fixed z-20 flex flex-col items-stretch",
        "inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6",
        "xl:right-6 xl:left-auto xl:w-72",
      )}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: MOTION.duration.fast, ease: MOTION.ease }}
            className="mb-2 max-h-[60vh] overflow-y-auto rounded-2xl bg-neutral-900 p-2 shadow-xl"
          >
            <div className="font-pixel px-3 pt-2 pb-1.5 text-[11px] tracking-wide text-neutral-500 uppercase">
              Table of Contents
            </div>
            <div className="flex flex-col gap-0.5">
              {headings.map((heading) => {
                const isActive = heading.id === activeId;
                return (
                  <button
                    key={heading.id}
                    type="button"
                    onClick={() => scrollToHeading(heading.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors sm:py-2",
                      heading.depth === 3 && "pl-6 text-[13px]",
                      isActive
                        ? "bg-white/10 font-medium text-white"
                        : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200",
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

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={open}
        className="flex items-center gap-3 self-stretch rounded-2xl bg-neutral-900 px-4 py-3 text-left shadow-xl sm:self-auto sm:py-2.5 xl:w-full"
      >
        <span className="shrink-0 text-white">
          <ProgressRing progress={progress} />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
          {activeHeading?.text}
        </span>
        <span className="font-pixel shrink-0 text-xs text-neutral-500 tabular-nums">
          {Math.round(progress)}%
        </span>
      </motion.button>
    </div>
  );
}
