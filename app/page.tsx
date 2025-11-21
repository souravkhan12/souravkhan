import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import WorkExperience from "@/components/WorkExperience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { PatternDivider } from "@/components/PatternDivider";
import { ProjectSchemaMarkup } from "@/components/ProjectSchemaMarkup";
import { LAYOUT } from "@/constants/styles";
import { cn } from "@/lib/utils";

export default function Page() {
  const OuterStyle = cn(
    "flex overflow-x-hidden",
    `${LAYOUT.width}`,
    "mx-auto",
    "[--pattern-fg:var(--color-gray-950)]/5",
    "dark:bg-[#1E1E1E] dark:[--pattern-fg:var(--color-white)]/10",
  );

  return (
    <>
      <ProjectSchemaMarkup />

      <div className={OuterStyle}>
        <PatternDivider position="left" />

        <div className={cn(LAYOUT.container, "dark:bg-[#1E1E1E]")}>
          <Navbar />
          <Hero />
          <WorkExperience />
          <Projects />
          <Contact />
        </div>

        <PatternDivider position="right" />
      </div>
    </>
  );
}
