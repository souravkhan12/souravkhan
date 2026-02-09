"use client";

import Image from "next/image";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { Project } from "@/types";
import { Card, Button } from "@/components/ui";
import TechStack from "@/components/tech-stack/Techstack";
import { motion } from "motion/react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card
      variant="default"
      className="flex flex-col items-center justify-center gap-20 lg:flex-row"
    >
      <motion.div
        className="group relative h-60 w-full self-stretch overflow-hidden rounded-[12px] border border-gray-200/20 lg:w-[400px] dark:border-gray-700/20"
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          fetchPriority="high"
          className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </motion.div>

      {/* Project Info */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="mb-5 text-xl font-semibold tracking-tight dark:text-gray-100">
          {project.title}
        </h2>
        <p className="mb-5 leading-relaxed text-gray-600 dark:text-gray-300">
          {project.description}
        </p>

        {/* Tech Stack and Links */}
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <TechStack technologies={project.technologies} colorful={true} />
          <div className="flex items-end gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Button asChild size="icon" variant="secondary">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live link`}
                >
                  <LuExternalLink />
                </a>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Button asChild size="icon" variant="secondary">
                <a
                  href={project.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} source code`}
                >
                  <SiGithub />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
