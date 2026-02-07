import React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section ID for anchor links */
  id?: string;
  /** Section heading text */
  title?: string;
  /** Section description text */
  description?: string;
  /** Vertical spacing - compact, default, or roomy */
  spacing?: "compact" | "default" | "roomy";
  /** Content max width constraint */
  container?: "default" | "wide" | "narrow";
  /** Center align all content */
  centered?: boolean;
}

/**
 * Section container with consistent spacing and typography
 *
 * @component
 * @example
 * <Section title="Projects" description="Recent work" spacing="default">
 *   <ProjectList />
 * </Section>
 */
const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      id,
      title,
      description,
      spacing = "default",
      container = "wide",
      centered = false,
      children,
      ...props
    },
    ref,
  ) => {
    const spacingStyles = {
      compact: "py-6 sm:py-8",
      default: "py-12 sm:py-16",
      roomy: "py-16 sm:py-24",
    };

    const containerStyles = {
      narrow: "max-w-3xl",
      default: "max-w-5xl",
      wide: "max-w-7xl",
    };

    return (
      <section
        ref={ref}
        id={id}
        className={cn("w-full", spacingStyles[spacing], className)}
        {...props}
      >
        <div
          className={cn(
            "mx-auto px-4 sm:px-6 lg:px-8",
            containerStyles[container],
            centered && "text-center",
          )}
        >
          {(title || description) && (
            <div className={cn("mb-8 sm:mb-10", centered && "mx-auto")}>
              {title && (
                <span className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  {title}
                </span>
              )}
              {description && (
                <p className="text-muted-foreground mt-2 text-base sm:text-lg">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </section>
    );
  },
);

Section.displayName = "Section";

export { Section };
