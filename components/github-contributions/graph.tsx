"use client";

import { memo } from "react";
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
import { LoaderIcon } from "lucide-react";

const GitHubContributionGraph = memo(
  ({ contributions }: { contributions: Activity[] }) => {
    const { blockSize, blockMargin, fontSize } = useResponsiveGraphSize();

    return (
      <div className="relative w-full max-w-full overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden">
          <ContributionGraph
            data={contributions}
            blockSize={blockSize}
            blockMargin={blockMargin}
            fontSize={fontSize}
            className="min-w-max"
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
                    'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
                    'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                    'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                    'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                    'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]',
                    "hover:stroke-[#1f2328] dark:hover:stroke-[#c9d1d9]",
                    "hover:stroke-2",
                  )}
                />
              )}
            </ContributionGraphCalendar>

            {/* Footer */}
            <ContributionGraphFooter>
              <div className="flex w-full items-center justify-between gap-4">
                <ContributionGraphTotalCount>
                  {({ totalCount, year }) => (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        Year {year}:
                      </span>
                      <Pill variant="secondary">
                        {totalCount.toLocaleString()} contributions
                      </Pill>
                    </div>
                  )}
                </ContributionGraphTotalCount>

                <ContributionGraphLegend>
                  {({ level }) => (
                    <div className="group relative h-3 w-3">
                      <div
                        data-level={level}
                        className={cn(
                          "border-border h-full w-full rounded-sm border",
                          level === 0 && "bg-muted",
                          level === 1 && "bg-emerald-200 dark:bg-emerald-900",
                          level === 2 && "bg-emerald-400 dark:bg-emerald-700",
                          level === 3 && "bg-emerald-600 dark:bg-emerald-500",
                          level === 4 && "bg-emerald-800 dark:bg-emerald-300",
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
    );
  },
);

GitHubContributionGraph.displayName = "GitHubContributionGraph";
export default GitHubContributionGraph;

export function GitHubContributionFallback() {
  return (
    <div className="flex h-40.5 w-full items-center justify-center">
      <LoaderIcon className="text-muted-foreground animate-spin" />
    </div>
  );
}
