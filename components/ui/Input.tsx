import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Associated label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Make input full width */
  fullWidth?: boolean;
}

/**
 * Form input component with label and error support
 *
 * @component
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * <Input label="Name" error="Name is required" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      error,
      icon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputClasses = [
      "w-full rounded-lg border border-input bg-background px-4 py-3",
      "placeholder:text-muted-foreground transition-colors",
      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      error && "border-destructive focus:ring-destructive/20",
      icon && "pl-10",
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="text-foreground mb-2 block text-sm font-medium">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="text-muted-foreground absolute top-1/2 left-3 flex -translate-y-1/2 items-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
