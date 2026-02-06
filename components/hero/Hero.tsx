"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { HERO, CONTACT_INFO } from "@/config/data";
import { LAYOUT } from "@/config/styles";
import { Button } from "@/components/ui";
import HeroTechStack from "@/components/hero/HeroTechStack";

export default function Hero() {
  return (
    <section id="about" className={LAYOUT.section}>
      <div className="mx-auto flex flex-col-reverse items-center justify-between gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:gap-20 lg:py-16">
        <div className="max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-green-500 bg-green-50 px-2 py-1 dark:border-green-400 dark:bg-green-900/30"
          >
            <motion.span
              initial={{ filter: "blur(10px)" }}
              animate={{ filter: "blur(0px)" }}
              className="text-xs text-green-700 dark:text-green-300"
            >
              {HERO.available}
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-3xl leading-tight font-semibold tracking-tight text-[#3E4959] sm:text-4xl dark:text-white"
          >
            Hi, I&apos;m <span className="">{HERO.name} -</span>
            <span className="font-extrabold text-[#8F8F91]">{HERO.title}</span>
          </motion.h1>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={LAYOUT.subheading}
          >
            {HERO.bio}
          </motion.p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="w-full sm:w-auto"
            >
              <Button asChild variant="default" size="default">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="w-full sm:w-auto"
                >
                  Get In Touch
                </a>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="w-full sm:w-auto"
            >
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a
                  href={CONTACT_INFO.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  Resume
                </a>
              </Button>
            </motion.div>
          </div>
          <HeroTechStack />
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex h-[280px] w-[220px] justify-center rounded-2xl border border-gray-300/30 bg-white/30 shadow-inner backdrop-blur-lg transition-all duration-300 ease-out hover:scale-105 sm:h-[300px] sm:w-[240px] md:h-[330px] md:w-[280px] dark:border-white/10 dark:bg-[#1E1E1E]"
        >
          <div className="relative h-full w-full">
            <Image
              src="/sourav.png"
              alt={HERO.name}
              fill
              fetchPriority="high"
              className="rounded-2xl object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
