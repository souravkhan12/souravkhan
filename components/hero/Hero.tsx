"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { HERO, CONTACT_INFO, SOCIAL_LINKS } from "@/config/data";
import { MOTION } from "@/config/theme";
import { LocalTime } from "@/components/home/LocalTime";
import { useInitialAnimation } from "@/hooks/use-initial-animation";

const pill =
  "inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm transition-colors";

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
        <div className="flex items-center gap-3.5">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
            <Image
              src="/sourav.webp"
              alt={HERO.name}
              fill
              priority
              fetchPriority="high"
              sizes="48px"
              className="object-cover"
            />
          </div>
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
        className="mt-10 text-[30px] leading-[1.15] font-bold tracking-[-0.03em] text-balance sm:mt-12 sm:text-[42px]"
      >
        {HERO.headline} <span className="text-faint">{HERO.headlineMuted}</span>
      </motion.h1>

      <div className="mt-9 flex flex-wrap gap-2.5">
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`${pill} bg-foreground text-background border-foreground font-semibold hover:opacity-85`}
        >
          Get in touch
        </a>
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pill} border-border hover:border-foreground`}
          >
            {label} <span aria-hidden="true">&nbsp;↗</span>
          </a>
        ))}
      </div>
    </header>
  );
}
