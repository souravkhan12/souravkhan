import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
      "w-full border border-border bg-background px-4 py-3 text-sm",
      "placeholder-gray-400 transition-colors resize-none",
      "focus:border-focus focus:outline-none",
      "dark:placeholder-gray-600",
      error && "border-destructive",
      disabled && "cursor-not-allowed opacity-50",
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label className="mb-2 block text-xs font-medium lowercase">
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
        <div className="text-soft mt-1 flex justify-between text-xs">
          {error && <span className="text-destructive">{error}</span>}
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
