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

export const metadata = {
  title: "Projects | React & NextJS Developer",
  description:
    "Hi, I'm Sourav Khan — a goal-driven Software Engineer building sleek, scalable, modern web experiences with React, Next.js, and C++.",
  canonical: "https://portfolio-souravkhan.vercel.app/",
  openGraph: {
    url: "https://portfolio-souravkhan.vercel.app/",
    title: "Sourav Khan | React & NextJS Developer",
    description:
      "Goal-driven software engineer delivering modern, performant React and NextJS applications.",
    images: [
      {
        url: "https://portfolio-souravkhan.vercel.app/preview.png",
        width: 1200,
        height: 630,
        alt: "Portfolio preview image",
      },
    ],
    site_name: "Sourav Khan Portfolio",
  },
  twitter: {
    handle: "@souravkhan654",
    site: "@souravkhan654",
    cardType: "summary_large_image",
  },
};

export default function ProjectCard({
  id,
  title,
  info,
  src,
  link,
  code,
}: projectInfo) {
  return (
    <div className="flex flex-col items-center justify-center gap-20 rounded-2xl bg-white p-6 lg:flex-row dark:bg-[#1E1E1E]">
      <div className="group relative h-60 w-full self-stretch overflow-hidden rounded-xl border border-gray-200 lg:w-[400px] dark:border-gray-700">
        <Image
          src={src}
          alt={`${title} image`}
          fill
          className="rounded-2xl object-cover transition-transform duration-500 ease-in-out hover:scale-105"
        />
      </div>

      <div className="flex-1">
        <h1 className="mb-5 text-xl dark:text-gray-100">{title}</h1>
        <p className="mb-5 justify-items-start text-sm leading-relaxed font-normal text-gray-500 dark:text-gray-300">
          {info}
        </p>
        <div className="flex flex-col justify-between gap-10 md:flex-row">
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
