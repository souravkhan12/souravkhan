import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge color variant */
  variant?: "default" | "primary" | "secondary" | "success" | "danger";
  /** Badge size */
  size?: "sm" | "md" | "lg";
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Show close button */
  removable?: boolean;
  /** Callback when close button clicked */
  onRemove?: () => void;
}

/**
 * Badge component for tags and labels
 *
 * @component
 * @example
 * <Badge variant="primary">React</Badge>
 * <Badge variant="success" removable onRemove={() => {}}>Tag</Badge>
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className = "",
      variant = "default",
      size = "md",
      icon,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref,
  ) => {
    const variantClasses: Record<string, string> = {
      default: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
      primary:
        "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100",
      secondary:
        "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
      success:
        "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
      danger: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
    };

    const sizeClasses: Record<string, string> = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    const combinedClasses = [
      "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors",
      variantClasses[variant] || variantClasses.default,
      sizeClasses[size] || sizeClasses.md,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span className={combinedClasses} ref={ref} {...props}>
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
        {removable && (
          <button
            onClick={onRemove}
            className="ml-1 hover:opacity-70"
            aria-label="Remove"
          >
            ✕
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
