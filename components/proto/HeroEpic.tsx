// components/HeroEpic.tsx — Prototype: No Scroll, Pure On-Mount Animations
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import EmeraldShimmer from "@/components/ui/Buttons/EmeraldShimmer";
import { TextGenerateEffect } from "@/components/ui/TextEffects/TextGenerateEffect";
import GradientText from "@/components/ui/TextEffects/GradientText";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.6,
      delayChildren: 0.3,
    },
  },
};

const childVariant = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeInOut" as const } },
};

export default function HeroEpic() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h2 variants={childVariant} className="text-3xl md:text-3xl lg:text-4xl font-black text-white tracking-wider uppercase">
            Whosoever holds this hammer...
          </motion.h2>

          <motion.h2 variants={childVariant} className="text-3xl md:text-4xl lg:text-4xl font-black text-white tracking-wider uppercase mt-4">
            if he be worthy, shall possess the power of
          </motion.h2>

          <motion.div variants={childVariant} className="mt-8">
            <GradientText
              colors={["#FFCC11", "#FFAA00", "#FF8800"]}
              animationSpeed={6}
              className="text-5xl md:text-6xl lg:text-[7rem] font-black drop-shadow-2xl"
            >
              THOR!
            </GradientText>
          </motion.div>

          <motion.p variants={childVariant} className="mt-8 text-lg md:text-4xl text-gray-300 font-light leading-relaxed max-w-5xl mx-auto">
            <TextGenerateEffect words='"Mjolnir, forged in the heart of a dying star...' />
          </motion.p>

          <motion.p variants={childVariant} className="text-lg md:text-4xl text-gray-300 font-light leading-relaxed max-w-5xl mx-auto">
            <TextGenerateEffect words="a weapon to destroy..." />
          </motion.p>

          <motion.p variants={childVariant} className="mt-4 text-2xl md:text-3xl font-black text-gold">
            <TextGenerateEffect words="or a tool to build! ~ODIN" />
          </motion.p>

          <motion.div variants={childVariant} className="mt-12">
            <Link href="/pricing">
              <EmeraldShimmer
                title="Wield Mjölnir!"
                position="right"
                otherClasses="text-2xl md:text-2xl px-12 py-6"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator stays — subtle */}
      <motion.div
        className="absolute bottom-10 items-center"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-8 h-14 border-4 border-white/30 rounded-full flex justify-center">
          <div className="w-2 h-6 bg-white/80 rounded-full mt-3 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}