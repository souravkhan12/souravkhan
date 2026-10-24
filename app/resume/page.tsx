import Link from "next/link";
import Image from "next/image";
import { TechChip } from "@/components/ui/tech";
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
  STACK,
  ACHIEVEMENTS,
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
    <div className="pt-10 pb-4 sm:pt-16 print:py-0">
      {/* Header — the photo appears here and in the homepage hero only;
          everywhere else the site is represented by the S mark. */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-surface relative size-14 shrink-0 overflow-hidden rounded-full print:hidden">
            <Image
              src="/sourav.webp"
              alt={HERO.name}
              fill
              priority
              sizes="168px"
              quality={90}
              className="object-cover object-[50%_30%]"
            />
          </div>
          <div>
            <h1 className="text-[28px] leading-tight font-bold tracking-[-0.03em] sm:text-[34px]">
              {HERO.name}
            </h1>
            <p className="text-soft text-base">{HERO.title}</p>
          </div>
        </div>

        <a
          href={CONTACT_INFO.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-foreground text-background inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-[opacity,transform] hover:opacity-85 active:scale-[0.97] print:hidden"
        >
          <LuDownload size={14} aria-hidden="true" />
          PDF
        </a>
      </header>

      {/* Contact strip */}
      <div className="font-code text-soft mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs">
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

      <p className="text-soft mt-6 text-sm leading-relaxed">{HERO.bio}</p>

      {/* Experience */}
      <ResumeSection title="Experience">
        <div className="flex flex-col gap-6">
          {WORK_EXPERIENCE.map((job) => (
            <article key={`${job.company}-${job.duration}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-base font-semibold">
                  {job.position} · {job.company}
                  {"via" in job && job.via && (
                    <span className="text-soft font-normal">
                      {" "}
                      (contract via {job.via})
                    </span>
                  )}
                </h3>
                <span className="font-code text-2xs text-soft">
                  {job.duration}
                </span>
              </div>
              <p className="font-code text-2xs text-soft mt-0.5">
                {job.location}
              </p>
              <ul className="text-soft mt-2 flex list-disc flex-col gap-1.5 pl-4 text-sm leading-relaxed">
                {job.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5 print:hidden">
                {job.technologies.map((tech) => (
                  <TechChip key={tech} label={tech} size="xs" />
                ))}
              </div>
              <p className="font-code text-2xs text-faint mt-2 hidden print:block">
                {job.technologies.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </ResumeSection>

      {/* Skills */}
      <ResumeSection title="Skills">
        <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm print:gap-y-1.5">
          {STACK.map(({ group, items }) => (
            <div key={group} className="contents">
              <dt className="text-faint pt-1 print:pt-0">{group}</dt>
              <dd className="text-soft">
                <span className="flex flex-wrap gap-1.5 print:hidden">
                  {items.map((item) => (
                    <TechChip key={item} label={item} />
                  ))}
                </span>
                <span className="hidden print:inline">{items.join(", ")}</span>
              </dd>
            </div>
          ))}
        </dl>
      </ResumeSection>

      {/* Achievements */}
      <ResumeSection title="Achievements">
        <ul className="text-soft flex list-disc flex-col gap-1.5 pl-4 text-sm leading-relaxed">
          {ACHIEVEMENTS.map(({ metric, text, href }) => (
            <li key={text}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue transition-colors"
              >
                <strong className="text-foreground font-semibold">
                  {metric}
                </strong>{" "}
                {text}
              </a>
            </li>
          ))}
        </ul>
      </ResumeSection>

      {/* Education */}
      <ResumeSection title="Education">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-base font-semibold">
            J.C. Bose University of Science and Technology
          </h3>
          <span className="font-code text-2xs text-soft">
            Aug 2019 - Jun 2023
          </span>
        </div>
        <p className="text-soft mt-1 text-sm">
          B.Tech in Computer Engineering · CGPA 8.63/10 · Faridabad, India
        </p>
      </ResumeSection>

      {/* Selected work */}
      <ResumeSection title="Selected work">
        <div className="flex flex-col gap-4">
          {PROJECTS.map((project) => (
            <div key={project.title}>
              <h3 className="text-sm font-semibold">{project.title}</h3>
              <p className="text-soft mt-1 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/projects"
          className="group mt-4 inline-flex items-center gap-1 text-sm font-semibold print:hidden"
        >
          Full case studies
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </ResumeSection>
    </div>
  );
}

/** The homepage's label-and-content row, without the scroll reveal — this
    page gets printed, and print never scrolls anything into view. */
function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 md:grid md:grid-cols-[140px_minmax(0,1fr)] md:gap-x-10 print:mt-6 print:block print:break-inside-avoid">
      <h2 className="font-code text-faint text-2xs mb-4 font-normal md:mb-0 md:pt-0.5 print:mb-2">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
