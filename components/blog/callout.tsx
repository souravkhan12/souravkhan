import {
  LuInfo,
  LuTriangleAlert,
  LuLightbulb,
  LuCircleCheck,
} from "react-icons/lu";
import { cn } from "@/lib/utils";

const VARIANTS = {
  note: {
    icon: LuInfo,
    label: "note",
    tone: "border-blue/40 bg-blue/5 text-blue",
  },
  tip: {
    icon: LuLightbulb,
    label: "tip",
    tone: "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  },
  warn: {
    icon: LuTriangleAlert,
    label: "warning",
    tone: "border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400",
  },
  success: {
    icon: LuCircleCheck,
    label: "works",
    tone: "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  },
} as const;

/**
 * Inline highlight box for posts.
 *
 * Usage in MDX: <Callout type="warn" title="Gotcha">…</Callout>
 */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof VARIANTS;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, label, tone } = VARIANTS[type] ?? VARIANTS.note;

  return (
    <div className={cn("not-prose my-6 border px-5 py-4", tone)}>
      <div className="flex items-center gap-2">
        <Icon size={15} aria-hidden="true" />
        <span className="font-code text-[11px] tracking-wide uppercase">
          {title ?? label}
        </span>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300 [&>p]:m-0 [&>p+p]:mt-3">
        {children}
      </div>
    </div>
  );
}
