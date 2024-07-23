"use client";
// React and Next.js imports
import Link from "next/link";
import Image from "next/image";

// UI component imports
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

// Asset imports
import Placeholder from "@/public/images/image4.jpg";
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
            <h3 className="!my-0">Cuida a tu mejor amigo</h3>
            <p className="font-light leading-[1.4] opacity-70">
              Proporciona a tu perro el mejor cuidado posible con nuestra
              aplicación. Desde paseos hasta alimentación, estamos aquí para
              ayudarte a mantener a tu mascota feliz y saludable.
            </p>
            <div className="not-prose flex items-center gap-2">
              <Button className="w-fit" asChild>
                <Link href="#">Empieza ahora</Link>
              </Button>
              <Button className="w-fit" variant="link" asChild>
                <Link href="#">Más información {"->"}</Link>
              </Button>
            </div>
          </div>
          <div className="not-prose relative flex h-96 overflow-hidden rounded-lg border">
            <video autoPlay loop muted className="fill object-cover">
              <source src="/videos/hero2.mp4" type="video/mp4" />
            </video>
          </div>
        </Container>
      </motion.div>
    </Section>
  );
};

export default FeatureRight;
