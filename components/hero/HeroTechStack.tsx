import { HERO_TECH_STACK } from "@/config/data";
import { GridBand, GridCell } from "@/components/ui";
import TextIcon from "@/components/tech-stack/TextIcon";

/**
 * One quiet band of chips rather than a grid of full-height cells — twelve
 * items at cell scale dominated the page; as inline chips they read as what
 * they are, a list of tools.
 */
export default function HeroTechStack() {
  return (
    <GridBand cols="grid-cols-1">
      <GridCell className="flex flex-wrap gap-2 py-6">
        {HERO_TECH_STACK.map((tech) => (
          <span
            key={tech.name}
            className="border-border hover:border-blue inline-flex items-center gap-2 border px-3 py-1.5 text-xs transition-colors"
          >
            <TextIcon label={tech.icon} size={14} colorful />
            {tech.name}
          </span>
        ))}
      </GridCell>
    </GridBand>
  );
}
