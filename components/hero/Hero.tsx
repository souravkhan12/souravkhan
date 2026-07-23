"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { HERO, CONTACT_INFO } from "@/config/data";
import { MOTION, INTERACTIONS } from "@/config/theme";
import {
  Button,
  GridBand,
  GridCell,
  DiagonalLine,
  VertexSquare,
} from "@/components/ui";
import { AvailabilityBadge } from "@/components/hero/AvailabilityBadge";
import { useInitialAnimation } from "@/hooks/use-initial-animation";

export default function Hero() {
  const shouldAnimate = useInitialAnimation();

  return (
    <GridBand
      id="about"
      cols="grid-cols-1 lg:grid-cols-[1.6fr_1fr]"
      className="border-t-0"
    >
      <GridCell className="order-2 flex flex-col justify-center gap-6 py-12 sm:py-16 lg:order-1">
        <AvailabilityBadge text="available for work" />

        <motion.h1
          initial={
            shouldAnimate ? { opacity: 0, y: 6, filter: "blur(10px)" } : false
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: MOTION.duration.slow,
            delay: 0.15,
            ease: MOTION.ease,
          }}
          className="ss01 normal-case-force font-semilight text-2xl leading-[1.05] tracking-[-0.02em] sm:text-3xl lg:text-4xl"
        >
          {HERO.name}
          <br />
          <span className="bg-gradient-to-r from-[#5d8cd7] via-[#8b5cf6] to-[#10b981] bg-clip-text text-transparent">
            {HERO.title}
          </span>
        </motion.h1>

        <motion.p
          initial={shouldAnimate ? { opacity: 0, y: 3 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: MOTION.duration.slow,
            delay: 0.3,
            ease: MOTION.ease,
          }}
          className="max-w-xl text-base text-pretty text-gray-600 dark:text-gray-400"
        >
          {HERO.bio}
        </motion.p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <motion.div {...INTERACTIONS.button} className="w-full sm:w-auto">
            <Button asChild variant="gradient">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="w-full sm:w-auto"
              >
                get in touch
              </a>
            </Button>
          </motion.div>

          <motion.div {...INTERACTIONS.button} className="w-full sm:w-auto">
            <Button asChild variant="outline">
              <a
                href={CONTACT_INFO.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                resume
              </a>
            </Button>
          </motion.div>
        </div>
      </GridCell>

      <GridCell
        padded={false}
        tinted
        className="relative order-1 min-h-[320px] overflow-hidden lg:order-2"
      >
        {/* animated aurora — brings colour and life behind the portrait */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <motion.div
            className="absolute -top-8 -left-6 size-44 rounded-full bg-blue-400/30 blur-3xl dark:bg-blue-500/25"
            animate={{ x: [0, 28, 0], y: [0, 22, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 -right-6 size-48 rounded-full bg-violet-500/25 blur-3xl"
            animate={{ x: [0, -26, 0], y: [0, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/4 size-44 rounded-full bg-emerald-400/25 blur-3xl"
            animate={{ x: [0, 22, 0], y: [0, -22, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <DiagonalLine direction="tl-br" />
        <DiagonalLine direction="tr-bl" />
        <VertexSquare corner="top-left" />
        <motion.div
          initial={shouldAnimate ? { opacity: 0, scale: 0.98 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: MOTION.duration.slow,
            delay: 0.45,
            ease: MOTION.ease,
          }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          <div className="border-border relative h-[260px] w-[210px] border sm:h-[300px] sm:w-[240px]">
            <Image
              src="/sourav.webp"
              alt={HERO.name}
              fill
              fetchPriority="high"
              priority={true}
              className="object-cover"
              sizes="(max-width: 640px) 210px, 240px"
            />
          </div>
        </motion.div>
      </GridCell>
    </GridBand>
  );
}
