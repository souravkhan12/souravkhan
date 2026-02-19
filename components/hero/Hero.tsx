"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { HERO, CONTACT_INFO } from "@/config/data";
import { LAYOUT } from "@/config/styles";
import { MOTION, MOTION_VARIANTS, INTERACTIONS } from "@/config/theme";
import { Button } from "@/components/ui";
import { AvailabilityBadge } from "@/components/hero/AvailabilityBadge";
import { useInitialAnimation } from "@/hooks/use-initial-animation";

export default function Hero() {
  const shouldAnimate = useInitialAnimation();

  return (
    <section id="about" className={LAYOUT.section}>
      <div className="mx-auto flex flex-col-reverse items-center justify-between gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:gap-20 lg:py-16">
        <div className="max-w-xl space-y-6">
          <AvailabilityBadge text="Available for Work" />

          <motion.h1
            initial={
              shouldAnimate ? { opacity: 0, y: 6, filter: "blur(10px)" } : false
            }
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: MOTION.duration.slow,
              delay: 0.15,
              ease: MOTION.ease,
            }}
            viewport={{ once: true, amount: 0.1 }}
            className="text-3xl leading-tight font-semibold tracking-tight text-[#3E4959] sm:text-4xl dark:text-white"
          >
            Hi, I&apos;m <span className="">{HERO.name} -</span>
            <span className="font-extrabold text-[#8F8F91]">{HERO.title}</span>
          </motion.h1>

          {/* Bio */}
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 3 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: MOTION.duration.slow,
              delay: 0.3,
              ease: MOTION.ease,
            }}
            viewport={{ once: true, amount: 0.1 }}
            className={LAYOUT.subheading}
          >
            {HERO.bio}
          </motion.p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <motion.div {...INTERACTIONS.button} className="w-full sm:w-auto">
              <Button asChild variant="default" size="default">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="w-full sm:w-auto"
                >
                  Get In Touch
                </a>
              </Button>
            </motion.div>

            <motion.div {...INTERACTIONS.button} className="w-full sm:w-auto">
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
        </div>

        {/* Hero Image */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, scale: 0.95 } : false}
          whileInView={{ opacity: 1, scale: 1 }}
          {...INTERACTIONS.card}
          transition={{
            duration: MOTION.duration.slow,
            delay: 0.5,
            ease: MOTION.ease,
          }}
          viewport={{ once: true, amount: 0.1 }}
          className="flex h-[280px] w-[220px] justify-center rounded-2xl border border-gray-300/30 bg-white/30 shadow-inner backdrop-blur-lg transition-all duration-300 ease-out hover:scale-105 sm:h-[300px] sm:w-60 md:h-[330px] md:w-[280px] dark:border-white/10 dark:bg-[#1E1E1E]"
        >
          <div className="relative h-full w-full">
            <Image
              src="/sourav.webp"
              alt={HERO.name}
              fill
              fetchPriority="high"
              priority={true}
              className="rounded-2xl object-cover"
              sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, (max-width: 1024px) 280px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
