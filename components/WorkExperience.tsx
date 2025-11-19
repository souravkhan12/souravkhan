"use client";

import { motion } from "motion/react";
import TechStack from "./Techstack";
import { useRef } from "react";
import { WORK_EXPERIENCE } from "@/constants/data";
import { Section, Card } from "@/components/ui";

export default function WorkExperience() {
  const targetRef = useRef(null);

  return (
    <Section id="experience" title="Work Experience" ref={targetRef}>
      <div className="space-y-12">
        {WORK_EXPERIENCE.map((experience, index) => (
          <motion.div key={index}>
            <Card padding="lg" variant="default">
              {/* Company & Position */}
              <h3 className="mb-3 text-xl dark:text-gray-100">
                {experience.company}
              </h3>

              <div className="flex gap-2 pb-2">
                <p className="mb-2 dark:text-gray-300">{experience.position}</p>
                {experience.duration && (
                  <p className="mb-2 text-sm font-normal text-gray-500 dark:text-gray-300">
                    {experience.duration}
                  </p>
                )}
              </div>

              {/* Achievements */}
              <ul className="list-disc space-y-4">
                {experience.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className="list-none justify-items-start leading-relaxed font-normal text-gray-500 dark:text-gray-300"
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
