"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

import { CheckIcon } from "lucide-react";
import { BorderBeam } from "../magicui/border-beam";
import Balancer from "react-wrap-balancer";
import WordPullUp from "../magicui/word-pull-up";

export default function PricingSectionCards() {
  const [isAnnual, setIsAnnual] = useState(false);

  const prices = {
    free: "Gratis",
    premium: isAnnual ? "$420/año" : "$39/mes",
    elite: isAnnual ? "$698/año" : "$59/mes",
  };

  const handleSwitchChange = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <>
      {/* Pricing */}
      <div className="container -mb-8 ">
        {/* Title */}
        <div className="">
          <h3 className="text-4xl font-bold text-center text-primary not-prose mb-6">
            <Balancer>
              <WordPullUp
                className="text-4xl font-bold tracking-[-0.02em]  md:text-6xl md:leading-[5rem]"
                words="Precios justos para el cuidado de tu compañero fiel"
              />
            </Balancer>
          </h3>
          <h4 className="text-2xl font-light text-center opacity-70 not-prose mb-20">
            <Balancer>
              Nuestros servicios se adaptan con cariño al número de mascotas que
              tenga.
            </Balancer>
          </h4>
        </div>
        {/* End Title */}
        {/* Switch */}
        <div className="flex justify-center items-center">
          <Label htmlFor="payment-schedule" className="me-3">
            Mensual
          </Label>
          <Switch
            id="payment-schedule"
            checked={isAnnual}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="payment-schedule" className="relative ms-3">
            Anual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg
                  className="w-14 h-8 -me-6"
                  width={45}
                  height={25}
                  viewBox="0 0 45 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                </svg>
                <Badge className="mt-3 uppercase">Ahorra 10%</Badge>
              </span>
            </span>
          </Label>
        </div>
        {/* End Switch */}
        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          viewport={{ once: true, amount: 0.5 }} // Añadir once: true aquí
        >
          <div className="mt-12 grid sm:grid-cols-1 lg:grid-cols-3 gap-6 lg:items-center">
            {/* Card */}
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="mb-7">Básico</CardTitle>
                <motion.div
                  key={`free-${isAnnual}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <span className="font-bold text-5xl">{prices.free}</span>
                </motion.div>
              </CardHeader>
              <CardDescription className="text-center">
                Para siempre gratis
              </CardDescription>
              <CardContent>
                <ul className="mt-7 space-y-2.5 text-sm">
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">1 mascota</span>
                  </li>
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Acceso limitado a funciones básicas
                    </span>
                  </li>
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Soporte básico a través de FAQs
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={"outline"}>
                  Inscribirse
                </Button>
              </CardFooter>
            </Card>
            {/* End Card */}
            {/* Card */}
            <Card className="border-primary relative">
              <BorderBeam size={250} duration={12} delay={9} />
              <CardHeader className="text-center pb-2">
                <Badge className="uppercase w-max self-center mb-3">
                  Más popular
                </Badge>
                <CardTitle className="!mb-7">Premium</CardTitle>
                <motion.div
                  key={`premium-${isAnnual}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <span className="font-bold text-5xl">{prices.premium}</span>
                </motion.div>
              </CardHeader>
              <CardDescription className="text-center w-11/12 mx-auto">
                {isAnnual ? "Anual" : "Mensual"}
              </CardDescription>
              <CardContent>
                <ul className="mt-7 space-y-2.5 text-sm">
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Hasta 2 mascotas
                    </span>
                  </li>
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Todas las funciones del plan básico + características
                      avanzadas
                    </span>
                  </li>
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Soporte prioritario por correo electrónico y chat en vivo
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Inscribirse</Button>
              </CardFooter>
            </Card>
            {/* End Card */}
            {/* Card */}
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="!mb-7">Élite</CardTitle>
                <motion.div
                  key={`elite-${isAnnual}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  <span className="font-bold text-5xl">{prices.elite}</span>
                </motion.div>
              </CardHeader>
              <CardDescription className="text-center w-11/12 mx-auto">
                {isAnnual ? "Anual" : "Mensual"}
              </CardDescription>
              <CardContent>
                <ul className="mt-7 space-y-2.5 text-sm">
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Hasta 5 mascotas
                    </span>
                  </li>
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Todas las funciones del plan Premium + características
                      exclusivas
                    </span>
                  </li>
                  <li className="flex space-x-2">
                    <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">
                      Soporte VIP con acceso directo a expertos
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={"outline"}>
                  Inscribirse
                </Button>
              </CardFooter>
            </Card>
            {/* End Card */}
          </div>
        </motion.div>
        {/* End Grid */}
      </div>
      {/* End Pricing */}
    </>
  );
}
