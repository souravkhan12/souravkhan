import { CodeBlock } from "@/components/blog/copy-code-button";
import { cn } from "@/lib/utils";

export const mdxComponents = {
  pre: CodeBlock,
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className={cn("font-mono", className)} {...props} />
  ),
};
