import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card style variant */
  variant?: "default" | "elevated" | "outline";
  /** Internal padding amount */
  padding?: "sm" | "md" | "lg";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className = "", variant = "default", padding = "sm", children, ...props },
    ref,
  ) => {
    const variantClasses: Record<string, string> = {
      default:
        "bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm",
      elevated:
        "bg-white/80 dark:bg-neutral-800/70 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-lg backdrop-blur-md",
      outline:
        "bg-transparent rounded-2xl border border-gray-300 dark:border-gray-600",
    };

    const paddingClasses: Record<string, string> = {
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
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
