import type { IconType } from "react-icons";
import {
  SiAmazonwebservices,
  SiChakraui,
  SiClaude,
  SiCplusplus,
  SiCss3,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiGooglebigquery,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiReactquery,
  SiRedux,
  SiSass,
  SiSupabase,
  SiTailwindcss,
  SiTestinglibrary,
  SiThirdweb,
  SiTypescript,
  SiVercel,
  SiVite,
  SiZod,
} from "react-icons/si";
import {
  LuChartLine,
  LuCpu,
  LuDatabase,
  LuDrama,
  LuNetwork,
  LuServer,
  LuWaypoints,
  LuWorkflow,
} from "react-icons/lu";

type Tech = { name: string; icon: IconType; color?: string };

/**
 * One registry for every technology the site mentions — the homepage stack,
 * project cards, project pages, the résumé. Keys are normalised (lowercase,
 * letters and digits only), so "Next.js", "next" and "nextjs" all land on
 * the same entry, and the display name comes from here rather than from
 * whichever spelling the content file happened to use.
 *
 * Colours are brand colours, shown on hover only. Brands whose colour is
 * black or white get none, so they stay legible in both themes.
 */
const TECH: Record<string, Tech> = {
  react: { name: "React", icon: SiReact, color: "#58C4DC" },
  next: { name: "Next.js", icon: SiNextdotjs },
  typescript: { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  javascript: { name: "JavaScript", icon: SiJavascript, color: "#E5C400" },
  redux: { name: "Redux", icon: SiRedux, color: "#764ABC" },
  reduxtoolkit: { name: "Redux Toolkit", icon: SiRedux, color: "#764ABC" },
  tanstackquery: {
    name: "TanStack Query",
    icon: SiReactquery,
    color: "#FF4154",
  },
  tailwind: { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  recharts: { name: "Recharts", icon: LuChartLine, color: "#22B5BF" },
  jest: { name: "Jest", icon: SiJest, color: "#C21325" },
  reacttestinglibrary: {
    name: "React Testing Library",
    icon: SiTestinglibrary,
    color: "#E33332",
  },
  playwright: { name: "Playwright", icon: LuDrama, color: "#2EAD33" },
  node: { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  express: { name: "Express", icon: SiExpress },
  rest: { name: "REST", icon: LuServer },
  graphql: { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
  supabase: { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  aws: { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
  docker: { name: "Docker", icon: SiDocker, color: "#2496ED" },
  githubactions: {
    name: "GitHub Actions",
    icon: SiGithubactions,
    color: "#2088FF",
  },
  cicd: { name: "CI/CD", icon: LuWorkflow },
  dbms: { name: "DBMS", icon: LuDatabase },
  os: { name: "OS", icon: LuCpu },
  networking: { name: "Networking", icon: LuNetwork },
  distributedsystems: { name: "Distributed Systems", icon: LuWaypoints },
  html: { name: "HTML", icon: SiHtml5, color: "#E34F26" },
  css: { name: "CSS", icon: SiCss3, color: "#1572B6" },
  sass: { name: "Sass", icon: SiSass, color: "#CC6699" },
  cpp: { name: "C++", icon: SiCplusplus, color: "#00599C" },
  mongodb: { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  sql: { name: "SQL", icon: SiMysql, color: "#4479A1" },
  postgres: { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  bigquery: { name: "BigQuery", icon: SiGooglebigquery, color: "#669DF6" },
  prisma: { name: "Prisma", icon: SiPrisma },
  firebase: { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  git: { name: "Git", icon: SiGit, color: "#F05032" },
  vercel: { name: "Vercel", icon: SiVercel },
  vite: { name: "Vite", icon: SiVite, color: "#9135FF" },
  figma: { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  motion: { name: "Motion", icon: SiFramer, color: "#FFF312" },
  chakra: { name: "Chakra UI", icon: SiChakraui, color: "#319795" },
  thirdweb: { name: "thirdweb", icon: SiThirdweb, color: "#E500FF" },
  claude: { name: "Claude", icon: SiClaude, color: "#D97757" },
  zod: { name: "Zod", icon: SiZod, color: "#3E67B1" },
};

const ALIASES: Record<string, string> = {
  nextjs: "next",
  ts: "typescript",
  js: "javascript",
  rtk: "reduxtoolkit",
  reactquery: "tanstackquery",
  tanstack: "tanstackquery",
  tailwindcss: "tailwind",
  testinglibrary: "reacttestinglibrary",
  nodejs: "node",
  expressjs: "express",
  restapis: "rest",
  restapi: "rest",
  postgresql: "postgres",
  mysql: "sql",
  googlebigquery: "bigquery",
  framer: "motion",
  framermotion: "motion",
  chakraui: "chakra",
  c: "cpp",
};

export function lookupTech(label: string): Tech | undefined {
  const key = label.toLowerCase().replace(/[^a-z0-9]/g, "");
  return TECH[ALIASES[key] ?? key];
}

/**
 * A rounded chip with the technology's mark. Monochrome at rest; on hover the
 * chip takes on a soft wash of the brand colour and the icon picks up the
 * colour itself — nothing moves, so a row of them stays calm. See
 * .tech-chip in globals.css.
 */
export function TechChip({
  label,
  size = "sm",
}: {
  label: string;
  size?: "xs" | "sm";
}) {
  const tech = lookupTech(label);
  const Icon = tech?.icon;
  const name = tech?.name ?? label;

  return (
    <span
      style={
        tech?.color
          ? ({ "--brand": tech.color } as React.CSSProperties)
          : undefined
      }
      className={`tech-chip group/chip bg-surface text-soft hover:text-foreground inline-flex items-center gap-1.5 rounded-full transition-[color,background-color,box-shadow] duration-300 ease-out ${
        size === "xs" ? "text-2xs px-2 py-0.5" : "px-2.5 py-1 text-xs"
      }`}
    >
      {Icon && (
        <Icon
          aria-hidden="true"
          className={`shrink-0 transition-colors duration-300 ${
            size === "xs" ? "size-3" : "size-3.5"
          } ${tech?.color ? "group-hover/chip:text-[var(--brand)]" : ""}`}
        />
      )}
      {name}
    </span>
  );
}
