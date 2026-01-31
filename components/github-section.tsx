"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useBreakpoint } from "@/hooks/use-breakpoint";

export const GithubSection = () => {
  const width = useBreakpoint();

  const blockSize =
    width < 640
      ? 10 // mobile
      : width < 1024
        ? 14 // tablet
        : 16; // desktop

  return (
    <GitHubCalendar
      username="souravkhan12"
      blockSize={blockSize}
      blockMargin={3}
      fontSize={12}
    />
  );
};
