"use client";

import { motion } from "motion/react";
import { HERO, CONTACT_INFO } from "@/constants/data";
import { LAYOUT } from "@/constants/styles";
import { Button } from "@/components/ui";
import Avatar from "@/components/ui/Avatar";
import Location from "./ui/Location";

export default function Hero() {
  return (
    <section id="about" className={LAYOUT.section}>
      <div className="mx-auto flex flex-col justify-between gap-12 px-6 py-10 lg:gap-20">
        <div>
          <Avatar />
          <Location />
        </div>

        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl leading-tight font-bold tracking-tight text-[#3E4959] dark:text-white"
          >
            Hi, I&apos;m <span className="">{HERO.name}</span>
            <span className="text-[#8F8F91]"> Software Engineer</span>
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
          <div className="mt-6 flex gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <Button
                as="a"
                href={`mailto:${CONTACT_INFO.email}`}
                variant="primary"
                size="md"
              >
                Get In Touch
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <Button
                as="a"
                href={CONTACT_INFO.resume}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="md"
              >
                Resume
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
