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
  DotGrid,
  VertexSquare,
} from "@/components/ui";
import { AvailabilityBadge } from "@/components/hero/AvailabilityBadge";
import { SocialRail } from "@/components/hero/SocialRail";
import { useInitialAnimation } from "@/hooks/use-initial-animation";

export default function Hero() {
  const shouldAnimate = useInitialAnimation();

  return (
    <GridBand
      id="about"
      cols="grid-cols-1 lg:grid-cols-[1.6fr_1fr]"
      className="border-t-0"
    >
      <GridCell className="order-2 flex flex-col justify-center gap-7 py-16 sm:py-20 lg:order-1">
        <AvailabilityBadge text="available for work" />

        {/* Transform-only entrance, and no delay.
            This <h1> is the page's LCP element. `motion` inlines its `initial`
            styles into the server HTML, so animating from opacity:0 behind a
            150ms delay meant the headline wasn't merely late — it stayed
            unpainted until hydration finished, then took another 320ms to
            fade. Translate and blur are compositor-only and don't gate the
            paint, so the movement survives and the LCP cost doesn't. */}
        <motion.h1
          initial={shouldAnimate ? { y: 6, filter: "blur(6px)" } : false}
          animate={{ y: 0, filter: "blur(0px)" }}
          transition={{ duration: MOTION.duration.slow, ease: MOTION.ease }}
          className="ss01 normal-case-force hero-title font-semilight"
        >
          <span className="font-pixel hero-wordmark">{HERO.name}</span>
          <br />
          <span className="text-soft">{HERO.title}</span>
        </motion.h1>

        <motion.p
          initial={shouldAnimate ? { opacity: 0, y: 3 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: MOTION.duration.slow,
            delay: 0.1,
            ease: MOTION.ease,
          }}
          className="text-soft max-w-xl text-base text-pretty"
        >
          {HERO.bio}
        </motion.p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <motion.div {...INTERACTIONS.button} className="w-full sm:w-auto">
            <Button asChild variant="default" size="sm">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="w-full sm:w-auto"
              >
                get in touch
              </a>
            </Button>
          </motion.div>

          <motion.div {...INTERACTIONS.button} className="w-full sm:w-auto">
            <Button asChild variant="outline" size="sm">
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

        <a
          href="#arcade"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("arcade")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="hover:text-blue group text-soft inline-flex w-fit items-center gap-2 text-sm transition-colors"
        >
          <span aria-hidden="true">🐍</span>
          feeling playful? play snake &amp; beat the high score
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
      </GridCell>

      <GridCell
        padded={false}
        tinted
        className="relative order-1 min-h-[360px] lg:order-2"
      >
        <DotGrid />
        <DiagonalLine direction="tl-br" />
        <DiagonalLine direction="tr-bl" />
        <VertexSquare corner="top-left" />
        {/* Also transform-only: the portrait is the other LCP candidate, and
            fading it in from opacity:0 on a 450ms delay was cancelling out the
            `priority` + `fetchPriority="high"` hints on the image inside. */}
        <motion.div
          initial={shouldAnimate ? { scale: 0.98 } : false}
          animate={{ scale: 1 }}
          transition={{
            duration: MOTION.duration.slow,
            delay: 0.1,
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
            {/* links ride the bottom edge of the frame */}
            <SocialRail className="absolute -bottom-5 left-1/2 -translate-x-1/2" />
          </div>
        </motion.div>
      </GridCell>
    </GridBand>
  );
}
