import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card style variant */
  variant?: "default" | "elevated" | "outline";
  /** Internal padding amount */
  padding?: "sm" | "md" | "lg";
}

/**
 * A flat, hairline-bordered panel. paper.design has no rounding and no
 * elevation — depth comes from the grid rules and tinted fills instead.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className = "", variant = "default", padding = "sm", children, ...props },
    ref,
  ) => {
    const variantClasses: Record<string, string> = {
      default: "bg-background border border-border",
      elevated: "bg-gray-50 dark:bg-black border border-border",
      outline: "bg-transparent border border-border",
    };

    const paddingClasses: Record<string, string> = {
      sm: "p-4 sm:p-5",
      md: "p-6 sm:p-8",
      lg: "p-8 sm:p-10",
    };

    const combinedClasses = [
      variantClasses[variant] || variantClasses.default,
      paddingClasses[padding] || paddingClasses.md,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card };
