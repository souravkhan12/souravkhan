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
import { RecentPosts } from "@/components/blog/recent-posts";
import Setup from "@/components/setup/Setup";

export default function Page() {
  return (
    <>
      <ProjectSchemaMarkup />
      <div className="bg-background flex [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10">
        <PatternDivider position="left" />
        <div className={`${LAYOUT.container} bg-background`}>
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

          <Section title="Recent Posts" id="blog">
            <RecentPosts />
          </Section>

          <Setup />
          <Contact />
          <Footer />
        </div>
        <PatternDivider position="right" />
      </div>
    </>
  );
}
