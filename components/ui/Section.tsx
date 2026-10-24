import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section ID for anchor links */
  id?: string;
  /** Section heading text */
  title?: string;
  /** Section subheading text */
  subtitle?: string;
  /** How many things are in this section, shown as a small pill beside the title. */
  count?: number;
  /** Kept for the existing call sites; titles are no longer lowercased. */
  preserveTitleCase?: boolean;
}

/**
 * A titled block of an inner page, in the homepage's register: a quiet
 * heading, a one-line deck, then the content — separated from its
 * neighbours by whitespace, not by rules or tinted bands.
 *
 * The page's own headline belongs to <PageHeader>; this is for the sections
 * under it.
 */
const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      className = "",
      id,
      title,
      subtitle,
      count,
      // Pulled out so it isn't spread onto the DOM.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      preserveTitleCase,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        className={`relative scroll-mt-20 py-8 sm:py-10 ${className}`}
        id={id}
        ref={ref}
        {...props}
      >
        {title && (
          <div className="mb-6">
            <h2 className="flex items-center gap-2.5 text-base font-bold tracking-tight">
              {id ? (
                <a href={`#${id}`} className="group/anchor hover:text-blue">
                  {title}
                  <span
                    aria-hidden="true"
                    className="text-blue ml-1.5 opacity-0 transition-opacity group-hover/anchor:opacity-100"
                  >
                    #
                  </span>
                </a>
              ) : (
                title
              )}
              {count !== undefined && (
                <span className="font-code bg-surface text-soft text-2xs rounded-full px-2 py-0.5 font-normal tabular-nums">
                  {count}
                </span>
              )}
            </h2>
            {subtitle && <p className="text-soft mt-1 text-sm">{subtitle}</p>}
          </div>
        )}
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";

export { Section };
