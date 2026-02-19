import { MotionSpan } from "@/components/ui/motion-wrapper";
import { Badge } from "@/components/ui";
import { MOTION } from "@/config/theme";

interface AvailabilityBadgeProps {
  text: string;
}

export function AvailabilityBadge({ text }: AvailabilityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
    >
      <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
        {/* We use 3s duration with 1s delay steps for perfect synchronization */}
        {[0, 1, 2].map((delay) => (
          <MotionSpan
            key={delay}
            className="absolute h-full w-full rounded-full bg-emerald-400/60"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              scale: [1, 2.5],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: MOTION.duration.slow * 10, // Slower duration for smoother ripple
              repeat: Infinity,
              delay: delay,
              ease: MOTION.ease,
              times: [0, 0.2, 1],
            }}
            style={{ willChange: "transform, opacity" }}
          />
        ))}

        {/* Center fixed dot */}
        <span className="relative z-10 h-2 w-2 rounded-full bg-emerald-500" />
      </span>

      <span className="leading-none">{text}</span>
    </Badge>
  );
}
