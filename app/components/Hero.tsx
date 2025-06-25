"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-60">
      <div className="mx-auto flex flex-col-reverse items-center justify-between gap-12 px-6 md:flex-row md:gap-20">
        <div className="max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 shadow-sm"
          >
            <MapPin className="h-4 w-4 text-[#6366f1]" />
            <span className="text-sm font-medium text-gray-600">
              Ambala, India
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          >
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
              Sourav Khan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg leading-relaxed text-gray-500"
          >
            A goal-driven Software Engineer building sleek, scalable, modern web
            experiences with React, Next.js, and top-tier front-end stacks.
          </motion.p>

          <div className="mt-6 flex gap-4">
            <motion.a
              href="mailto:souravkhan654@gmail.com"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="inline-flex items-center rounded-lg bg-gray-900 px-3 py-2 text-white shadow-md transition-shadow hover:bg-gray-800 hover:shadow-lg focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none"
            >
              Get In Touch
            </motion.a>

            <motion.a
              href="#"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition-shadow hover:bg-gray-50 hover:shadow-md focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
            >
              Resume
            </motion.a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="rounded-3xl border border-gray-300/30 bg-white/30 shadow-inner backdrop-blur-lg transition-all duration-300 ease-out hover:scale-105 dark:border-white/10 dark:bg-white/5"
          >
            <Image
              src="/3dChar.png"
              alt="3D Character"
              width={280}
              height={280}
              priority={true}
              className="rounded-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
