import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { motion } from "framer-motion";
import Balancer from "react-wrap-balancer";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden -mt-60 -mb-96 relative">
      <ContainerScroll>
        <div className="-mb-20">---</div>
        <video
          autoPlay
          loop
          muted
          className="mx-auto rounded-2xl h-full object-cover object-left-top"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>
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
        <Balancer>
          <h1 className="text-white  2xl:text-9xl font-bold">Pawpal</h1>
        </Balancer>
      </motion.div>
    </div>
  );
}
