import ProjectCard from "./ProjectCard";
import { getAllProjects } from "@/lib/projects";
import { Section } from "@/components/ui";
import { MOTION, MOTION_VARIANTS } from "@/config/theme";
import { MotionDiv } from "@/components/ui/motion-wrapper";

export default function Projects() {
  const projects = getAllProjects();

  return (
    <Section title="Projects" id="projects">
      <div className="flex flex-col justify-center gap-12 sm:gap-16 lg:gap-20">
        {projects.map((project, index) => (
          <MotionDiv
            key={project.slug}
            variants={MOTION_VARIANTS.rise}
            initial="hidden"
            whileInView="visible"
            transition={{
              duration: MOTION.duration.slow,
              delay: index * 0.1,
              ease: MOTION.ease,
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
