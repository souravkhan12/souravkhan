import { CodeBlock } from "@/components/blog/copy-code-button";
import { Callout } from "@/components/blog/callout";
import { Aside } from "@/components/blog/aside";
import { Demo } from "@/components/blog/demo";
import { cn } from "@/lib/utils";

import {
  RenderingPipeline,
  ScriptBlockingPlayground,
  BlockingCheatSheet,
  RenderTreeMerge,
} from "@/components/mdx/BrowserRenderingDiagrams";
import {
  ProtocolTimeline,
  HeadOfLineBlocking,
  HandshakeCost,
  ProtocolCheatSheet,
  StatusCodeCheatSheet,
} from "@/components/mdx/Httpversiondiagrams";

export const mdxComponents = {
  pre: CodeBlock,
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className={cn("font-mono", className)} {...props} />
  ),
  // Available inside any .mdx post without an import.
  Callout,
  Aside,
  Demo,
  RenderingPipeline,
  ScriptBlockingPlayground,
  BlockingCheatSheet,
  RenderTreeMerge,
  ProtocolTimeline,
  HeadOfLineBlocking,
  HandshakeCost,
  ProtocolCheatSheet,
  StatusCodeCheatSheet,
};
