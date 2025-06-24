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
} from "react-icons/si";

type TextIconProps = {
  label: string;
};

export default function TextIcon({ label }: TextIconProps) {
  const icons = [
    { icon: <SiReact />, label: "react" },
    { icon: <SiTypescript />, label: "typescript" },
    { icon: <SiRedux />, label: "redux" },
    { icon: <SiNextdotjs />, label: "next" },
    { icon: <SiCplusplus />, label: "cpp" },
    { icon: <SiMongodb />, label: "mongodb" },
    { icon: <SiMysql />, label: "sql" },
    { icon: <SiNodedotjs />, label: "node" },
    { icon: <SiHtml5 />, label: "html" },
    { icon: <SiCss3 />, label: "css" },
    { icon: <SiTailwindcss />, label: "tailwind" },
  ];

  const match = icons.find(
    (i) => i.label.toLowerCase() === label.toLowerCase(),
  );

  return match ? match.icon : null;
}
