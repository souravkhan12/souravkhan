"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuList } from "react-icons/lu";
import type { Heading } from "@/lib/blog";
import { MOTION } from "@/config/theme";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useReadingProgress } from "@/hooks/use-reading-progress";

export function BlogProgress({ headings }: { headings: Heading[] }) {
  const { progress, activeId, scrollToHeading } = useReadingProgress(headings);
  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useOutsideClick({ ref: widgetRef, callback: () => setOpen(false) });

  const goTo = (id: string) => {
    scrollToHeading(id);
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
          // lg:hidden — from lg up the sticky sidebar rail is on screen and
          // two tables of contents competing for attention is one too many.
          "fixed z-20 flex flex-col items-end lg:hidden",
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
              <div className="border-border font-code text-2xs text-soft border-b bg-gray-50 px-3 py-2.5 lowercase dark:bg-black">
                on this page
              </div>
              <div className="flex flex-col">
                {headings.map((heading) => {
                  const isActive = heading.id === activeId;
                  return (
                    <button
                      key={heading.id}
                      type="button"
                      onClick={() => goTo(heading.id)}
                      className={cn(
                        "normal-case-force border-l-2 px-3 py-2.5 text-left text-sm transition-colors sm:py-2",
                        heading.depth === 3 && "text-2xs pl-6",
                        isActive
                          ? "border-blue text-blue bg-gray-50 font-medium dark:bg-black"
                          : "hover:text-foreground text-soft border-transparent hover:bg-gray-50 dark:hover:bg-black",
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
          <span className="font-code text-soft shrink-0 text-xs tabular-nums">
            {Math.round(progress)}%
          </span>
        </button>
      </div>
    </>
  );
}
