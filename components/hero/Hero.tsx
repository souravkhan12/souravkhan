"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { HERO, CONTACT_INFO, SOCIAL_LINKS } from "@/config/data";
import { MOTION } from "@/config/theme";
import { LocalTime } from "@/components/home/LocalTime";
import { useInitialAnimation } from "@/hooks/use-initial-animation";
import { Pill } from "@/components/motion/pill";
import { Annotation } from "@/components/motion/annotation";
import { FollowCursor } from "@/components/motion/follow-cursor";

const LINKS = [
  { label: "Resume", href: CONTACT_INFO.resume },
  { label: "GitHub", href: SOCIAL_LINKS.github },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
];

export default function Hero() {
  const shouldAnimate = useInitialAnimation();

  return (
    <header id="about" className="pt-10 pb-6 sm:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="relative flex items-center gap-3.5">
          <Annotation className="right-full mr-3">
            it follows
            <br />
            your cursor
          </Annotation>
          <FollowCursor className="shrink-0">
            <div className="relative size-12 overflow-hidden rounded-full bg-gray-100 shadow-[0_6px_16px_-6px_rgb(0_0_0/0.35)] dark:bg-gray-900">
              {/* sizes/quality above the 48px it renders at: a 48px source
                  goes soft once it's tilted and resampled, and on 2–3x
                  screens it was being upscaled. */}
              <Image
                src="/sourav.webp"
                alt={HERO.name}
                fill
                priority
                fetchPriority="high"
                sizes="144px"
                quality={90}
                className="object-cover object-[50%_30%]"
              />
            </div>
          </FollowCursor>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight">{HERO.name}</p>
            <p className="text-soft text-sm">{HERO.title}</p>
          </div>
        </div>

        <p className="font-code text-soft text-2xs flex items-center gap-2">
          <span
            aria-hidden="true"
            className="bg-blue ring-blue/20 size-2 rounded-full ring-4"
          />
          {CONTACT_INFO.city} · <LocalTime timeZone={CONTACT_INFO.timezone} />{" "}
          IST
        </p>
      </div>

      {/* Transform-only entrance, and no delay.
          This <h1> is the page's LCP element. `motion` inlines its `initial`
          styles into the server HTML, so animating from opacity:0 would keep
          the headline unpainted until hydration finished. Translate and blur
          are compositor-only and don't gate the paint. */}
      <motion.h1
        initial={shouldAnimate ? { y: 6, filter: "blur(6px)" } : false}
        animate={{ y: 0, filter: "blur(0px)" }}
        transition={{ duration: MOTION.duration.slow, ease: MOTION.ease }}
        className="mt-10 text-[30px] leading-[1.15] font-bold tracking-[-0.03em] text-balance sm:mt-12 sm:text-[40px]"
      >
        {HERO.headline} <span className="text-faint">{HERO.headlineMuted}</span>
      </motion.h1>

      {/* w-fit so `left-full` is the last button's edge, not the column's —
          the note points at the buttons, not at empty space. */}
      <div className="relative mt-9 flex w-fit max-w-full flex-wrap gap-2.5">
        <Annotation point="left" className="left-full ml-4">
          say hi —
          <br />
          any of these work
        </Annotation>
        <Pill
          href="#contact"
          variant="solid"
          magnetic
          arrow="right"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Get in touch
        </Pill>
        {LINKS.map(({ label, href }) => (
          <Pill key={label} href={href} external magnetic arrow="up-right">
            {label}
          </Pill>
        ))}
      </div>
    </header>
  );
}
