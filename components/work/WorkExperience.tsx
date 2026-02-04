"use client";

import { motion } from "motion/react";
import TechStack from "../tech-stack/Techstack";
import { useRef } from "react";
import { WORK_EXPERIENCE } from "@/config/data";
import { Section, Card } from "@/components/ui";

export default function WorkExperience() {
  const targetRef = useRef(null);

  return (
    <Section id="experience" title="Work Experience" ref={targetRef}>
      <div className="space-y-8 sm:space-y-12">
        {WORK_EXPERIENCE.map((experience, index) => (
          <motion.div key={index}>
            <Card padding="md" variant="default">
              {/* Company & Position */}
              <h3 className="mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-xl dark:text-gray-100">
                {experience.company}
              </h3>

              <div className="flex flex-col pb-2 sm:flex-row sm:items-center sm:gap-2">
                <p className="mb-1 text-sm font-medium sm:mb-2 sm:text-base dark:text-gray-300">
                  {experience.position}
                </p>
                {experience.duration && (
                  <p className="mb-2 text-xs text-gray-500 sm:text-sm dark:text-gray-300">
                    {experience.duration}
                  </p>
                )}
              </div>

              {/* Achievements */}
              <ul className="list-disc space-y-2 sm:space-y-4">
                {experience.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className="list-none text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300"
                  >
                    {achievement}
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <TechStack technologies={experience.technologies} />
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
