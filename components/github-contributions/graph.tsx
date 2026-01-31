"use client";

import { memo } from "react";
import { useResponsiveGraphSize } from "@/components/github-contributions/use-responsive";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
} from "@/components/kibo-ui/contribution-graph";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

const GitHubContributionGraph = memo(
  ({ contributions }: { contributions: Activity[] }) => {
    const { blockSize, blockMargin, fontSize } = useResponsiveGraphSize();

    return (
      <div className="relative -mx-4 w-full overflow-x-auto px-4">
        <ContributionGraph
          data={contributions}
          blockSize={blockSize}
          blockMargin={blockMargin}
          fontSize={fontSize}
          className="min-w-max"
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
                )}
              />
            )}
          </ContributionGraphCalendar>

          <ContributionGraphFooter />
        </ContributionGraph>
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
