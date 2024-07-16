"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/preloader";
import Hero from "../3d/page";

import Prueba from "../prueba/page";
import Galery from "@/components/galery/Galery";

import Text1 from "../text1/page";

export default function LoaderPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);
      }, 2000);
    })();
  }, []);

  return (
    <main>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Hero />
      <Prueba />
      <Galery />
      <Text1 />
    </main>
  );
}
