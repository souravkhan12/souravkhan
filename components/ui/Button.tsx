import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button style variant */
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  /** Button size */
  size?: "sm" | "md" | "lg" | "icon";
  /** Make button full width */
  fullWidth?: boolean;
  /** Show loading state with spinner */
  isLoading?: boolean;
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Icon position relative to text */
  iconPosition?: "left" | "right";
  /** Render as different HTML element */
  as?: React.ElementType;
  /** URL for link button */
  href?: string;
  /** HTML target attribute */
  target?: string;
  /** HTML rel attribute */
  rel?: string;
}

/**
 * Button component with multiple variants and sizes
 *
 * @component
 * @example
 * <Button variant="primary">Click me</Button>
 * <Button as="a" href="/link">Link Button</Button>
 * <Button isLoading>Submitting...</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      as,
      href,
      target,
      rel,
      ...props
    },
    ref,
  ) => {
    // Determine component to render
    const Component = (as || "button") as any;
    // Variant styles
    const variantClasses: Record<string, string> = {
      primary:
        "bg-gray-900 text-white shadow-md hover:bg-gray-800 focus:ring-gray-900 dark:bg-gray-500 dark:text-black dark:hover:bg-gray-600",
      secondary:
        "border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50 focus:ring-gray-300 dark:border-gray-600 dark:bg-[#1E1E1E] dark:text-gray-100 dark:hover:bg-[#2a2a2a]",
      ghost:
        "text-gray-900 hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-100 dark:hover:bg-gray-800",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 dark:hover:bg-red-500",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 dark:hover:bg-green-500",
    };

    // Size styles
    const sizeClasses: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      icon: "p-2",
    };

    const baseClasses =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const combinedClasses = [
      baseClasses,
      variantClasses[variant] || variantClasses.primary,
      sizeClasses[size] || sizeClasses.md,
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Component
        className={combinedClasses}
        disabled={disabled || isLoading}
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="mr-2 flex items-center">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="ml-2 flex items-center">{icon}</span>
            )}
          </>
        )}
      </Component>
    );
  },
);

Button.displayName = "Button";

export { Button };
