import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import WorkExperience from "@/components/work/WorkExperience";
import Projects from "@/components/project/Projects";
import Contact from "@/components/contact/Contact";
import { ProjectSchemaMarkup } from "@/components/project/ProjectSchemaMarkup";
import { Section, GridBand, GridCell } from "@/components/ui";
import { GitHubContributions } from "@/components/github-contributions/github-section";
import Footer from "@/components/footer/footer";
import HeroTechStack from "@/components/hero/HeroTechStack";
import { RecentPosts } from "@/components/blog/recent-posts";
import Setup from "@/components/setup/Setup";
import Guestbook from "@/components/guestbook/Guestbook";

export default function Page() {
  return (
    <>
      <ProjectSchemaMarkup />
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-0">
        <Hero />

        <Section title="tech stack">
          <HeroTechStack />
        </Section>

        <WorkExperience />
        <Projects />

        {/* Activity: contributions graph beside the writing feed */}
        <Section title="activity" id="github">
          <GridBand cols="grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <GridCell className="overflow-x-auto">
              <GitHubContributions />
            </GridCell>
            <GridCell tinted id="blog" className="flex flex-col">
              <h3 className="ss01 mb-3 text-base font-semibold">
                latest from the blog
              </h3>
              <RecentPosts />
            </GridCell>
          </GridBand>
        </Section>

        <Setup />
        <Guestbook />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
