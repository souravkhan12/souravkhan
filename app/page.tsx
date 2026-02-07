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
      <div className="dark:bg-background flex [--pattern-fg:var(--foreground)]/5 dark:[--pattern-fg:var(--foreground)]/10">
        <PatternDivider position="left" />

        <div className={`${LAYOUT.container} dark:bg-background`}>
          <Navbar />
          <Hero />
          <Section title="Tech Stack" spacing="compact">
            <HeroTechStack />
          </Section>
          <WorkExperience />
          <Projects />
          <Section
            title="GitHub Contributions"
            id="github"
            className="mx-auto flex"
            spacing="compact"
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
