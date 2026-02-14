import { MotionDiv } from "@/components/ui/motion-wrapper";
import TechStack from "../tech-stack/Techstack";
import { WORK_EXPERIENCE } from "@/config/data";
import { Section, Card } from "@/components/ui";
import { MOTION_VARIANTS } from "@/config/theme";

export default function WorkExperience() {
  return (
    <Section id="experience" title="Work Experience">
      <div className="space-y-8 sm:space-y-12">
        {WORK_EXPERIENCE.map((experience, index) => (
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
            <Card padding="md" variant="default">
              {/* Company & Position */}
              <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="mb-2 text-lg font-semibold tracking-tight sm:mb-3 sm:text-xl dark:text-gray-100">
                    {experience.company}
                  </h3>

                  <div className="flex flex-col pb-2 sm:flex-row sm:items-center sm:gap-2">
                    <p className="mb-1 text-sm font-medium sm:mb-2 sm:text-base dark:text-gray-300">
                      {experience.position}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col pb-4 md:items-end">
                  {experience.duration && (
                    <p className="mb-2 text-xs text-gray-500 sm:text-sm dark:text-gray-300">
                      {experience.duration}
                    </p>
                  )}
                  {experience.location && (
                    <p className="mb-2 text-xs text-gray-500 sm:text-sm dark:text-gray-300">
                      {experience.location}
                    </p>
                  )}
                </div>
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
              <TechStack
                technologies={experience.technologies}
                colorful={true}
              />
            </Card>
          </MotionDiv>
        ))}
      </div>
    </Section>
  );
}
