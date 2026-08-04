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
import { SiteIndex } from "@/components/hero/SiteIndex";
import { RecentPosts } from "@/components/blog/recent-posts";
import { getAllPosts } from "@/lib/blog";
import { HERO_TECH_STACK } from "@/config/data";

export default function Page() {
  /* Sections with no content are dropped rather than rendered as an empty
     heading. Each component that owns its own data guards itself (Projects,
     WorkExperience); the activity band assembled here has to be checked
     here, where its content is known. */
  const hasPosts = getAllPosts().length > 0;

  return (
    <>
      <ProjectSchemaMarkup />
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-0">
        <Hero />

        {HERO_TECH_STACK.length > 0 && (
          <Section title="tech stack">
            <HeroTechStack />
          </Section>
        )}

        <WorkExperience />

        {/* Straight after the experience: by this point a visitor knows who I
            am, which is the moment they'd start looking for what else is here.
            Above the fold it competed with the hero; below the projects nobody
            reached it. */}
        <SiteIndex />

        <Projects />

        {/* Activity: contributions graph beside the writing feed. The feed cell
            disappears with no posts, and the graph widens to fill the band
            rather than leaving a hole beside itself. */}
        <Section title="activity" id="github">
          <GridBand
            cols={
              hasPosts ? "grid-cols-1 lg:grid-cols-[2fr_1fr]" : "grid-cols-1"
            }
          >
            <GridCell className="overflow-x-auto">
              <GitHubContributions />
            </GridCell>
            {hasPosts && (
              <GridCell tinted id="blog" className="flex flex-col">
                <h3 className="ss01 mb-3 text-base font-bold">
                  latest from the blog
                </h3>
                <RecentPosts />
              </GridCell>
            )}
          </GridBand>
        </Section>

        {/* No setup or arcade band here any more — both are cards in the
            site index above, and repeating them further down made the page
            longer without telling a visitor anything the index hadn't. Their
            own routes are unchanged. */}
        <Contact />
        <Footer />
      </main>
    </>
  );
}
