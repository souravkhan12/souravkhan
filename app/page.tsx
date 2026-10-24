import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import WorkExperience from "@/components/work/WorkExperience";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/footer";
import { SiteIndex } from "@/components/hero/SiteIndex";
import { RecentPosts } from "@/components/blog/recent-posts";
import { HomeSection } from "@/components/home/HomeSection";
import { StackTable } from "@/components/home/StackTable";
import { GitHubActivity } from "@/components/home/GitHubActivity";
import { Achievements } from "@/components/home/Achievements";
import { SetupGrid } from "@/components/home/SetupGrid";

export default function Page() {
  return (
    <>
      <Navbar />

      {/* One narrow column, read top to bottom like a résumé. Sections
          separate by whitespace alone; the only rule on the page is the
          footer's. */}
      <main className="mx-auto max-w-[860px] px-5 sm:px-8">
        <Hero />
        <WorkExperience />
        <StackTable />
        <GitHubActivity />

        <HomeSection id="writing" label="Writing">
          <RecentPosts />
        </HomeSection>

        <Achievements />

        {/* After the résumé material: by now a visitor knows who I am, which
            is when they start looking for what else is here. */}
        <SiteIndex />
        <SetupGrid />
        <Contact />
        <Footer inset={false} />
      </main>
    </>
  );
}
