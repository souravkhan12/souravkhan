import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section ID for anchor links */
  id?: string;
  /** Section heading text */
  title?: string;
  /** Section subheading text */
  subtitle?: string;
  /** Section background variant */
  variant?: "default" | "accent";
  /** Vertical spacing amount */
  spacing?: "sm" | "md" | "lg";
  /** Make content full width */
  fullWidth?: boolean;
  /** Center align content */
  centered?: boolean;
}

/**
 * Section container with title and spacing options
 *
 * @component
 * @example
 * <Section title="Projects" id="projects" spacing="lg">
 *   <div>Your content here</div>
 * </Section>
 */
const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  (
    {
      className = "",
      id,
      title,
      subtitle,
      variant = "default",
      spacing = "sm",
      fullWidth = true,
      centered = false,
      children,
      ...props
    },
    ref,
  ) => {
    const spacingClasses: Record<string, string> = {
      sm: "py-8",
      md: "py-16",
      lg: "py-24",
    };

    const variantClasses: Record<string, string> = {
      default: "bg-transparent",
      accent: "bg-gray-50 dark:bg-neutral-900/50",
    };

    const containerClasses = [
      "w-full relative",
      spacingClasses[spacing] || spacingClasses.md,
      variantClasses[variant] || variantClasses.default,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const contentClasses = [
      "mx-auto",
      fullWidth ? "w-full" : "max-w-6xl px-6 lg:px-8",
      centered ? "text-center" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <section className={containerClasses} id={id} ref={ref} {...props}>
        <div className={contentClasses}>
          {title && (
            <div className="mb-5">
              <h2 className="font-sans text-2xl text-gray-900 dark:text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  {subtitle}
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
