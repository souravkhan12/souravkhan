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
      "w-full rounded-lg border border-gray-300 px-4 py-3",
      "placeholder-gray-400 transition-colors",
      "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
      "dark:border-gray-600 dark:bg-neutral-900 dark:text-white dark:placeholder-gray-500",
      error && "border-red-500 focus:ring-red-500/20",
      disabled && "cursor-not-allowed opacity-50",
      icon && "pl-10",
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center text-gray-500">
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
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
