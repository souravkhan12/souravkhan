import Image from "next/image";
import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import TechStack from "./Techstack";

interface projectInfo {
  id: number;
  title: string;
  info: string;
  src: string;
  link: string;
  code: string;
}

const techonology = [
  ["cpp", "react", "node", "html", "tailwind", "sql", "next"],
  ["react", "redux", "css", "html"],
  ["react", "cpp", "node", "mongodb", "sql"],
  ["react", "cpp", "node", "mongodb", "sql"],
  ["react", "cpp", "node", "mongodb", "sql"],
];

export default function ProjectCard({
  id,
  title,
  info,
  src,
  link,
  code,
}: projectInfo) {
  return (
    <div className="flex w-[90%] flex-col items-center justify-center gap-20 rounded-2xl bg-white p-6 md:flex-row">
      <div className="group relative h-60 w-full self-stretch overflow-hidden rounded-xl border border-gray-200 md:w-[400px]">
        <Image src={src} alt={`${title} image`} fill className="object-fill" />
      </div>

      <div className="flex-1">
        <h1 className="mb-5 text-xl dark:text-gray-100">{title}</h1>
        <p className="mb-5 justify-items-start text-sm leading-relaxed font-normal text-gray-500 dark:text-gray-300">
          {info}
        </p>
        <div className="flex justify-between gap-10">
          <TechStack arr={techonology[id]} />
          <div className="flex items-end gap-4">
            <Link
              href={link}
              target="_blank"
              className="rounded-full bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-900"
            >
              <SiGithub />
            </Link>
            <Link
              href={code}
              target="_blank"
              className="rounded-full bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-900"
            >
              <LuExternalLink />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
