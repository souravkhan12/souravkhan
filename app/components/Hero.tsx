"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 ">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between gap-12 px-6">
        <div className="max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1 bg-white shadow-sm"
          >
            <MapPin className="w-4 h-4 text-[#6366f1]" />
            <span className="text-sm font-medium text-gray-600">
              Ambala, India
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-6xl font-extrabold tracking-tight leading-tight text-gray-900"
          >
            Hi, I'm
            <span className="bg-gradient-to-r from-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
              Sourav Khan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            A goal-driven Software Engineer building sleek, scalable, modern web
            experiences with React, Next.js, and top-tier front-end stacks.
          </motion.p>

          <div className="flex gap-4 mt-6">
            <motion.a
              href="mailto:souravkhan654@gmail.com"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="inline-flex items-center px-3 py-2 rounded-lg  text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-shadow shadow-md hover:shadow-lg"
            >
              Get In Touch
            </motion.a>

            <motion.a
              href="#"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="inline-flex items-center px-3 py-2 rounded-lg  text-gray-900 border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-shadow shadow-sm hover:shadow-md"
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
          <div className="relative overflow-hidden p-4 bg-transparent">
            <Image
              src="/3dChar.png"
              alt="3D Character"
              width={340}
              height={340}
              className="rounded-xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
