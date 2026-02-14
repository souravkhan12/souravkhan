import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/config/data";
import { Section } from "@/components/ui";
import { MOTION_VARIANTS } from "@/config/theme";
import { MotionDiv } from "@/components/ui/motion-wrapper";

export default function Projects() {
  return (
    <Section title="Projects" id="projects">
      <div className="flex flex-col justify-center gap-12 sm:gap-16 lg:gap-20">
        {PROJECTS.map((project, index) => (
          <MotionDiv
            key={index}
            variants={MOTION_VARIANTS.slideUp}
            initial="hidden"
            whileInView="visible"
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <ProjectCard project={project} />
          </MotionDiv>
        ))}
      </div>
    </Section>
  );
}
