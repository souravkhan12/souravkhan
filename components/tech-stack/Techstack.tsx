import TextIcon from "@/components/tech-stack/TextIcon";

interface TechStackProps {
  technologies: string[];
  colorful?: boolean;
}

export default function TechStack({
  technologies,
  colorful = false,
}: TechStackProps) {
  return (
    <ul className="mt-3 flex list-none flex-wrap gap-2">
      {technologies.map((tech, index) => (
        <li key={index}>
          <div className="border-border inline-flex items-center gap-1.5 border px-2 py-1">
            <TextIcon label={tech} colorful={colorful} />
            <span className="text-xs font-medium">{tech}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
