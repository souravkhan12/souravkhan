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
      "w-full rounded-lg border border-input bg-background px-4 py-3",
      "placeholder:text-muted-foreground transition-colors resize-none",
      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      error && "border-destructive focus:ring-destructive/20",
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
        <div className="text-muted-foreground flex justify-between text-xs">
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
