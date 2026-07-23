import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section ID for anchor links */
  id?: string;
  /** Section heading text */
  title?: string;
  /** Section subheading text */
  subtitle?: string;
}

/**
 * A titled band of the page grid.
 *
 * paper.design renders section labels *inside* the grid rather than floating
 * them above it, so the label sits in its own hairline-bordered strip directly
 * on top of the band's content.
 *
 * @component
 * @example
 * <Section title="projects" id="projects">
 *   <GridBand cols="grid-cols-2">…</GridBand>
 * </Section>
 */
// A small rotating palette so each section header gets its own pop of colour.
const SECTION_ACCENTS = [
  "#10b981", // emerald
  "#5d8cd7", // blue
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#06b6d4", // cyan
];

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className = "", id, title, subtitle, children, ...props }, ref) => {
    const accent = title
      ? SECTION_ACCENTS[
          [...title].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) %
            SECTION_ACCENTS.length
        ]
      : undefined;

    return (
      <section className={`relative ${className}`} id={id} ref={ref} {...props}>
        {title && (
          <div className="border-border flex flex-col gap-1 border-t border-r border-l px-6 py-5 sm:px-8">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: accent }}
              />
              <h2 className="ss01 text-base font-semibold">{title}</h2>
            </div>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </section>
    );
  },
);

Section.displayName = "Section";

export { Section };
