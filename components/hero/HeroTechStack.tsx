import { HERO_TECH_STACK } from "@/config/data";
import { GridBand, GridCell } from "@/components/ui";
import TextIcon from "@/components/tech-stack/TextIcon";

export default function HeroTechStack() {
  return (
    <GridBand cols="grid-cols-2 sm:grid-cols-4">
      {HERO_TECH_STACK.map((tech, i) => (
        <GridCell
          key={tech.name}
          padded={false}
          tinted={i % 2 === 1}
          className="flex items-center gap-3 px-8 py-6 transition-colors hover:bg-gray-50 dark:hover:bg-black"
        >
          <TextIcon label={tech.icon} size={18} colorful />
          <span className="text-sm font-medium">{tech.name}</span>
        </GridCell>
      ))}
    </GridBand>
  );
}
