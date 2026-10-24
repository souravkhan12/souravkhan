"use client";

import { memo, useEffect, useRef } from "react";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { useResponsiveGraphSize } from "@/components/github-contributions/use-responsive";
import { cn } from "@/lib/utils";
import { Pill } from "../kibo-ui/pill";
import { Card } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

const LEVEL_COLORS = [
  'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
  'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
  'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
  'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
  'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]',
];

const LEVEL_BG_COLORS = [
  "bg-[#ebedf0] dark:bg-[#161b22]",
  "bg-[#9be9a8] dark:bg-[#0e4429]",
  "bg-[#40c463] dark:bg-[#006d32]",
  "bg-[#30a14e] dark:bg-[#26a641]",
  "bg-[#216e39] dark:bg-[#39d353]",
];

const GitHubContributionGraph = memo(
  ({ contributions }: { contributions: Activity[] }) => {
    const { blockSize, blockMargin, fontSize, ready } =
      useResponsiveGraphSize();

    if (!ready) {
      return <GitHubContributionFallback />;
    }

    return (
      <Card variant="default" className="w-full">
        <div className="relative w-full overflow-hidden px-2 pt-2">
          <div className="min-w-0 overflow-x-auto overflow-y-hidden">
            <ContributionGraph
              data={contributions}
              blockSize={blockSize}
              blockMargin={blockMargin}
              fontSize={fontSize}
              labels={{
                months: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                weekdays: ["", "Mon", "", "Wed", "", "Fri", ""],
                legend: { less: "Less", more: "More" },
              }}
            >
              {/* Calendar */}
              <ContributionGraphCalendar>
                {({ activity, dayIndex, weekIndex }) => (
                  <ContributionGraphBlock
                    activity={activity}
                    dayIndex={dayIndex}
                    weekIndex={weekIndex}
                    className={cn(
                      ...LEVEL_COLORS,
                      "hover:stroke-[#1f2328] dark:hover:stroke-[#c9d1d9]",
                      "hover:stroke-2",
                      "transition-all duration-200",
                    )}
                  />
                )}
              </ContributionGraphCalendar>

              {/* Footer */}
              <ContributionGraphFooter>
                <div className="mt-3 flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <ContributionGraphTotalCount>
                    {({ totalCount, year }) => (
                      <div className="flex items-center gap-2">
                        <span className="text-soft text-xs sm:text-sm">
                          {totalCount.toLocaleString() + " "} contributions in{" "}
                          {year} on GitHub.
                        </span>
                      </div>
                    )}
                  </ContributionGraphTotalCount>

                  <ContributionGraphLegend>
                    {({ level }) => (
                      <div className="group relative h-3 w-3 sm:h-4 sm:w-4">
                        <div
                          data-level={level}
                          className={cn(
                            "border-border h-full w-full border",
                            LEVEL_BG_COLORS[level],
                          )}
                        />
                        <span className="bg-popover absolute -top-8 hidden rounded px-2 py-1 text-xs shadow group-hover:block">
                          Level {level}
                        </span>
                      </div>
                    )}
                  </ContributionGraphLegend>
                </div>
              </ContributionGraphFooter>
            </ContributionGraph>
          </div>
        </div>
      </Card>
    );
  },
);

GitHubContributionGraph.displayName = "GitHubContributionGraph";
export default GitHubContributionGraph;

export function GitHubContributionFallback() {
  return (
    <Card variant="default" className="w-full">
      <div className="relative w-full overflow-hidden p-4 sm:p-6">
        <div className="h-40 w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </Card>
  );
}

/* Orange ramp for the homepage grid. Level 0 is a near-neutral so empty days
   read as structure rather than as a fifth shade of the accent. */
const MINIMAL_LEVEL_COLORS = [
  'data-[level="0"]:fill-[#f0f0ee] dark:data-[level="0"]:fill-[#232323]',
  'data-[level="1"]:fill-[#ffd9c7] dark:data-[level="1"]:fill-[#4a2414]',
  'data-[level="2"]:fill-[#ffab85] dark:data-[level="2"]:fill-[#8a3a17]',
  'data-[level="3"]:fill-[#ff7a45] dark:data-[level="3"]:fill-[#d4561f]',
  'data-[level="4"]:fill-[#e4521b] dark:data-[level="4"]:fill-[#ff7a45]',
];

/**
 * The homepage's bare grid: no card, legend or month labels. Fixed block
 * size so it fits the content column exactly on desktop; on a phone it
 * scrolls inside its own box and starts at the right end, because the most
 * recent weeks are the ones worth seeing.
 */
export function MinimalContributionGraph({
  contributions,
}: {
  contributions: Activity[];
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div
      ref={scroller}
      className="-mt-2 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none]"
    >
      <ContributionGraph
        data={contributions}
        blockSize={9}
        blockMargin={2}
        blockRadius={2}
        fontSize={0}
        className="w-max overflow-visible"
      >
        <ContributionGraphCalendar hideMonthLabels className="overflow-visible">
          {({ activity, dayIndex, weekIndex }) => (
            <ContributionGraphBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
              className={cn(...MINIMAL_LEVEL_COLORS)}
            />
          )}
        </ContributionGraphCalendar>
      </ContributionGraph>
    </div>
  );
}
