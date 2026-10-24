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
      {/* A thin timeline: one rule down the left and a dot per role. The
          current role's dot carries the accent; the rest pick it up on hover. */}
      <ol className="border-border relative ml-1 flex flex-col gap-9 border-l pl-6">
        {WORK_EXPERIENCE.map((job, i) => (
          <li key={`${job.company}-${job.duration}`} className="group relative">
            <span
              aria-hidden="true"
              className={`ring-background absolute top-[9px] -left-[29px] size-2.5 rounded-full ring-4 transition-[background-color,transform] duration-300 group-hover:scale-125 ${
                i === 0
                  ? "bg-blue"
                  : "group-hover:bg-blue bg-gray-300 dark:bg-gray-700"
              }`}
            />
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
