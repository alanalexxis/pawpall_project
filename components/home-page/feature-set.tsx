"use client";
// Layout
import { Section, Container } from "@/components/craft";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import WordPullUp from "@/components/magicui/word-pull-up";
// Icons
import { Dog, ShieldCheck, Heart, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type FeatureText = {
  icon: JSX.Element;
  title: string;
  description: string;
  href?: string;
  cta?: string;
};

const featureText: FeatureText[] = [
  {
    icon: <Dog className="h-6 w-6 text-primary" />,
    title: "Cuidado personalizado",
    href: "/personalized-care",
    description:
      "Ofrecemos cuidados adaptados a las necesidades individuales de cada perro para asegurar su bienestar.",
    cta: "Saber más",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Seguridad garantizada",
    href: "/safety",
    description:
      "Nuestros servicios garantizan la seguridad de tu mascota en todo momento.",
    cta: "Saber más",
  },
  {
    icon: <Heart className="h-6 w-6 text-primary" />,
    title: "Amor y atención",
    href: "/love-and-attention",
    description: "Tratamos a cada perro con el amor y atención que se merece.",
    cta: "Saber más",
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Disponibilidad 24/7",
    href: "/availability",
    description:
      "Estamos disponibles las 24 horas del día, los 7 días de la semana para atender a tu mascota.",
    cta: "Saber más",
  },
];

const FeatureSet = () => {
  return (
    <Section>
      <Container className="not-prose">
        <div className="flex flex-col gap-6">
          <h3 className="text-4xl font-bold text-center text-primary">
            <Balancer>
              <WordPullUp
                className="text-4xl font-bold tracking-[-0.02em]  md:text-6xl md:leading-[5rem]"
                words=" Los mejores servicios para el cuidado de tu perro"
              />
            </Balancer>
          </h3>
          <h4 className="text-2xl font-light text-center  opacity-70">
            <Balancer>Porque tu mascota merece lo mejor</Balancer>
          </h4>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.6 }} // Añadir once: true aquí
          >
            <div className="mt-6 grid gap-6 md:mt-12 md:grid-cols-2">
              {featureText.map(
                ({ icon, title, description, href, cta }, index) => (
                  <Link
                    href={`${href}`}
                    className="flex flex-col justify-between gap-6 rounded-lg border p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                    key={index}
                  >
                    <div className="grid gap-4">
                      <div className="flex justify-center">{icon}</div>
                      <h4 className="text-xl text-center text-primary">
                        {title}
                      </h4>
                      <p className="text-base text-center opacity-75">
                        {description}
                      </p>
                    </div>
                    {cta && (
                      <div className="flex h-fit items-center justify-center text-sm font-semibold">
                        <p>{cta}</p> <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default FeatureSet;
