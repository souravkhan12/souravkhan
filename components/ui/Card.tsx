import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card style variant */
  variant?: "default" | "elevated" | "outline";
  /** Internal padding amount */
  padding?: "sm" | "md" | "lg";
}

/** A soft rounded panel: outlined, filled, or raised with a soft shadow. */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className = "", variant = "default", padding = "sm", children, ...props },
    ref,
  ) => {
    const variantClasses: Record<string, string> = {
      default: "bg-background border border-border/70 rounded-2xl",
      elevated: "bg-background shadow-soft rounded-2xl",
      outline: "bg-transparent border border-border rounded-2xl",
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
