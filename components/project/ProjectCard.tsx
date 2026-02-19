"use client";

import Image from "next/image";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import { Project } from "@/types";
import { Card, Button } from "@/components/ui";
import TechStack from "@/components/tech-stack/Techstack";
import { motion } from "motion/react";
import React from "react";
import { useInitialAnimation } from "@/hooks/use-initial-animation";
import { Expand } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const shouldAnimate = useInitialAnimation();

  return (
    <Card
      variant="default"
      className="flex flex-col items-center justify-center gap-20 lg:flex-row"
    >
      <Link
        href={project.slug ? `/project/${project.slug}` : "#"}
        className="group relative h-60 w-full self-stretch overflow-hidden rounded-[12px] border border-gray-200/20 lg:w-[400px] dark:border-gray-700/20"
      >
        <motion.div transition={{ duration: 0.3, ease: "easeOut" }}>
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            fetchPriority="high"
            className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
          />
        </motion.div>
      </Link>

      {/* Project Info */}
      <motion.div
        className="flex-1"
        initial={shouldAnimate ? { opacity: 0, x: 20 } : false}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href={project.slug ? `/project/${project.slug}` : "#"}>
            <h2 className="text-xl font-semibold tracking-tight transition-colors hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300">
              {project.title}
            </h2>
          </Link>

          <div className="flex gap-4">
            <OpenLinkButton
              buttonText={<LuExternalLink />}
              href={project.link}
              label={`${project.title} demo`}
              variant="secondary"
            />
            <OpenLinkButton
              buttonText={<SiGithub />}
              href={project.code}
              label={`${project.title} source code`}
              variant="secondary"
            />
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Link href={project.slug ? `/project/${project.slug}` : "#"}>
                <Button asChild size="icon" variant="outline">
                  <span className="flex items-center justify-center">
                    <Expand />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-gray-600 md:line-clamp-none dark:text-gray-300">
          {project.description}
        </p>

        {/* Tech Stack and Links */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-10">
          <TechStack technologies={project.technologies} colorful={true} />
        </div>
      </motion.div>
    </Card>
  );
}

interface OpenLinkButtonProps {
  buttonText: React.ReactElement;
  href: string;
  label: string;
  variant?: "default" | "secondary";
}

function OpenLinkButton({
  buttonText,
  href,
  label,
  variant = "secondary",
}: OpenLinkButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <Button asChild size="icon" variant={variant}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          {buttonText}
        </a>
      </Button>
    </motion.div>
  );
}
