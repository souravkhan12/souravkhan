import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Associated label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Make textarea full width */
  fullWidth?: boolean;
  /** Maximum character count to display */
  charCountMax?: number;
}

/**
 * Form textarea component with label and character counter
 *
 * @component
 * @example
 * <Textarea label="Message" placeholder="Your message..." rows={5} />
 * <Textarea label="Bio" charCountMax={500} />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      label,
      error,
      fullWidth = false,
      charCountMax,
      value,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0,
    );

    const textareaClasses = [
      "w-full rounded-lg border border-gray-300 px-4 py-3",
      "placeholder-gray-400 transition-colors resize-none",
      "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
      "dark:border-gray-600 dark:bg-neutral-900 dark:text-white dark:placeholder-gray-500",
      error && "border-red-500 focus:ring-red-500/20",
      disabled && "cursor-not-allowed opacity-50",
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
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          maxLength={charCountMax}
          value={value}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            props.onChange?.(e);
          }}
          {...props}
        />
        <div className="flex justify-between text-xs text-gray-500">
          {error && <span className="text-red-500">{error}</span>}
          {charCountMax && (
            <span className="ml-auto">
              {charCount}/{charCountMax}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
