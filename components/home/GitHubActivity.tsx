import {
  getGitHubContributions,
  getGitHubRepoCount,
} from "@/components/github-contributions/data/github-contributions";
import { MinimalContributionGraph } from "@/components/github-contributions/graph";
import { HomeSection } from "@/components/home/HomeSection";
import { SOCIAL_LINKS } from "@/config/data";
import { CountUp } from "@/components/motion/count-up";

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
            <CountUp
              value={total.toLocaleString("en-US")}
              className="text-foreground font-bold tabular-nums"
            />{" "}
            contributions in the last year
          </span>
        )}
        {repos !== null && (
          <span>
            <CountUp
              value={String(repos)}
              className="text-foreground font-bold tabular-nums"
            />{" "}
            repositories
          </span>
        )}
      </a>

      {contributions.length > 0 && (
        <div className="mt-4">
          <MinimalContributionGraph contributions={contributions} />
        </div>
      )}
    </HomeSection>
  );
}
