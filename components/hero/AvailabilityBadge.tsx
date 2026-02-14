import { MotionSpan } from "@/components/ui/motion-wrapper";
import { Dot } from "lucide-react";
import { Badge } from "@/components/ui";

interface AvailabilityBadgeProps {
  text: string;
}

export function AvailabilityBadge({ text }: AvailabilityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
    >
      {/* live indicator */}
      <MotionSpan
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center text-emerald-500"
      >
        <Dot size={8} strokeWidth={5} />
      </MotionSpan>

      <span className="leading-none">{text}</span>
    </Badge>
  );
}
