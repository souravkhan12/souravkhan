import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card style variant */
  variant?: "default" | "elevated" | "outline";
  /** Internal padding amount */
  padding?: "sm" | "md" | "lg";
  /** Add hover effect */
  hover?: boolean;
  /** Add gradient background */
  gradient?: boolean;
}

/**
 * Card container component for grouping content
 *
 * @component
 * @example
 * <Card variant="elevated">
 *   <h2>Title</h2>
 *   <p>Content here</p>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = "",
      variant = "default",
      padding = "sm",
      hover = false,
      gradient = false,
      children,
      ...props
    },
    ref,
  ) => {
    const variantClasses: Record<string, string> = {
      default:
        "bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300",
      elevated:
        "bg-white/80 dark:bg-neutral-800/70 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-lg backdrop-blur-md hover:shadow-xl transition-all duration-300",
      outline:
        "bg-transparent rounded-2xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors duration-300",
    };

    const paddingClasses: Record<string, string> = {
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
    };

    const hoverClasses = hover
      ? "transition-all duration-300 hover:shadow-lg hover:scale-105"
      : "";
    const gradientClass = gradient
      ? "bg-gradient-to-br from-indigo-500/10 to-pink-500/10"
      : "";

    const combinedClasses = [
      variantClasses[variant] || variantClasses.default,
      paddingClasses[padding] || paddingClasses.md,
      hoverClasses,
      gradientClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={combinedClasses} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card };
