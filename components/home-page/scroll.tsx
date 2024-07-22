"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden -mt-60 -mb-96 relative">
      <ContainerScroll>
        <div className="-mb-20">---</div>
        <Image
          src={`/images/image.webp`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl h-full object-cover object-left-top"
          draggable={false}
        />
      </ContainerScroll>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.9,
          ease: "easeInOut",
        }}
        viewport={{ once: true, amount: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <h1 className="text-white text-9xl font-bold">Pawpal</h1>
      </motion.div>
    </div>
  );
}
