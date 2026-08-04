import TechStack from "../tech-stack/Techstack";
import { WORK_EXPERIENCE } from "@/config/data";
import { Section, GridBand, GridCell } from "@/components/ui";

export default function WorkExperience() {
  if (WORK_EXPERIENCE.length === 0) return null;

  return (
    <Section id="experience" title="work experience">
      <GridBand cols="grid-cols-1">
        {WORK_EXPERIENCE.map((experience, index) => (
          <GridCell key={index} tinted={index % 2 === 1} className="space-y-6">
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <div>
                <h3 className="ss01 normal-case-force text-base font-bold">
                  {experience.company}
                  {index === 0 && (
                    <span className="text-soft ml-2 text-sm font-normal">
                      (via thinkify labs)
                    </span>
                  )}
                </h3>
                <p className="text-soft mt-1 text-sm">{experience.position}</p>
              </div>

              <div className="text-soft shrink-0 text-sm md:text-right">
                {experience.duration && <p>{experience.duration}</p>}
                {experience.location && <p>{experience.location}</p>}
              </div>
            </div>

            <ul className="space-y-2.5">
              {experience.achievements.map((achievement, idx) => (
                <li
                  key={idx}
                  className="relative pl-4 text-sm leading-relaxed text-pretty text-gray-600 before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-gray-400 dark:text-gray-400"
                >
                  {achievement}
                </li>
              ))}
            </ul>

            <TechStack technologies={experience.technologies} colorful={true} />
          </GridCell>
        ))}
      </GridBand>
    </Section>
  );
}
