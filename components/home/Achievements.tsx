import { ACHIEVEMENTS } from "@/config/data";
import { HomeSection } from "@/components/home/HomeSection";

export function Achievements() {
  if (ACHIEVEMENTS.length === 0) return null;

  return (
    <HomeSection id="achievements" label="Achievements">
      <ul className="flex flex-col">
        {ACHIEVEMENTS.map(({ metric, text, href }) => (
          <li key={text}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-4 py-2 text-sm"
            >
              <span className="w-14 shrink-0 font-bold tabular-nums">
                {metric}
              </span>
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
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
