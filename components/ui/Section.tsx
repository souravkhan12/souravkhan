import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section ID for anchor links */
  id?: string;
  /** Section heading text */
  title?: string;
  /** Section subheading text */
  subtitle?: string;
  /**
   * How many things are in this section. Shown as a superscript beside the
   * title so the size of a list is legible before you scroll it — borrowed
   * from chanhdai.com, where every panel announces its own count.
   */
  count?: number;
  /**
   * Opts the heading out of the global lowercase transform.
   *
   * Set this whenever the title contains code or proper nouns: lowercasing
   * turns `parseInt` into `parseint` and `NaN` into `nan`, which is wrong on
   * its face and reads as sloppy in a search result.
   */
  preserveTitleCase?: boolean;
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
 * <Section title="projects" id="projects" count={6}>
 *   <GridBand cols="grid-cols-2">…</GridBand>
 * </Section>
 */
const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      className = "",
      id,
      title,
      subtitle,
      count,
      preserveTitleCase = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      // Bands used to butt straight into each other, so `setup` ran into
      // `arcade` with nothing but a hairline between them. The gap lets the
      // page's fixed vertical rules show through, which reads as deliberate
      // structure rather than a seam.
      <section
        className={`relative mt-12 first:mt-0 sm:mt-16 ${className}`}
        id={id}
        ref={ref}
        {...props}
      >
        {title && (
          // `screen-line-top`: the rule above the header runs the full width
          // of the viewport rather than stopping at the content column, so a
          // section boundary is visible without hunting for the seam.
          //
          // gray-100, not gray-50: against the paper background gray-50 is a
          // 2% step, which on a long page left headers, tinted cells and
          // plain cells reading as one flat sheet with nothing to chunk it.
          <div className="screen-line-top border-border rule-strong flex flex-col gap-1 border-t-2 border-r border-l bg-gray-100 px-6 py-3.5 sm:px-8 dark:bg-black">
            <h2
              className={`ss01 text-foreground flex items-baseline gap-3 text-lg font-bold ${
                preserveTitleCase ? "" : "label-case"
              }`}
            >
              <span
                aria-hidden="true"
                className="bg-blue relative top-[3px] h-4 w-[3px] shrink-0 self-start"
              />
              {/* The heading is its own deep link — every section becomes
                  shareable, and the `#` only shows on hover so it costs
                  nothing visually. */}
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
                <sup className="font-code text-2xs text-faint -top-1 font-normal tabular-nums">
                  {count}
                </sup>
              )}
            </h2>
            {subtitle && (
              <p className="text-soft pl-[18px] text-xs">{subtitle}</p>
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
