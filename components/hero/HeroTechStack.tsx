import { MotionDiv } from "@/components/ui/motion-wrapper";
import { HERO_TECH_STACK } from "@/config/data";
import { MOTION_VARIANTS } from "@/config/theme";
import TextIcon from "@/components/tech-stack/TextIcon";

export default function HeroTechStack() {
  return (
    <MotionDiv
      variants={MOTION_VARIANTS.containerStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-wrap gap-2"
    >
      {HERO_TECH_STACK.map((tech) => (
        <MotionDiv
          key={tech.name}
          variants={MOTION_VARIANTS.staggerItem}
          className="group border-border bg-card hover:border-foreground/20 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors"
        >
          <TextIcon label={tech.icon} size={16} colorful />
          <span className="text-foreground text-sm font-medium">
            {tech.name}
          </span>
        </MotionDiv>
      ))}
    </MotionDiv>
  );
}
