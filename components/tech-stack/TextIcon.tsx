import {
  SiCplusplus,
  SiCss3,
  SiHtml5,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiThirdweb,
  SiGithubactions,
  SiAmazon,
} from "react-icons/si";

import { TECH_COLORS } from "@/config/tech-colors";

type TextIconProps = {
  label: string;
  size?: number;
  className?: string;
  colorful?: boolean;
};

const ICON_MAP: Record<string, React.ReactNode> = {
  react: <SiReact />,
  typescript: <SiTypescript />,
  redux: <SiRedux />,
  next: <SiNextdotjs />,
  cpp: <SiCplusplus />,
  mongodb: <SiMongodb />,
  sql: <SiMysql />,
  node: <SiNodedotjs />,
  html: <SiHtml5 />,
  css: <SiCss3 />,
  tailwind: <SiTailwindcss />,
  thirdweb: <SiThirdweb />,
  github: <SiGithubactions />,
  aws: <SiAmazon />,
};

export default function TextIcon({
  label,
  size = 16,
  className = "",
  colorful = false,
}: TextIconProps) {
  const Icon = ICON_MAP[label.toLowerCase()];
  if (!Icon) return null;

  const color = colorful ? TECH_COLORS[label.toLowerCase()] : undefined;

  return (
    <span
      className={`inline-flex items-center leading-none ${className}`}
      style={{ fontSize: size, color }}
      aria-hidden
    >
      {Icon}
    </span>
  );
}
