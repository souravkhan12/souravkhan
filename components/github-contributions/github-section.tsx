import { Suspense } from "react";
import { getGitHubContributions } from "@/components/github-contributions/data/github-contributions";
import GitHubContributionGraph, {
  GitHubContributionFallback,
} from "@/components/github-contributions/graph";

export async function GitHubContributions() {
  const contributions = await getGitHubContributions();

  // Handle empty data gracefully
  if (!contributions || contributions.length === 0) {
    return (
      <div className="text-muted-foreground flex h-40.5 w-full items-center justify-center">
        <p>GitHub contributions temporarily unavailable</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>
    </div>
  );
}
