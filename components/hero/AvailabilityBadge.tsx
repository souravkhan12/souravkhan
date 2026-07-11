import { MotionSpan } from "@/components/ui/motion-wrapper";
import { MOTION } from "@/config/theme";

interface AvailabilityBadgeProps {
  text: string;
}

export function AvailabilityBadge({ text }: AvailabilityBadgeProps) {
  return (
    <span className="border-border inline-flex w-fit items-center gap-2 border px-3 py-1.5 text-xs font-medium lowercase">
      <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
        {/* 3s duration with 1s delay steps keeps the three ripples evenly spaced */}
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
              duration: MOTION.duration.slow * 10,
              repeat: Infinity,
              delay: delay,
              ease: MOTION.ease,
              times: [0, 0.2, 1],
            }}
            style={{ willChange: "transform, opacity" }}
          />
        ))}

        <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>

      <span className="leading-none">{text}</span>
    </span>
  );
}
