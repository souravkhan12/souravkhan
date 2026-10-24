import { WORK_EXPERIENCE } from "@/config/data";
import { HomeSection } from "@/components/home/HomeSection";

/**
 * The homepage's short version: one summary per role. The full résumé
 * bullets live on /resume, which reads the same entries.
 */
export default function WorkExperience() {
  if (WORK_EXPERIENCE.length === 0) return null;

  return (
    <HomeSection id="experience" label="Experience">
      <ol className="flex flex-col gap-9">
        {WORK_EXPERIENCE.map((job) => (
          <li key={`${job.company}-${job.duration}`}>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-base font-bold tracking-tight">
                {job.company}
                <span className="text-soft ml-2 font-normal">
                  {job.position}
                </span>
              </h3>
              <span className="font-code text-faint text-2xs shrink-0">
                {job.years}
              </span>
            </div>
            {"via" in job && job.via && (
              <p className="font-code text-faint text-2xs mt-0.5">
                contract via {job.via}
              </p>
            )}
            <p className="text-soft mt-2 text-sm leading-relaxed text-pretty">
              {job.summary}
            </p>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
