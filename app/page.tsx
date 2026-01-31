import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import WorkExperience from "@/components/WorkExperience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { PatternDivider } from "@/components/PatternDivider";
import { ProjectSchemaMarkup } from "@/components/ProjectSchemaMarkup";
import { LAYOUT } from "@/constants/styles";
import { Section } from "@/components/ui";
import { GitHubContributions } from "@/components/github-contributions/github-section";

export default function Page() {
  return (
    <>
      <ProjectSchemaMarkup />
      <div className="flex overflow-x-hidden [--pattern-fg:var(--color-gray-950)]/5 dark:bg-[#1E1E1E] dark:[--pattern-fg:var(--color-white)]/10">
        <PatternDivider position="left" />

        <div className={`${LAYOUT.container} dark:bg-[#1E1E1E]`}>
          <Navbar />
          <Hero />
          <WorkExperience />
          <Projects />
          <Section
            title="GitHub Contributions"
            id="github"
            className="mx-auto flex"
          >
            <GitHubContributions />
          </Section>
          <Contact />
        </div>

        <PatternDivider position="right" />
      </div>
    </>
  );
}
