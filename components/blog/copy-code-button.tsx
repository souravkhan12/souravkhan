"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    // blog-breakout: code doesn't wrap, so it gets the wide band instead of
    // scrolling sideways inside the 40rem text measure.
    <div className="group blog-breakout relative">
      <pre
        ref={preRef}
        className={cn(
          // 13px everywhere: a step under the 16–17px body, the same size as
          // the site's other mono text. It used to jump to 16px from `sm`
          // up, which made code read louder than the prose around it.
          "font-code text-[13px]! leading-[1.7]!",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          "border-border bg-background absolute top-2.5 right-2.5 rounded-lg border p-1.5",
          "text-faint hover:text-foreground opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100",
        )}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
