"use client";

import { memo } from "react";
import { useResponsiveGraphSize } from "@/components/github-contributions/use-responsive";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { cn } from "@/lib/utils";
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
              totalCount: "{{count}} contributions in {{year}}",
              legend: {
                less: "Less",
                more: "More",
              },
            }}
          >
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

            <ContributionGraphFooter>
              <div className="flex w-full items-center justify-between">
                <ContributionGraphTotalCount />
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
