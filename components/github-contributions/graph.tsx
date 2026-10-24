"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
} from "@/components/kibo-ui/contribution-graph";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { SPRING } from "@/config/theme";

const BLOCK = 9;
const GAP = 2;

type Tip = { count: number; date: string; x: number; y: number };

const fmtDay = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

/**
 * The homepage's bare grid: no card, no weekday labels.
 *
 * - Colours come from the accent (see .contrib in globals.css), so the grid
 *   follows the accent picker instead of being stuck on orange.
 * - One tooltip for the whole grid, driven by event delegation: hover (or
 *   tap) a day and it springs to that cell with the count and date.
 * - Columns ripple in left to right the first time the grid scrolls into
 *   view.
 *
 * On a phone it scrolls inside its own box and starts at the right end,
 * because the most recent weeks are the ones worth seeing.
 */
export function MinimalContributionGraph({
  contributions,
}: {
  contributions: Activity[];
}) {
  const frame = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: true, margin: "0px 0px -15% 0px" });
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  const show = (e: React.PointerEvent) => {
    const cell = e.target as Element;
    if (cell.tagName !== "rect" || !frame.current) return;
    const date = cell.getAttribute("data-date");
    if (!date) return;
    const r = cell.getBoundingClientRect();
    const f = frame.current.getBoundingClientRect();
    setTip({
      count: Number(cell.getAttribute("data-count") ?? 0),
      date,
      x: r.left - f.left + r.width / 2,
      y: r.top - f.top,
    });
  };

  return (
    <div ref={frame} className="relative">
      <div
        ref={scroller}
        onPointerMove={show}
        onPointerDown={show}
        onPointerLeave={() => setTip(null)}
        onScroll={() => setTip(null)}
        data-play={inView ? "" : undefined}
        className="contrib overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:none]"
      >
        <ContributionGraph
          data={contributions}
          blockSize={BLOCK}
          blockMargin={GAP}
          blockRadius={2.5}
          fontSize={11}
          className="text-faint font-code w-max overflow-visible"
        >
          <ContributionGraphCalendar className="overflow-visible">
            {({ activity, dayIndex, weekIndex }) => (
              <ContributionGraphBlock
                activity={activity}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
                style={{ "--w": weekIndex } as React.CSSProperties}
              />
            )}
          </ContributionGraphCalendar>
        </ContributionGraph>
      </div>

      {/* Legend — the scale, not a list of levels. */}
      <div className="font-code text-faint text-2xs mt-3 flex items-center justify-end gap-1.5">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <svg key={level} width={BLOCK} height={BLOCK} aria-hidden="true">
            <rect
              className="contrib-swatch"
              data-level={level}
              width={BLOCK}
              height={BLOCK}
              rx={2.5}
            />
          </svg>
        ))}
        <span>More</span>
      </div>

      <AnimatePresence>
        {tip && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, scale: 0.96, left: tip.x, top: tip.y }}
            animate={{ opacity: 1, scale: 1, left: tip.x, top: tip.y }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={SPRING.snappy}
            className="bg-foreground text-background pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg"
          >
            <span className="font-semibold tabular-nums">
              {tip.count === 0
                ? "No contributions"
                : `${tip.count} contribution${tip.count === 1 ? "" : "s"}`}
            </span>
            <span className="opacity-60"> · {fmtDay(tip.date)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
