"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuList } from "react-icons/lu";
import type { Heading } from "@/lib/blog";
import { SPRING } from "@/config/theme";
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
          // wide:hidden — from `wide` up the contents rail is on screen and
          // two tables of contents competing for attention is one too many.
          // bottom-24 clears the floating mobile dock.
          "wide:hidden fixed z-20 flex flex-col items-end",
          "right-4 bottom-24 sm:right-6 md:bottom-6",
        )}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={SPRING.smooth}
              style={{ transformOrigin: "bottom right" }}
              data-lenis-prevent
              className="bg-background/95 shadow-soft mb-2 max-h-[60vh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl p-1.5 backdrop-blur-xl"
            >
              <div className="font-code text-2xs text-faint px-3 pt-2 pb-1.5">
                On this page
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
                        "rounded-xl px-3 py-2.5 text-left text-sm transition-colors sm:py-2",
                        heading.depth === 3 && "text-2xs pl-6",
                        isActive
                          ? "bg-surface text-foreground font-medium"
                          : "hover:text-foreground text-soft hover:bg-surface",
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
          aria-expanded={open}
          aria-label="Table of contents"
          whileTap={{ scale: 0.95 }}
          transition={SPRING.snappy}
          className="bg-background/90 shadow-soft hover:text-foreground text-soft flex h-11 items-center gap-2.5 rounded-full px-4 text-left backdrop-blur-xl transition-colors"
        >
          <LuList size={15} aria-hidden="true" className="shrink-0" />
          <span className="hidden max-w-[14rem] min-w-0 truncate text-sm sm:block">
            {activeHeading?.text}
          </span>
          <span className="font-code text-soft shrink-0 text-xs tabular-nums">
            {Math.round(progress)}%
          </span>
        </motion.button>
      </div>
    </>
  );
}
