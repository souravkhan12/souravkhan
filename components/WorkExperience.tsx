"use client";

import { motion, useScroll } from "motion/react";
import TechStack from "./Techstack";
import { useRef } from "react";

const Work = [
  [
    "Built a real-time monitoring system for 100K+ TV models and 50+ languages, improving system efficiency by 30%. Developed Pvod DevTool for profiling 3 streaming apps, cutting manual effort by 80%.",
  ],
  [
    "Created dynamic, responsive UIs using React, Redux, and React Query.Optimized frontend performance with code splitting and lazy loading.",
  ],
  [
    "Solved 100+ advanced academic problems in DSA, DBMS, and OS with a 98% approval rating.",
  ],
];
const techonology = [
  ["cpp", "react", "node", "html", "tailwind", "sql", "next"],
  ["react", "redux", "css", "html"],
  ["react", "cpp", "node", "mongodb", "sql"],
];
const Heading = ["Samsung", "OriginCore", "Chegg"];
const Date = ["sep 2024-sep 2025", "feb 2023 - july 2023", ""];
const Position = [
  "Software Engineer",
  "Frontend Developer",
  "Subject Matter Expert (SME)",
];

export default function WorkExperience() {
  const targetRef = useRef(null);

  return (
    <section
      id="experience"
      ref={targetRef}
      className="relative flex w-full flex-row justify-center gap-2 py-5 lg:py-16"
    >
      <div>
        <motion.h2 className="mb-12 text-xl text-gray-500 dark:text-gray-100">
          Work Experience
        </motion.h2>

        <div className="space-y-12">
          {Work.map((work, index) => (
            <motion.div
              key={index}
              className="rounded-xl border border-gray-200 bg-white/80 p-6 font-semibold backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-800/70"
            >
              <h3 className="mb-4 text-2xl text-zinc-700 dark:text-gray-100">
                {Heading[index]}
              </h3>
              <div className="flex gap-2 pb-2">
                <p className="mb-2 text-gray-600 dark:text-gray-300">
                  {Position[index]}
                </p>
                <p className="mb-2 text-sm font-normal text-gray-500 dark:text-gray-300">
                  {Date[index]}
                </p>
              </div>

              <ul className="list-disc space-y-4">
                {work.map((item, idx) => (
                  <li
                    key={idx}
                    className="list-none justify-items-start leading-relaxed font-normal text-gray-500 dark:text-gray-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <TechStack arr={techonology[index]} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
