"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/config/theme";
import { cn } from "@/lib/utils";

/**
 * A handwritten note in the page margin with a hand-drawn arrow pointing at
 * something — chanhdai.com's trick for teaching a visitor what's
 * interactive without a tooltip or a tour.
 *
 * The arrow draws itself once the note scrolls into view, then the text
 * fades in. Purely decorative: aria-hidden, pointer-events off, and only
 * rendered from `xl` up, where the margin is wide enough to hold it
 * without covering anything.
 *
 * Position it with `className` (absolute, relative to the thing it points
 * at). `point` is the direction the arrow travels.
 */
export function Annotation({
  children,
  point = "right",
  className,
}: {
  children: React.ReactNode;
  point?: "right" | "left";
  className?: string;
}) {
  const flip = point === "left";

  return (
    <motion.div
      aria-hidden="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      className={cn(
        // Centred on the target vertically: the arrow's tip sits at the
        // middle of its box, so `top-1/2 -translate-y-1/2` lands it level
        // with the middle of whatever it points at.
        "text-soft pointer-events-none absolute top-1/2 hidden -translate-y-1/2 items-center gap-1.5 select-none xl:flex",
        flip ? "flex-row-reverse" : "flex-row",
        className,
      )}
    >
      <motion.span
        variants={{
          hidden: { opacity: 0, x: flip ? 4 : -4 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 0.45, duration: 0.4, ease: EASE_OUT },
          },
        }}
        className={cn(
          "font-hand text-[21px] leading-[0.95] font-semibold whitespace-nowrap",
          flip ? "-rotate-2 text-left" : "rotate-[-3deg] text-right",
        )}
      >
        {children}
      </motion.span>

      {/* A shallow arc ending level with its start, with an open arrowhead
          drawn along the curve's final direction. */}
      <svg
        width="52"
        height="24"
        viewBox="0 0 52 24"
        fill="none"
        className={cn("shrink-0 overflow-visible", flip && "-scale-x-100")}
      >
        <motion.path
          d="M2 18 C 14 4, 32 4, 48 12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: { duration: 0.5, ease: EASE_OUT },
            },
          }}
        />
        <motion.path
          d="M42.6 6 L 48 12 L 40.4 14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delay: 0.42, duration: 0.15 },
            },
          }}
        />
      </svg>
    </motion.div>
  );
}
