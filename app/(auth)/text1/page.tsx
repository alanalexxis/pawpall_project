"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";
import { useSpring } from "framer-motion";
import Description from "@/components/description";

const projects = [
  {
    name: "cada perro abandonado",
    handle: "dyal_thak",
  },
  {
    name: "carga una historia",
    handle: "leidinger_matthias",
  },
  {
    name: "de dolor",
    handle: "mark_rammers",
  },
  {
    name: "¿te atreves a descubrirla?",
    handle: "landon_speers",
  },
];

export default function Text1() {
  const spring = {
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  };

  const mousePosition = {
    x: useSpring(0, spring),
    y: useSpring(0, spring),
  };

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  const mouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const targetX = clientX - (window.innerWidth / 2) * 0.25;
    const targetY = clientY - (window.innerWidth / 2) * 0.3;
    mousePosition.x.set(targetX);
    mousePosition.y.set(targetY);
  };

  return (
    <main onMouseMove={mouseMove}>
      <Description mousePosition={mousePosition} projects={projects} />
    </main>
  );
}
