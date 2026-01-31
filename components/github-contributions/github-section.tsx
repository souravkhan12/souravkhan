import { Suspense } from "react";
import { getGitHubContributions } from "@/components/github-contributions/data/github-contributions";
import GitHubContributionGraph, {
  GitHubContributionFallback,
} from "@/components/github-contributions/graph";

export async function GitHubContributions() {
  const contributions = await getGitHubContributions();

  return (
    <>
      <h2 className="sr-only">GitHub Contributions</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>
    </>
  );
}
