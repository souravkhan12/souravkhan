"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useDarkMode } from "../context/useDarkMode";


export default function Hero() {
  const { isDarkMode } = useDarkMode();

  return (
    <section
      id="about"
      className="relative overflow-hidden py-30 transition-colors duration-300 md:py-60"
    >
      <div className="mx-auto flex flex-col-reverse items-center justify-between gap-12 px-6 md:flex-row md:gap-20">
        <div className="max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 shadow-sm dark:border-gray-600 dark:bg-[#1E1E1E]"
          >
            <MapPin className="h-4 w-4 text-[#6366f1]" />
            <motion.span
              initial={{ filter: "blur(10px)" }}
              animate={{ filter: 0 }}
              className="text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Ambala, India
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white"
          >
            Hi, I&apos;m
            <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
              Sourav Khan
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg leading-relaxed text-gray-500 dark:text-gray-400"
          >
            I&apos;m a full stack Software Engineer. I am passionate about creating a user-centered design, gathering and translating user data into design decisions and products.
          </motion.p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <motion.a
              href="mailto:souravkhan654@gmail.com"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-white shadow-md transition-all focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none dark:bg-gray-500 dark:text-black"
            >
              Get In Touch
            </motion.a>

            <motion.a
              href="https://drive.google.com/file/d/15ZKQIpxMwyAByP5361XmVqkTv-4mb-wH/view?usp=sharing"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition-all hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-[#1E1E1E] dark:text-gray-100 dark:hover:bg-[#2a2a2a]"
            >
              Resume
            </motion.a>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex h-[300px] w-[250px] justify-center rounded-3xl border border-gray-300/30 bg-white/30 shadow-inner backdrop-blur-lg transition-all duration-300 ease-out hover:scale-105 sm:h-[250px] sm:w-[200px] md:h-[330px] md:w-[280px] dark:border-white/10 dark:bg-[#1E1E1E]"
        >
          <div className="relative h-full w-full">
            {isDarkMode ? (
              <Image
                src="/3dChar.png"
                alt="3D Character"
                fill
                priority
                className="rounded-2xl object-contain"
              />
            ) : (
              <Image
                src="/3dCharW.png"
                alt="3D Character"
                fill
                priority
                className="rounded-2xl object-cover"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
