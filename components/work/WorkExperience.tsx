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
              <h3 className="text-foreground mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-xl">
                {experience.company}
              </h3>

              <div className="flex flex-col pb-2 sm:flex-row sm:items-center sm:gap-2">
                <p className="text-muted-foreground mb-1 text-sm font-medium sm:mb-2 sm:text-base">
                  {experience.position}
                </p>
                {experience.duration && (
                  <p className="text-muted-foreground mb-2 text-xs sm:text-sm">
                    {experience.duration}
                  </p>
                )}
              </div>

              {/* Achievements */}
              <ul className="list-disc space-y-2 sm:space-y-4">
                {experience.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground list-none text-sm leading-relaxed sm:text-base"
                  >
                    {achievement}
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <TechStack
                technologies={experience.technologies}
                colorful={true}
              />
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
