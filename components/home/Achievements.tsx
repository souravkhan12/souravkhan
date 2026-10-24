import { ACHIEVEMENTS } from "@/config/data";
import { HomeSection } from "@/components/home/HomeSection";
import { HoverList, HoverItem } from "@/components/motion/hover-list";
import { CountUp } from "@/components/motion/count-up";

export function Achievements() {
  if (ACHIEVEMENTS.length === 0) return null;

  return (
    <HomeSection id="achievements" label="Achievements">
      <HoverList className="flex flex-col">
        {ACHIEVEMENTS.map(({ metric, text, href }) => (
          <HoverItem key={text} itemKey={text}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-4 py-2.5 text-sm"
            >
              <CountUp
                value={metric}
                className="w-14 shrink-0 font-bold tabular-nums"
              />
              <span className="text-soft group-hover:text-foreground min-w-0 transition-colors">
                {text}
                <span
                  aria-hidden="true"
                  className="text-faint group-hover:text-blue ml-1.5 transition-colors"
                >
                  ↗
                </span>
              </span>
            </a>
          </HoverItem>
        ))}
      </HoverList>
    </HomeSection>
  );
}
