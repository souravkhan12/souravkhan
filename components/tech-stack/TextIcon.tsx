"use client";

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

type TextIconProps = {
  label: string;
  size?: number;
};

export default function TextIcon({ label, size = 15 }: TextIconProps) {
  const icons = [
    { icon: <SiReact />, label: "react", color: "#61DAFB" },
    { icon: <SiTypescript />, label: "typescript", color: "#3178C6" },
    { icon: <SiRedux />, label: "redux", color: "#764ABC" },
    { icon: <SiNextdotjs />, label: "next", color: "#000000" },
    { icon: <SiCplusplus />, label: "cpp", color: "#00599C" },
    { icon: <SiMongodb />, label: "mongodb", color: "#13AA52" },
    { icon: <SiMysql />, label: "sql", color: "#00758F" },
    { icon: <SiNodedotjs />, label: "node", color: "#339933" },
    { icon: <SiHtml5 />, label: "html", color: "#E34C26" },
    { icon: <SiCss3 />, label: "css", color: "#1572B6" },
    { icon: <SiTailwindcss />, label: "tailwind", color: "#06B6D4" },
    { icon: <SiThirdweb />, label: "thirdweb", color: "#E500FF" },
    { icon: <SiGithubactions />, label: "github", color: "#2088FF" },
    { icon: <SiAmazon />, label: "aws", color: "#FF9900" },
  ];

  const match = icons.find(
    (i) => i.label.toLowerCase() === label.toLowerCase(),
  );

  return match ? (
    <span
      className="transition-transform"
      style={{ color: match.color, fontSize: size }}
    >
      {match.icon}
    </span>
  ) : null;
}
