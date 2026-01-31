import { unstable_cache } from "next/cache";

import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { GITHUB_USERNAME } from "@/constants/data";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export const getGitHubContributions = unstable_cache(
  async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
        {
          signal: controller.signal,
          next: { revalidate: 86400 }, // Cache for 1 day
        },
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch GitHub contributions: ${res.status}`);
      }

      const data = (await res.json()) as GitHubContributionsResponse;
      return data.contributions;
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      // Return empty array as fallback
      return [];
    }
  },
  ["github-contributions"],
  { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
);
