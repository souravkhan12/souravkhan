"use client";
import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/config/data";
import { Section } from "@/components/ui";
import { MOTION_VARIANTS } from "@/config/theme";
import { motion } from "motion/react";

export default function Projects() {
  return (
    <Section title="Projects" id="projects">
      <div className="flex flex-col justify-center gap-12 sm:gap-16 lg:gap-20">
        {PROJECTS.map((project, index) => (
          <motion.div
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
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
