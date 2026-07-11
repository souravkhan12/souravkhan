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
    <div className="group relative">
      <pre
        ref={preRef}
        className={cn(
          "font-code text-[13px]! leading-relaxed sm:text-sm!",
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
          "absolute top-2.5 right-2.5 rounded-md border border-white/10 bg-white/5 p-1.5",
          "text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:text-gray-100",
        )}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
