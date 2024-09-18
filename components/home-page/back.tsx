"use client";
import backgroundImage from "@/public/images/image2.jpg";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { AuroraBackground } from "./aurora-background";

import SparklesText from "@/components/magicui/sparkles-text";
import { Button } from "../ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AuroraBackgroundDemo() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
      }
    };
    fetchUser();
  }, [router, supabase]);
  return (
    <AuroraBackground backgroundImage={backgroundImage.src}>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 "
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          <SparklesText text="Tranquilidad para ti, felicidad para tu perro." />
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          El cuidado perfecto con Pawpal.
        </div>
        <Link href="/login" passHref>
          <Button
            variant={"gooeyLeft"}
            className="text-lg bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-6"
          >
            Comienza ahora
          </Button>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
}
