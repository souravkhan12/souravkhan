import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import WorkExperience from "@/components/work/WorkExperience";
import Projects from "@/components/project/Projects";
import Contact from "@/components/contact/Contact";
import { PatternDivider } from "@/components/ui/pattern-divider";
import { ProjectSchemaMarkup } from "@/components/project/ProjectSchemaMarkup";
import { LAYOUT } from "@/config/styles";
import { Section } from "@/components/ui";
import { GitHubContributions } from "@/components/github-contributions/github-section";
import Footer from "@/components/footer/footer";
import HeroTechStack from "@/components/hero/HeroTechStack";

export default function Page() {
  return (
    <>
      <ProjectSchemaMarkup />
      <div className="flex [--pattern-fg:var(--color-gray-950)]/5 dark:bg-[#1E1E1E] dark:[--pattern-fg:var(--color-white)]/10">
        <PatternDivider position="left" />

        <div className={`${LAYOUT.container} dark:bg-[#1E1E1E]`}>
          <Navbar />
          <Hero />
          <Section title="Tech Stack">
            <HeroTechStack />
          </Section>
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
          <Footer />
        </div>

        <PatternDivider position="right" />
      </div>
    </>
  );
}
