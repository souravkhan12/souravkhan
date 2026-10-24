import {
  getGitHubContributions,
  getGitHubRepoCount,
} from "@/components/github-contributions/data/github-contributions";
import { MinimalContributionGraph } from "@/components/github-contributions/graph";
import { HomeSection } from "@/components/home/HomeSection";
import { SOCIAL_LINKS } from "@/config/data";

export async function GitHubActivity() {
  const [contributions, repos] = await Promise.all([
    getGitHubContributions(),
    getGitHubRepoCount(),
  ]);

  // Both requests failing leaves nothing worth a heading.
  if (contributions.length === 0 && repos === null) return null;

  const total = contributions.reduce((sum, day) => sum + day.count, 0);

  return (
    <HomeSection id="github" label="GitHub">
      <a
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-soft hover:text-foreground flex flex-wrap gap-x-7 gap-y-1 text-sm transition-colors"
      >
        {contributions.length > 0 && (
          <span>
            <strong className="text-foreground font-bold tabular-nums">
              {total.toLocaleString()}
            </strong>{" "}
            contributions in the last year
          </span>
        )}
        {repos !== null && (
          <span>
            <strong className="text-foreground font-bold tabular-nums">
              {repos}
            </strong>{" "}
            repositories
          </span>
        )}
      </a>

      {contributions.length > 0 && (
        <div className="mt-5">
          <MinimalContributionGraph contributions={contributions} />
        </div>
      )}
    </HomeSection>
  );
}
