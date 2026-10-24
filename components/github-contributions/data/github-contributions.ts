import { unstable_cache } from "next/cache";

import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { GITHUB_USERNAME } from "@/config/data";

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

/** Public repo count for the homepage stat line. `null` hides the stat. */
export const getGitHubRepoCount = unstable_cache(
  async (): Promise<number | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}`,
        {
          signal: controller.signal,
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 86400 },
        },
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch GitHub profile: ${res.status}`);
      }

      const data = (await res.json()) as { public_repos?: number };
      return typeof data.public_repos === "number" ? data.public_repos : null;
    } catch (error) {
      console.error("Error fetching GitHub repo count:", error);
      return null;
    }
  },
  ["github-repo-count"],
  { revalidate: 86400 },
);
