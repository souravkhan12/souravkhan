import Link from "next/link";
import {
  LuDownload,
  LuMail,
  LuPhone,
  LuMapPin,
  LuGithub,
  LuLinkedin,
} from "react-icons/lu";
import {
  HERO,
  CONTACT_INFO,
  SOCIAL_LINKS,
  WORK_EXPERIENCE,
  HERO_TECH_STACK,
  PROJECTS,
} from "@/config/data";
import { SEO_CONFIG } from "@/config/seo";

export const metadata = {
  title: "Resume",
  description: `${HERO.name} — ${HERO.title}. Experience, skills and selected work.`,
  alternates: { canonical: `${SEO_CONFIG.baseUrl}/resume` },
};

/**
 * An HTML resume rather than only a PDF link: a Drive PDF can't be crawled,
 * ranked, or read on a phone without a download. `print:` utilities make
 * Cmd-P → Save as PDF produce a clean one-pager.
 */
export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10 print:max-w-none print:py-0">
      {/* Header */}
      <header className="border-border flex flex-wrap items-start justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="ss01 normal-case-force text-3xl font-bold tracking-[-0.02em]">
            {HERO.name}
          </h1>
          <p className="text-blue mt-1 text-base">{HERO.title}</p>
        </div>

        <a
          href={CONTACT_INFO.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="border-blue text-blue hover:bg-blue/5 font-code inline-flex items-center gap-2 border px-3 py-1.5 text-xs transition-colors print:hidden"
        >
          <LuDownload size={13} aria-hidden="true" />
          pdf
        </a>
      </header>

      {/* Contact strip */}
      <div className="font-code text-muted-foreground mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="hover:text-blue inline-flex items-center gap-1.5 transition-colors"
        >
          <LuMail size={12} aria-hidden="true" />
          {CONTACT_INFO.email}
        </a>
        <a
          href={`tel:${CONTACT_INFO.phone}`}
          className="hover:text-blue inline-flex items-center gap-1.5 transition-colors"
        >
          <LuPhone size={12} aria-hidden="true" />
          {CONTACT_INFO.phone}
        </a>
        <span className="inline-flex items-center gap-1.5">
          <LuMapPin size={12} aria-hidden="true" />
          {CONTACT_INFO.location}
        </span>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue inline-flex items-center gap-1.5 transition-colors"
        >
          <LuGithub size={12} aria-hidden="true" />
          github
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue inline-flex items-center gap-1.5 transition-colors"
        >
          <LuLinkedin size={12} aria-hidden="true" />
          linkedin
        </a>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {HERO.bio}
      </p>

      {/* Experience */}
      <ResumeSection title="experience">
        <div className="flex flex-col gap-6">
          {WORK_EXPERIENCE.map((job) => (
            <article key={`${job.company}-${job.duration}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="ss01 normal-case-force text-base font-semibold">
                  {job.position} · {job.company}
                </h3>
                <span className="font-code text-[11px] text-gray-500">
                  {job.duration}
                </span>
              </div>
              <p className="font-code mt-0.5 text-[11px] text-gray-500">
                {job.location}
              </p>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {job.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
              <p className="font-code mt-2 text-[11px] text-gray-400">
                {job.technologies.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </ResumeSection>

      {/* Skills */}
      <ResumeSection title="skills">
        <div className="flex flex-wrap gap-2">
          {HERO_TECH_STACK.map((tech) => (
            <span
              key={tech.name}
              className="border-border font-code border px-2 py-0.5 text-[11px] text-gray-600 dark:text-gray-400"
            >
              {tech.name}
            </span>
          ))}
        </div>
      </ResumeSection>

      {/* Selected work */}
      <ResumeSection title="selected work">
        <div className="flex flex-col gap-4">
          {PROJECTS.map((project) => (
            <div key={project.title}>
              <h3 className="ss01 normal-case-force text-sm font-semibold">
                {project.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/projects"
          className="text-blue mt-4 inline-block text-xs transition-opacity hover:opacity-80 print:hidden"
        >
          full case studies →
        </Link>
      </ResumeSection>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 print:break-inside-avoid">
      <h2 className="ss01 border-border flex items-center gap-3 border-b pb-2 text-sm font-bold">
        <span aria-hidden="true" className="bg-blue h-3.5 w-[3px]" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
