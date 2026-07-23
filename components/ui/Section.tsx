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
const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className = "", id, title, subtitle, children, ...props }, ref) => {
    return (
      <section className={`relative ${className}`} id={id} ref={ref} {...props}>
        {title && (
          <div className="border-border flex flex-col gap-1.5 border-t border-r border-l px-6 py-6 sm:px-8 sm:py-7">
            <h2 className="ss01 text-base font-semibold">{title}</h2>
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
