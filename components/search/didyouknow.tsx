// components/DidYouKnow.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
const DidYouKnow = () => {
  const facts = [
    {
      text: "Golden Retrievers were first shown in England at the Crystal Palace show in 1908, and were listed as Flat Coats (Golden).",
    },
    {
      text: "The first three dogs of any breed to achieve the AKC Obedience Champion title, first available in July 1977, were all Golden Retrievers. The first (Ch. Moreland's Golden Tonka) was a bitch, the others were males.",
    },
    {
      text: 'Goldens are among the most popular breeds in America and are familiar faces from numerous media spots, including the movie "Air Bud" and the TV Show "Full House."',
    },
    {
      text: "The first registration of a Golden Retriever by the American Kennel Club was in November 1925.",
    },
    {
      text: "The first registration of a Golden Retriever by the American Kennel Club was in November 1925.",
    },
  ];

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
          {facts.map((fact, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <Card className="bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-md font-semibold"> {fact.text}</span>
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
