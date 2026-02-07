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
        "bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300",
      elevated:
        "bg-card/80 rounded-2xl border border-border shadow-lg backdrop-blur-md hover:shadow-xl transition-all duration-300",
      outline:
        "bg-transparent rounded-2xl border border-border hover:bg-muted/50 transition-colors duration-300",
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
      ? "bg-gradient-to-br from-primary/10 to-primary/5"
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
