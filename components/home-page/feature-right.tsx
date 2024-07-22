"use client";
// React and Next.js imports
import Link from "next/link";
import Image from "next/image";

// UI component imports
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

// Asset imports
import Placeholder from "@/public/placeholder.jpg";
import { motion } from "framer-motion";

const FeatureRight = () => {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        viewport={{ once: true, amount: 0.5 }} // Añadir once: true aquí
      >
        <Container className="grid items-stretch md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-6 py-8">
            <h3 className="!my-0">Lorem ipsum dolor sit</h3>
            <p className="font-light leading-[1.4] opacity-70">
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua.
            </p>
            <div className="not-prose flex items-center gap-2">
              <Button className="w-fit" asChild>
                <Link href="#">Get Started</Link>
              </Button>
              <Button className="w-fit" variant="link" asChild>
                <Link href="#">Learn More {"->"}</Link>
              </Button>
            </div>
          </div>
          <div className="not-prose relative flex h-96 overflow-hidden rounded-lg border">
            <Image
              src={Placeholder}
              alt="placeholder"
              className="fill object-cover"
            />
          </div>
        </Container>
      </motion.div>
    </Section>
  );
};

export default FeatureRight;
