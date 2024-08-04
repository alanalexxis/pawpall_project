"use client";
// React and Next.js imports
import Link from "next/link";

// Third-party library imports
import Balancer from "react-wrap-balancer";
import { ArrowRight } from "lucide-react";

// Local component imports
import { Section, Container } from "@/components/craft";
import { Button } from "../ui/button";

import { HeroScrollDemo } from "./scroll";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        viewport={{ once: true, amount: 0.5 }} // Añadir once: true aquí
      >
        <Container>
          <div>
            <Button
              asChild
              className="mb-6 w-fit"
              size={"sm"}
              variant={"outline"}
            >
              <Link className="not-prose" href="https://9d8.dev">
                Leer más <ArrowRight className="w-4" />
              </Link>
            </Button>
            <h1 className="text-primary">
              <Balancer>Nuestra historia</Balancer>
            </h1>
            <h3 className="text-muted-foreground">
              <Balancer>
                En Pawpal, nuestro objetivo es hacer que el cuidado de tus
                mascotas sea más fácil y lleno de cariño. Hemos creado una
                plataforma para ayudarte a mantener a tus amigos peludos felices
                y saludables. Gracias a tu confianza, seguimos dedicados a
                ofrecerte las mejores herramientas para que cada momento con tus
                mascotas sea especial.
              </Balancer>
              <HeroScrollDemo />
            </h3>
          </div>
        </Container>
      </motion.div>
    </Section>
  );
};

export default Hero;
