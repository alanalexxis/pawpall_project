import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRaza } from "@/contexts/razaContext";

const DidYouKnow = () => {
  const { facts } = useRaza();

  return (
    <div className="py-8 px-10">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary mb-8 text-center">
        ¡Increíble pero cierto! ¿Lo sabías?
      </h1>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full "
      >
        <CarouselContent>
          {facts.map((fact) => (
            <CarouselItem key={fact.id} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card className="bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200 text-black">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-md font-semibold">{fact.fact}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default DidYouKnow;
