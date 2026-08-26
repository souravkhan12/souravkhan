import { CodeBlock } from "@/components/blog/copy-code-button";
import { Callout } from "@/components/blog/callout";
import { Aside } from "@/components/blog/aside";
import { Demo } from "@/components/blog/demo";
import { Term } from "@/components/blog/term";
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
import {
  ProxyTrapFlow,
  TrapCheatSheet,
  ProxyBasicsDemo,
  ProxyValidationDemo,
  ProxyReceiverDemo,
  ProxyApplyDemo,
} from "@/components/mdx/ProxyPatternDiagrams";
import {
  FormatLadder,
  ResponsivePicker,
  LoadingRace,
  PlaceholderPreview,
  MediaCheatSheet,
} from "@/components/mdx/MediaOptimizationDiagrams";
import {
  FontDisplayTimeline,
  FontDiscoveryChain,
  FallbackMatcher,
  FontCheatSheet,
} from "@/components/mdx/FontPerformanceDiagrams";
import {
  HarnessLoop,
  ContextBuilderPlayground,
  HarnessAnatomy,
} from "@/components/mdx/AgentHarnessDiagrams";

export const mdxComponents = {
  pre: CodeBlock,
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code className={cn("font-mono", className)} {...props} />
  ),
  // Available inside any .mdx post without an import.
  Callout,
  Aside,
  Demo,
  Term,
  RenderingPipeline,
  ScriptBlockingPlayground,
  BlockingCheatSheet,
  RenderTreeMerge,
  ProtocolTimeline,
  HeadOfLineBlocking,
  HandshakeCost,
  ProtocolCheatSheet,
  StatusCodeCheatSheet,
  ProxyTrapFlow,
  TrapCheatSheet,
  ProxyBasicsDemo,
  ProxyValidationDemo,
  ProxyReceiverDemo,
  ProxyApplyDemo,
  HarnessLoop,
  ContextBuilderPlayground,
  HarnessAnatomy,
  FormatLadder,
  ResponsivePicker,
  LoadingRace,
  PlaceholderPreview,
  MediaCheatSheet,
  FontDisplayTimeline,
  FontDiscoveryChain,
  FallbackMatcher,
  FontCheatSheet,
};
