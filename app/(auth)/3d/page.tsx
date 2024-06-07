"use client";
import dynamic from "next/dynamic";
import React, { useRef } from "react";
import { useScroll } from "framer-motion";
const Scene = dynamic(() => import("@/components/scene"), {
  ssr: false,
});

export default function Hero() {
  const container = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <main>
      <div ref={container} className="h-[300vh]">
        <div className="sticky top-0 h-screen">
          <Scene scrollProgress={scrollYProgress} />
        </div>
      </div>
      <div className="h-screen"></div>
    </main>
  );
}
